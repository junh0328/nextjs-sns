export const initialState = {
  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: "이준희",
      },
      content: "첫 번째 게시글 #해시태그 #익스프레스",
      Images: [
        {
          src:
            "https://cafethumb.pstatic.net/MjAyMDEyMjBfOTUg/MDAxNjA4NDU4MTUzMzM2.y-eEU0IKILIco7F9UrkZXXArXs3Fv9xAujbF4Vs3yegg.2jGF9zu2ijJYX1Ee69DmD_37LSGqA4i-jYXBxRkI1Ygg.JPEG/B4744585-AB93-46A6-83CA-3C5951DD8E08.jpeg?type=f200_200",
        },
        {
          src:
            "https://cafethumb.pstatic.net/MjAyMDEyMTdfNjkg/MDAxNjA4MTk1OTgzNTQ4.NWDqjEMsiy6HHH5O_2Ou0-nxLE1Hk0FVZNTBCHKT_n8g.gL0EDfWXBx-PdV_yXyzx3KAYGqPr1wXudTFpD58qbJEg.JPEG/IMG_6644.jpg?type=f200_200",
        },
        {
          src:
            "https://cafethumb.pstatic.net/MjAyMDEyMTZfMTk0/MDAxNjA4MTAzNDA2NDcx.uv8-ngClC-GC56EXXDXCY9ywPkspDKowlvpgW76PG00g.sYndGDvg-IjBnGknv_vtn9YId00P_2l83DinezkgZi0g.PNG/%BD%BA%C5%A9%B8%B0%BC%A6_2020-12-16_%BF%C0%C8%C4_4.21.25.png?type=f200_200",
        },
      ],
      Comments: [
        {
          User: {
            nickname: "nero",
          },
          content: "어디서 사셨나요? 정보좀요!",
        },
        {
          User: {
            nickname: "zeroCho",
          },
          content: "잘 어울려요 찰떡!",
        },
      ],
    },
  ],
  imagePaths: [],
  postAdded: false,
};

// 액션 생성함수를 다음과 같이 상수로 지정한다면, reducer에서 오류 나는 것을 사전에 잡을 수 있다.
const ADD_POST = "ADD_POST";
export const addPost = {
  type: ADD_POST,
};

const dummyPost = {
  id: 2,
  content: "더미데이터입니다.",
  User: {
    id: 1,
    nickname: "이준희",
  },
  Images: [],
  Comments: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST: {
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts],
        // dummyPost를 파라미터 중 앞에다 추가해야 게시글 가장 위에 나열된다!
        postAdded: true,
      };
    }
    default:
      return state;
  }
};
export default reducer;
