import React, { useState } from "react";
import PropTypes from "prop-types";
import Slick from "react-slick";
import styled from "styled-components";

const Overlay = styled.div`
  postion: fixed;
  z-index: 5000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Header = styled.header`
  height: 44px;
  background: white;
  position: relative;
  padding: 0;
  text-align: center;

  & h1 {
    margin: 0;
    font-size: 14px;
    color: #333;
    line-height: 44px;
  }

  & button {
    position: absolute;
    right: 0px;
    top: 0px;
    padding: 15px;
    line-height: 14px;
    cursor: pointer;
  }
`;

const SlickWrapper = styled.div`
  height: calc(100% - 44px);
  background: #090909;
`;

const ImageWrapper = styled.div`
  padding: 32px;
  text-align: center;

  & img {
    margin: 0 auto;
    max-height: 750px;
  }
`;

const Indicator = styled.div`
  text-align: center;

  & > div {
    width: 75px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    background: #313131;
    display: inline-block;
    text-align: center;
    color: white;
    font-size: 15px;
  }
`;

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <Overlay>
      <Header>
        <h1>상세 이미지</h1>
        <button onClick={onClose}>X</button>
      </Header>
      <SlickWrapper>
        <div>
          <Slick
            initialSlide={0} // 초기 슬라이드 0번째 이미지
            afterChange={(slide) => setCurrentSlide(slide)}
            infinite // 마지막 이미지에서 넘기면 다시 첫 번째 이미지로
            arrows={false} // 슬라이드 양 옆의 화살표를 없앰
            slidesToShow={1} // 슬라이드에 한 이미지만 보이기
            slidesToScroll={1} // 한번 슬라이드 시 한 이미지만 넘기기
          >
            {images.map((v) => (
              <ImageWrapper key={v.src}>
                <img src={v.src} alt={v.src} />
              </ImageWrapper>
            ))}
          </Slick>
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
