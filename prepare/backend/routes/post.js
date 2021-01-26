const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Comment, User, Image, Hashtag } = require('../models');

const { isLoggedIn } = require('./middlewars');

const router = express.Router();

try {
  fs.accessSync('uploads');
} catch (error) {
  console.log('uploads 폴더가 없으므로 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  // multer 속성 지정  storage(저장 어디에 할꺼야?)
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads'); // uploads라는 폴더에 할거야 >> 후에 아마존에 올리면 아마존 서버에 저장, S3 서비스로 대체
    },
    filename(req, file, done) {
      // 파일명 : 제로초.png
      const ext = path.extname(file.originalname); // 확장자 추출(.png) > 업로드 시에 날짜를 붙여 중복 파일 명을 바꾼다.
      const basename = path.basename(file.originalname, ext); // 제로초
      done(null, basename + '_' + new Date().getTime() + ext); // 제로초17382309217.png
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB로 용량 제한
});

// 포스트(게시글) 작성
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  // POST /post
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
      // 모델에 들어있는 UserId <-> userId가 아님..
    });
    //  이미지가 있을 때
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          })
        )
      ); // [[노드, true], [리액트, true]] 와 같은 형식으로 저장되므로 map() 함수를 돌리는 방법이 달라졌다.
      await post.addHashtags(result.map((v) => v[0]));
    }
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        // 이미지를 여러 개 올리면 image: [제로초.png , 부기초.png] >> 배열로 올라감
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        // 매핑하여 시퀄라이즈 테이블에 올려준다. 파일 주소는 db에 저장되고 파일 자체는 uploads 폴더에 저장됨
        await post.addImages(images);
      } else {
        // 이미지를 하나만 올린 경우 image: 제로초.png >> 주소로 나옴
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image, // 후에 include 시에 이미지들이 알아서 post.Images로 들어가게 된다.
        },
        {
          model: Comment,
          include: [
            {
              model: User, // 댓글 작성자
              attributes: ['id', 'nickname'],
            },
          ],
        },
        {
          model: User, // 게시글 작성자
          attributes: ['id', 'nickname'],
        },
        {
          model: User, // 좋아요 누른 사람
          as: 'Likers',
          attributes: ['id'],
        },
      ],
    });
    res.status(201).json(fullPost);
    // console.log('fullPost는 다음과 같습니다. : ' + fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => {
  //POST /post/images ,
  // console.log(req.files);
  res.json(req.files.map((v) => v.filename));
});

/* 
여기서 파라미터로 받는 /:postId 는 models에서 belongsTo 관계에서 생기는 PostId가 아닌,
프론트에서 json 형식의 data { postId: post.id }의 postId이므로 헷갈리면 안된다.
시퀄라이즈에 의해 생성된 Id는 단어 앞이 대문자임을 명심 ㅎㅎ

postId는 컴포넌트 <CommentForm/> 에서 ADD_COMMENT_REQUEST의 {data : .... } 데이터이다.
*/

// 특정 게시글에 댓글달기
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  // POST /post/1/comment
  console.log('req.params는 ?');
  console.log(req.params);
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ['id', 'nickname'],
        },
      ],
    });
    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
// 게시글 좋아요
router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  // PATCH /post/1/like  >> ${data} = post.id
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    // post가 있다면, models/post의 관계에 따라 나타낸다
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id }); // sagas/post 에서 likePost 의 data : result.data로 PostId와 UserId가 넘어간다.
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
// 게시글 좋아요 삭제
router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
  // DELETE /post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    // post가 있다면, models/post의 관계에 따라 나타낸다
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id }); // sagas/post 에서 likePost 의 data : result.data로 PostId와 UserId가 넘어간다.
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

//게시글 수정
router.patch('/:postId', isLoggedIn, async (req, res, next) => {
  // PATCH /post/10
  const hashtags = req.body.content.match(/#[^\s#]+/g);
  try {
    await Post.update(
      {
        content: req.body.content,
      },
      {
        where: {
          id: req.params.postId,
          UserId: req.user.id,
        },
      }
    );
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          })
        )
      ); // [[노드, true], [리액트, true]]
      await post.setHashtags(result.map((v) => v[0]));
    }
    res.status(200).json({ PostId: parseInt(req.params.postId, 10), content: req.body.content });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
// 게시글 삭제
router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  //DELETE /post/10
  try {
    await Post.destroy({
      // 시퀄라이즈에서는 제거할 때 destroy 문법을 사용한다.
      where: {
        id: req.params.postId,
        UserId: req.user.id, // 게시글 아이디와 postId가 같고 내가 쓴 글일 때만 delete를 시킬 수 있도록 조건문을 부여했다.
      },
    });
    return res.status(200).json({ PostId: parseInt(req.params.postId, 10) }); // 🌟parseInt를 하지 않으면 PostId가 params에 의해 문자열로 받게 된다. 🌟
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
// 특정 게시글 가져오기
router.get('/:postId', async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [
        {
          model: User,
          attributes: ['id', 'nickname'],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
              order: [['createdAt', 'DESC']],
            },
          ],
        },
        {
          model: User, // 좋아요 누른 사람
          as: 'Likers',
          attributes: ['id'],
        },
      ],
    });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});
// 특정 게시글 리트윗하기
router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
  // POST /post/1/retweet
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId }, // 리트윗 할 게시물이 존재하는 지 찾아보는 where 절
      include: [
        {
          model: Post,
          as: 'Retweet',
        },
      ],
    });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
      // 1. 자기 게시글을 리트윗하는 경우/ 2. 자기 게시글을 리트윗한 게시글을 리트윗하는 경우를 막아줘야함
      return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
    }
    const retweetTargetId = post.RetweetId || post.id;
    // 일반 타인이 쓴 게시글이거나, 타인(B)이 다른 타인(A)의 리트윗한 게시글은 리트윗할 수 있으므로 이렇게 로직을 설정하였다.
    // 사용자가 타인(B)의 게시글을 리트윗할 때 본래 트윗의 주인(A)의 게시글을 리트윗할 수 있도록 만든 로직이다.
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      return res.status(403).send('이미 리트윗된 게시글입니다.');
    }
    // 전부 통과된 경우
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: 'retweet', // model 설정에서 allowNull(빈 값)을 넣지 못하게 만들었음..
    });
    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [
        {
          model: Post,
          as: 'Retweet',
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
            },
            {
              model: Image,
            },
          ],
        },
        {
          model: User,
          attributes: ['id', 'nickname'],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
            },
          ],
        },
        {
          model: User,
          as: 'Likers',
          attributes: ['id'],
        },
      ], // 댓글 부분은 게시글에서 바로 보여지는 부분이 아니기 때문에 추가적으로 로직이 길어진다면, routes를 새로 만들어 ('/comments'), (reducer, saga 포함) 그 행동을 할 때 {ex) loadComment} 등 을 만들어 분리해줘도 된다.
    });
    res.status(201).json(retweetWithPrevPost);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;

/* 
  PostForm에서 넘어오는 이미지이고 여러장 올 수 있게 설정했으므로 array로 설정하였다.
  - upload.none() 이미지 없음(텍스트)
  - upload.array() 이미지 여러장
  - upload.single() 이미지 한장
*/
