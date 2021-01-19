import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } catch (error) {
      console.error(error);
    } finally {
      sheet.seal();
    }
  }

  render() {
    <Html>
      <Head />
      <body>
        <script src="https://polyfill.io/v3/polyfill.min.js?features=default%2Ces2016%2Ces2015%2Ces2017%2Ces2018%2Ces2019" />
        <Main />
        <NextScript />
      </body>
    </Html>;
  }
}

/*
next에서 SSR시 styled-components를 적용시키기 위한 방법으로 _app.js의 상위 파일인 _document.js를 만들어준다.
위 문법은 함수형 컴포넌트로 바뀐 표현식이 아직 나오지 않았기 때문에 클래스형 컴포넌트로 작성되었다.
따로 외우지 않고, 위 페이지를 그대로 사용하면 된다.
*/

/*
styled-components는 따로 SSR 세팅(_document.js)를 하지 않으면 서버사이드 렌더링이 되지 않습니다.
스타일드 컴포넌트는 동적으로 스타일 태그를 생성하기 때문입니다.
 */
