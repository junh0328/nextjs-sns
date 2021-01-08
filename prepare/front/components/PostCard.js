import { Avatar, Button, Card, Comment, List, Popover } from 'antd';
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { HeartOutlined, MessageOutlined, RetweetOutlined, EllipsisOutlined, HeartTwoTone } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import { LIKE_POST_REQUEST, REMOVE_POST_REQUEST, UNLIKE_POST_REQUEST } from '../reducers/post';
import FollowButton from './FollowButton';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { removePostLoading } = useSelector((state) => state.post);

  const [commentFormOpened, setCommentFormOpened] = useState(false);
  // onLike 토글 기능을 통해 true <-> false를 이용하는 함수

  const onLike = useCallback(() => {
    dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id, // user.id는 백엔드의 req.user에 들어있으므로(deserializeUser에 의해 역직렬화됨) 넣어줄 필요 없다.
    });
  }, []);

  const onUnlike = useCallback(() => {
    dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, []);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, []);

  const id = useSelector((state) => state.user.me?.id);
  const liked = post.Likers.find((v) => v.id === id); // 게시글 좋아요 누른 사람중에 내가 있는지?

  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" />,
          liked ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnlike} /> : <HeartOutlined key="heart" onClick={onLike} />,

          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    <Button>수정</Button>
                    <Button type="danger" loading={removePostLoading} onClick={onRemovePost}>
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        // 로그인을 했을 때만 팔로우버튼이 보여야 할 것
        // 팔로우 버튼을 눌렀다면, 언팔로우 버튼이 보이도록 할 것
        extra={id && <FollowButton post={post} />}
      >
        <Card.Meta
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={post.User.nickname}
          description={<PostCardContent postData={post.content} />}
        />
      </Card>
      {commentFormOpened && (
        <>
          <CommentForm post={post} />
          <List
            header={`${post.Comments ? post.Comments.length : 0}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={(item) => (
              <li>
                <Comment author={item.User.nickname} avatar={<Avatar>{item.User.nickname[0]}</Avatar>} content={item.content} />
              </li>
            )}
          />
        </>
      )}
    </div>
  );
};
PostCard.propTypes = {
  // PropTypes가 obejct일 경우 shape() 메소드를 통해 안에 들어있는 객체를 구체적으로 관리할 수 있다.
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default PostCard;
