import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/icon.svg" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="author" content="FreshCuts" />
        <meta name="keywords" content="fresh meat, local vendors, chicken, mutton, fish, prawns, delivery, marketplace" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}