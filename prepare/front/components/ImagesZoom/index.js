/*
ImagesZoom을 폴더로 만들고 index 페이지로 나눈 이유는 styled-components로 인해 코드의 양이 방대해지는데, 이를 style.js와 같이 분리하여 관리하기 위해
ImagesZoom을 페이지가 아닌 폴더로 만들었다. (css 파일을 없앴기 때문)
가장 중요한 파일을 index.js로 만들고 스타일 페이지를 styles.js로 만들어 import <->export 시킨다.
*/

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import { CloseBtn, Global, ImgWrapper, Indicator, Overlay, SlickWrapper, Header } from './styles';

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <Overlay>
      <Global />
      <Header>
        <h1>상세 이미지</h1>
        <CloseBtn onClick={onClose}>X</CloseBtn>
      </Header>
      <SlickWrapper>
        <div>
          <Slick
            initialSlide={0} // 초기 슬라이드 0번째 이미지
            beforeChange={(slide) => setCurrentSlide(slide)}
            infinite // 마지막 이미지에서 넘기면 다시 첫 번째 이미지로
            arrows={false} // 슬라이드 양 옆의 화살표를 없앰
            slidesToShow={1} // 슬라이드에 한 이미지만 보이기
            slidesToScroll={1} // 한번 슬라이드 시 한 이미지만 넘기기
          >
            {images.map((v) => (
              <ImgWrapper key={v.src}>
                <img src={v.src} alt={v.src} />
              </ImgWrapper>
            ))}
          </Slick>
          {/* 이미지 중 몇 번째 장을 보고있는지 가리키는 indicator 스타일드 컴포넌트 */}
          <Indicator>
            <div>
              {currentSlide + 1} / {images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
