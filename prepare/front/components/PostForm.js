/*
  로그인 된 상태(state)에서 내가 글을 작성할 수 있는 기능이다. 
  index.js 페이지의 자식 컴포넌트이다.
*/

import React, { useCallback, useEffect, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addPost, UPLOAD_IMAGES_REQUEST } from '../reducers/post';
import useinput from '../hooks/useinput';

const PostForm = () => {
  const { imagePaths, addPostDone } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const [text, onChangeText, setText] = useinput('');

  useEffect(() => {
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone]);

  const onSubmit = useCallback(() => {
    dispatch(addPost(text));
    console.log(text);
  }, [text]);

  const imageInput = useRef();

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
    //버튼을 눌러서 사진 업로드창 띄우기
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    console.log('images', e.target.files); // 우리가 선택한 이미지에 대한 정보가 들어있음
    const imageFormData = new FormData(); // FormData를 사용하면 Multipart 형식으로 서버로 보낼 수 있다. 그래야 multer가 처리할 수 있다.
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f); // routes/post에서 upload.array('image')의 값과 같아야 한다.
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea value={text} onChange={onChangeText} maxLength={140} placeholder="어떤 신기한 일이 있었나요?" />
      <div>
        <input type="file" name="image" multiple hidden ref={imageInput} onChange={onChangeImages} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit">
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map((v) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={v} style={{ width: '200px' }} alt={v} />
            <div>
              <Button>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
