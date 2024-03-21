import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
  
    return (
      <Html lang="kr">
        <Head>
          <meta charSet="UTF-8" />
          <link passHref rel="icon" href="/favicon.ico" />
          <meta name="naver-site-verification" content="fcd6939d5a2a544afe2de373e246bedd86d5702d" />
          <meta name="google-adsense-account" content="ca-pub-4888620428245224"></meta>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument