import Head from "next/head";
import { BASE_URL } from "@/lib/constants";

type Props = {
  title: string;
  description: string;
  url: string;
  image: string;
};

export default function MetaTags(props: Props) {
  const { description, title, image } = props;
  const url = `${BASE_URL}${props.url}`;

  return (
    <Head>
      <link href="/favicon.ico" rel="icon" />

      {/* status bars */}
      <meta content="#fcfdfc" name="theme-color" />

      {/* Primary Meta Tags  */}
      <title key="title">{title}</title>
      <meta content={title} name="title" />
      <meta content={description} name="description" />
      <meta content={image} property="image" />
      <meta content={image} itemProp="image" />

      {/* Open Graph / Facebook  */}
      <meta content="website" property="og:type" />
      <meta content={url} property="og:url" />
      <meta content={title} property="og:title" />
      <meta content={description} property="og:description" />
      <meta content={image} property="og:image" />

      {/* Twitter  */}
      <meta content="summary_large_image" property="twitter:card" />
      <meta content={url} property="twitter:url" />
      <meta content={title} property="twitter:title" />
      <meta content={description} property="twitter:description" />
      <meta content={image} property="twitter:image" />
    </Head>
  );
}
