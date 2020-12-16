# Hello, Next.js

- Next.js에서는 pages 폴더에 페이지를 처리해줘야 하는데 next 라이브러리에서 pages 폴더를 인식하여 코드 스플리팅을 해주기 때문이다.
- Next가 page안에 있는 페이지들을 라우팅 처리를 해주지 않아도 url창에 파라미터를 입력할 시 자동으로 페이징 처리를 해준다. ex) localhost:3000/profile >> 다이나믹 라우팅 기능
- Next.js에서는 react-router로 라우팅처리를 돕는 것이 아닌 자체적인 라우터를 활용한다.
- Link href="/경로" 후에 a태그로 감싸준다.

# antd 사용해 SNS 화면 만들기

- antd와 styled-components를 사용하여 UI 구성!
- npm trends에서 검색하여 더 나은 CSS FRAMEWORK 사용하기!
- pages 폴더 안의 \_app.js는 페이지 모두 공통인 레이아웃을 담아두었다.
- components 폴더 안의 AppLayout.js는 일부 공통인 부분을 추려 쓰기 위해 만들었다.
