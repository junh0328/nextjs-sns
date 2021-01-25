import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Button, Input } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const { TextArea } = Input;
const PostCardContent = ({ postData, editMode, onChangePost, onCancelUpdate }) => {
  const { updatePostLoading, updatePostDone } = useSelector((state) => state.post);
  const [editText, setEditText] = useState(postData);

  useEffect(() => {
    if (updatePostDone) {
      onCancelUpdate();
    }
  }, [updatePostDone]);

  const onChangeText = useCallback((e) => {
    setEditText(e.target.value);
  });

  return (
    // 첫 번째 게시글 #해시태그 #해시태그
    <div>
      {editMode ? (
        <>
          <TextArea value={editText} onChange={onChangeText} />
          <Button.Group>
            <Button loading={updatePostLoading} onClick={onChangePost(editText)}>
              수정
            </Button>
            <Button type="danger" onClick={onCancelUpdate}>
              취소
            </Button>
          </Button.Group>
        </>
      ) : (
        postData.split(/(#[^\s#]+)/g).map((v, i) => {
          if (v.match(/(#[^\s#]+)/)) {
            return (
              <Link href={`/hashtag/${v.slice(1)}`} prefetch={false} key={i}>
                <a>{v}</a>
              </Link>
            );
          }
          return v;
        })
      )}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
  onChangePost: PropTypes.func.isRequired,
  onCancelUpdate: PropTypes.func.isRequired,
};

PostCardContent.defaultProps = {
  editMode: false,
};

export default PostCardContent;

/*
https://regexr.com/ 정규식 테스트 사이트
//g 에서 g는 global로 여러개의 문자열을 받을 수 있다.
split 함수를 통해 해당 정규식이 포함된 postData만을 분리하고, 매핑하는데, slice(1)은 문자열의 맨 앞에 붙어있는 '#'을 떼주기 위함이다.
따라서 해시태그 {url/해당해시태그}를 통해 해당해시태그가 포함된 글을 검색할 수 있게 되었다.
*/
