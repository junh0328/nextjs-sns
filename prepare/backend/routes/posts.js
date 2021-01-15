// post를 여러 개 가져오는 라우팅처리

const express = require('express');
const { Op } = require('sequelize'); // sequelize에서 제공하는 연산자 Operator >> Op

const { Post, User, Image, Comment } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
  // GET /posts 실행시에 여러개의 게시물들을 가져옴, get 방식임을 유의해서 볼 것
  // return axios.get(`/posts?lastId=${lastId || 0}`); 에서 데이터를 넘겨받는다.
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) {
      // 초기 로딩이 아닐 때 > 스크롤을 내려서 더 posts들을 불러올 때
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
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;

/**
 * findAll()  : 전부 가져오기
 * findAll()의 속성
 * 1. where : { UserId: 1} userId 가 1인 사람의 post 전부 가져오기
 * 2. limit : 정수 >> 10개씩 끊어서 가져와라 > 스크롤 내리면 10개 가져오고, 스크롤 내리면 10개 가져오기
 * 3. offset : n >> n+1~n+10 번 게시물을 가져와라 >> offset: 10 >> 11번 부터 20번
 * 4. order:  [['createdAt', 'DESC']]  >> mySQL의 order by와 같다 정렬 기준과 정렬 순서를 나타낼 수 있는 속성
 */

// 하지만 실무에서는 limit <-> offset 방법을 잘 쓰지 않음 why? 중간에 사람이 게시글을 지우거나 추가하면 변동사항이 제대로 적용되지 않을 수 있기 때문이다.
// 띠리서 실무에서는 limit 과 where: { id : lastId } 를 자주 쓰는 편이다.
