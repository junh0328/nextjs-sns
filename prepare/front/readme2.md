# 들어가기 앞서

- 아래의 함수들은 모두 immer로 처리되어 있으며, 불변성을 지키지 않은 상태입니다.
- javascript 문법 위주로 보기를 권장합니다.

# 유저 기능 관련 리듀서 함수 정리

1. 팔로우 하기

```js
      case FOLLOW_SUCCESS:
        draft.followLoading = false;
        draft.me.Followings.push({ id: action.data.UserId });
        draft.followDone = true;
        break;
```

2. 언팔로우 하기

```js
      case UNFOLLOW_SUCCESS:
        draft.unfollowLoading = false;
        draft.me.Followings = draft.me.Followings.filter((v) => v.id !== action.data.UserId);
        draft.unfollowDone = true;
        break;
```

3. 게시물 추가하기

```js
      case ADD_POST_TO_ME:
        draft.me.Posts.unshift({ id: action.data });
        break;
      // return {
      //   ...state,
      //   me: {
      //     ...state.me,
      //     Posts: [{ id: action.data }, ...state.me.Posts],
      //   },
      // };
```

# 포스트 기능 관련 리듀서 함수 정리

1. 게시글 좋아요 누르기

```js
      case LIKE_POST_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post.Likers.push({ id: action.data.UserId });
        draft.likePostLoading = false;
        draft.likePostDone = true;
        break;
      }
```

2. 게시글 좋아요 취소하기

```js
      case UNLIKE_POST_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post.Likers = post.Likers.filter((v) => v.id !== action.data.UserId);
        draft.unlikePostLoading = false;
        draft.unlikePostDone = true;
        break;
      }
```

3. 포스트 불러오기 (인피니티 스크롤 관련)

```js
      case LOAD_POSTS_SUCCESS: {
      draft.loadPostsLoading = false;
      draft.loadPostsDone = true;
      draft.mainPosts = draft.mainPosts.concat(action.data);
      // load posts 성공 시, 기존 데이터와 더미데이터를 합쳐주는 역할
      draft.hasMorePost = draft.mainPosts.length === 10;
      // 마지막으로 불러오는 posts의 갯수가 10개일 때까지 >> 8개 남을 경우 그게 마지막 LOAD_POSTS_REQUEST가 된다.
      // 작성된 게시글이 10개일 경우, hasMorePost가 true인 상태에서 한 번 더 불러와야 hasMorePosts 가 false가 된다.
      break;
    }
```

4. 게시글 추가하기

```js
      case ADD_POST_SUCCESS: {
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.mainPosts.unshift(action.data);
        draft.imagePaths = [];
        break;
      }
```

5. 게시글 수정하기

```js
  case UPDATE_POST_SUCCESS: {
        draft.updatePostLoading = false;
        draft.updatePostDone = true;
        draft.mainPosts.find((v) => v.id === action.data.PostId).content = action.data.content;
        break;
      }
```

6. 게시글 삭제하기

```js
    case REMOVE_POST_SUCCESS: {
    draft.removePostLoading = false;
    draft.removePostDone = true;
    draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data.PostId);
    break;
  }
```

7. 게시글 댓글달기

```js
      case ADD_COMMENT_SUCCESS: {
        const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
        post.Comments.unshift(action.data);
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;
      }
```

# 함수 사용하기

|    값     |                                            의미                                            |
| :-------: | :----------------------------------------------------------------------------------------: |
| unshift() |    unshift() 메서드는 새로운 요소를 배열의 맨 앞쪽에 추가하고, 새로운 길이를 반환합니다    |
|  find()   | 이 find()메서드는 제공된 테스트 함수를 충족하는 제공된 배열의 첫 번째 요소 값을 반환합니다 |
|  push()   |    이 push()메서드는 배열 끝에 하나 이상의 요소를 추가하고 배열의 새 길이를 반환합니다.    |

더 많은 Array.prototypes 보기
https://developer.mozilla.org/en-US/search?q=Array.prototype
