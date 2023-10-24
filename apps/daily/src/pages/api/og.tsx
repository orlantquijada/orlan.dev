import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

const ibmFont = fetch(
  new URL('../../../public/fonts/IBMPlexMono-Regular.ttf', import.meta.url),
).then((res) => res.arrayBuffer())
const interFont = fetch(
  new URL('../../../public/fonts/Inter-ExtraBold.otf', import.meta.url),
).then((res) => res.arrayBuffer())

export default async function handler(request: NextRequest) {
  try {
    const interFontData = await interFont
    const ibmFontData = await ibmFont
    const { searchParams } = new URL(request.url)

    const subtitle = searchParams.get('subtitle') || '📕'
    const title = searchParams.get('title') || 'Daily Philosophy Quotes'
    const author = searchParams.get('author') || ''

    return new ImageResponse(
      (
        <div
          style={{
            // olive 2
            background: '#f8faf8',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            padding: '5%',
          }}
        >
          <div
            style={{
              fontFamily: '"EB Garamond"',
              fontSize: 44,
              alignSelf: 'flex-start',
              // olive 11
              color: '#6b716a',
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              fontFamily: '"Inter"',
              fontSize: 88,
              marginTop: 12,
              marginBottom: 6,
              // olive 12
              color: '#141e12',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: '"EB Garamond"',
              fontSize: 52,
              marginTop: 'auto',
              // olive 11
              color: '#6b716a',
            }}
          >
            {author}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        emoji: 'fluent',
        fonts: [
          {
            name: 'Inter',
            data: interFontData,
            style: 'normal',
          },
          {
            name: 'EB Garamond',
            data: ibmFontData,
            style: 'normal',
          },
        ],
      },
    )
  } catch (e) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
