# Hello, Next.js

- Next.js에서는 pages 폴더에 페이지를 처리해줘야 하는데 next 라이브러리에서 pages 폴더를 인식하여 코드 스플리팅을 해주기 때문이다.
- Next가 page안에 있는 페이지들을 라우팅 처리를 해주지 않아도 url창에 파라미터를 입력할 시 자동으로 페이징 처리를 해준다. ex) localhost:3000/profile >> 다이나믹 라우팅 기능
- Next.js에서는 react-router로 라우팅처리를 돕는 것이 아닌 자체적인 라우터를 활용한다.
- Link href="/경로" 후에 a태그로 감싸준다.
