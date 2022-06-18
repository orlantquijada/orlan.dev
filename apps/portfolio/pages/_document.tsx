import { Html, Head, Main, NextScript } from 'next/document'
import { getCssText } from 'ui'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <style
          id="stitches"
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="preload"
          href="/fonts/SerifBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/SerifLight.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'Serif';
                font-weight: 500;
                font-display: swap;
                src: url(/fonts/SerifBold.woff2) format('woff2');
              }
              @font-face {
                font-family: 'Serif';
                font-weight: 300;
                font-display: swap;
                src: url(/fonts/SerifLight.woff2) format('woff2');
              }
          `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
