import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Button, Card, Comment, List, Popover } from 'antd';
import { HeartOutlined, MessageOutlined, RetweetOutlined, EllipsisOutlined, HeartTwoTone } from '@ant-design/icons';
import Link from 'next/link';
import moment from 'moment';

import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import FollowButton from './FollowButton';
import { LIKE_POST_REQUEST, REMOVE_POST_REQUEST, UNLIKE_POST_REQUEST, RETWEET_REQUEST, UPDATE_POST_REQUEST } from '../reducers/post';

moment.locale('ko');

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { removePostLoading } = useSelector((state) => state.post);
  const [commentFormOpened, setCommentFormOpened] = useState(false); // onLike 토글 기능을 통해 true <-> false를 이용하는 함수
  const id = useSelector((state) => state.user.me?.id);
  const liked = post.Likers.find((v) => v.id === id); // 게시글 좋아요 누른 사람중에 내가 있는지?
  const [editMode, setEditMode] = useState(false);

  const onClickUpdate = useCallback(() => {
    console.log('수정 버튼 클릭!');
    setEditMode(true);
  }, []);

  const onCancelUpdate = useCallback(() => {
    console.log('취소 버튼 클릭!');
    setEditMode(false);
  }, []);

  // 고차함수로 받는 이유는 하위 컴포넌트 PostCardContent에 editText를 넣어주기 위함이다.
  // PostCardContent에서 onChangePost를 만들지 않은 이유는 REQUEST 액션을 통해 데이터를 넘겨줄 때, PostCardContent에서 dispatch 시킨다면 데이터도 props로 넘겨줘야 하기 때문이다.
  // 🌟 onChangePost에서 고차함수를 쓴 이유 ?
  // 역으로 value값인 editText를 PostCardContent에서 useState를 통해 수정 값(value)를 상위 컴포넌트인 PostCard로 가져와 이 정보(data)를 dispatch 시키기 위해 고차함수를 통해 (editText)를 넣어줬다고 볼 수 있다. 🌟
  const onChangePost = useCallback(
    (editText) => () => {
      dispatch({
        type: UPDATE_POST_REQUEST,
        data: {
          PostId: post.id,
          content: editText,
        },
      });
    },
    [post],
    console.log(post)
  );

  const onLike = useCallback(() => {
    if (!id) {
      return alert(' 로그인이 필요합니다.');
    }
    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id, // user.id는 백엔드의 req.user에 들어있으므로(deserializeUser에 의해 역직렬화됨) 넣어줄 필요 없다.
    });
  }, []);

  const onUnlike = useCallback(() => {
    if (!id) {
      return alert(' 로그인이 필요합니다.');
    }
    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, []);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert(' 로그인이 필요합니다.');
    }
    return dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, []);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert(' 로그인이 필요합니다.');
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id]);

  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked ? <HeartTwoTone twoToneColor="#eb2f96" key="heart" onClick={onUnlike} /> : <HeartOutlined key="heart" onClick={onLike} />,
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    {!post.RetweetId && <Button onClick={onClickUpdate}>수정</Button>}
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
        title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
        extra={id && <FollowButton post={post} />}
      >
        {post.RetweetId && post.Retweet ? (
          <Card cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}>
            <div style={{ float: 'right' }}>{moment(post.createdAt, 'YYYYMMDD').fromNow()}</div>

            <Card.Meta
              avatar={
                <Link href={`/user/${post.Retweet.User.id}`}>
                  <a>
                    <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.Retweet.User.nickname}
              description={<PostCardContent postData={post.Retweet.content} onCancelUpdate={onCancelUpdate} onChangePost={onChangePost} />}
            />
          </Card>
        ) : (
          <>
            <div style={{ float: 'right' }}>{moment(post.createdAt, 'YYYYMMDD').fromNow()}</div>
            <Card.Meta
              avatar={
                <Link href={`/user/${post.User.id}`}>
                  <a>
                    <Avatar>{post.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.User.nickname}
              description={
                <PostCardContent editMode={editMode} onCancelUpdate={onCancelUpdate} onChangePost={onChangePost} postData={post.content} />
              }
            />
            {/* editMode는 true이면 textarea를 보여주고 false면 기존 게시글을 보여줍니다. */}
          </>
        )}
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
                <Comment
                  author={item.User.nickname}
                  avatar={
                    <Link href={`/user/${item.User.id}`}>
                      <a>
                        <Avatar>{item.User.nickname[0]}</Avatar>
                      </a>
                    </Link>
                  }
                  content={item.content}
                />
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
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;
