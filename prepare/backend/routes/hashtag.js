const express = require('express');
const { Op } = require('sequelize');

const { Post, Hashtag, Image, Comment, User } = require('../models');

const router = express.Router();

//  특정 해시태그가 들어있는 게시글만 가져오기
router.get('/:hashtag', async (req, res, next) => {
  // GET /Hashtag/노드
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) {
      where.id = {
        [Op.lt]: parseInt(req.query.lastId, 10), // id가 lastId 보다 작은 게시물 10개를 불러와라
      };
    } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'], // 처음에 게시글의 생성일을 기준으로 내림차순 정렬
        [Comment, 'createdAt', 'DESC'], // 그 안에 들어있는 댓글들을 생성일 기준으로 내림차순 정렬
      ],
      include: [
        {
          model: Hashtag,
          where: { name: decodeURIComponent(req.params.hashtag) },
          // sagas에서 넘겨줄 때 한글을 넘겨줄 수 없기 때문에 >> react라는 한글을 encodeURIComponet()로 감싸 보내주었다.
          // 따라서 라우터쪽에서는 인코딩된 한글을 디코딩하여 사용한다.
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
              model: User, //댓글의 작성자
              attributes: ['id', 'nickname'],
            },
          ],
        },
        {
          model: User, // 좋아요 누른 사람
          as: 'Likers',
          attributes: ['id'],
        },
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
      ],
    }); // 지금까지 작성한 모든 게시글을 보여줄 것.
    // console.log(posts);
    console.log('posts는 ?');
    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;

/*
where 절 3개에 만족하는 조건에 따른 결과물이 도출된다. 
ctrl + F where로 확인!

조건 1 lastId 10개
조건 2 최대 10개, 만들어진 순으로, DESC [내림차순]
조건 3 hashtag는 req.params를 통해 전달되는 hashtag (사용자가 요청한 입력 대상)
*/
