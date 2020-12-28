import shortID from "shortid";

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
            "https://images-na.ssl-images-amazon.com/images/I/71YuNHQDL5L._AC_SL1500_.jpg",
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
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,

  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};

// 액션 생성함수를 다음과 같이 상수로 지정한다면, reducer에서 오류 나는 것을 사전에 잡을 수 있다.
export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

const dummyPost = (data) => ({
  id: shortID.generate(),
  content: data,
  User: {
    id: 1,
    nickname: "준희",
  },
  Images: [],
  Comments: [],
});

const dummyComment = (data) => ({
  id: shortID.generate(),
  content: data,
  User: {
    id: 1,
    nickname: "준희",
  },
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST_REQUEST:
      return {
        ...state,
        addPostLoading: true,
        addPostDone: false,
        addPostError: null,
      };
    case ADD_POST_SUCCESS: {
      return {
        ...state,
        // mainPosts에는 자신의 글 뿐만 아니라,  (댓글은 id를 통해 관리된다.) Comments를 통해 들어오는 댓글도 관리된다.
        mainPosts: [dummyPost(action.data), ...state.mainPosts],
        // dummyPost를 파라미터 중 앞에다 추가해야 게시글 가장 위에 나열된다!
        addPostLoading: false,
        addPostDone: true,
      };
    }
    case ADD_POST_FAILURE:
      return {
        ...state,
        addPostLoading: false,
        addPostError: action.error,
      };
    case ADD_COMMENT_REQUEST:
      return {
        ...state,
        addCommentLoading: true,
        addCommentDone: false,
        addCommentError: null,
      };
    case ADD_COMMENT_SUCCESS: {
      // action.data.content, postId, userId 가 들어옴 > ADD_POST_SUCCESS로 전달됨
      const postIndex = state.mainPosts.findIndex(
        (y) => y.id === action.data.postId
      );
      const post = { ...state.mainPosts[postIndex] };
      const Comments = [dummyComment(action.data.content), ...post.Comments];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { post };

      return {
        ...state,
        addCommentLoading: false,
        addCommentDone: true,
      };
    }
    case ADD_COMMENT_FAILURE:
      return {
        ...state,
        addCommentLoading: false,
        addCommentError: action.error,
      };

    default:
      return state;
  }
};
export default reducer;
