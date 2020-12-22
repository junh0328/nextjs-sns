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
            "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/airpods-max-hero-select-202011_FMT_WHH?wid=750&hei=556&fmt=jpeg&qlt=80&op_usm=0.5%2C0.5&.v=1603842301000",
        },
        {
          src:
            "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/MWP22?wid=2000&hei=2000&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=1591634795000",
        },
        {
          src:
            "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/airpods-max-hero-select-202011_FMT_WHH?wid=750&hei=556&fmt=jpeg&qlt=80&op_usm=0.5%2C0.5&.v=1603842301000",
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
