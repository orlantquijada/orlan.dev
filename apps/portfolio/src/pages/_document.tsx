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
          rel="preload"
          href="/fonts/Inter-Thin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Inter-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Inter-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Inter-SemiBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Inter-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/SerifBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'Inter';
                font-weight: 300;
                font-display: swap;
                src: url(/fonts/Inter-Thin.woff2) format('woff2');
              }
              @font-face {
                font-family: 'Inter';
                font-weight: 400;
                font-display: swap;
                src: url(/fonts/Inter-Regular.woff2) format('woff2');
              }
              @font-face {
                font-family: 'Inter';
                font-weight: 500;
                font-display: swap;
                src: url(/fonts/Inter-Medium.woff2) format('woff2');
              }
              @font-face {
                font-family: 'Inter';
                font-weight: 600;
                font-display: swap;
                src: url(/fonts/Inter-SemiBold.woff2) format('woff2');
              }
              @font-face {
                font-family: 'Inter';
                font-weight: 700;
                font-display: swap;
                src: url(/fonts/Inter-Bold.woff2) format('woff2');
              }
              @font-face {
                font-family: 'Serif';
                font-weight: 500;
                font-display: swap;
                src: url(/fonts/SerifBold.woff2) format('woff2');
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
