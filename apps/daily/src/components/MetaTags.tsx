import Head from 'next/head'

type Props = {
  title: string
  description: string
  url: string
  image: string
}

export default function MetaTags(props: Props) {
  const { description, title, image } = props
  const url = `${
    process.env.NODE_ENV === 'production'
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3000'
  }${props.url}`

  return (
    <Head>
      <link rel="icon" href="/favicon.ico" />

      {/* Primary Meta Tags  */}
      <title key="title">{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta property="image" content={image} />
      <meta itemProp="image" content={image} />

      {/* Open Graph / Facebook  */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter  */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Head>
  )
}
