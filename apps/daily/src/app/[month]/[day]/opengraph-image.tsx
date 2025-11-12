import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getDaily } from "@/lib/content";
import { stripMarkdown } from "@/lib/utils";

export const size = {
  width: 1200,
  height: 630,
};

async function loadFont(font: string) {
  return readFile(join(process.cwd(), `public/fonts/${font}`));
}

const ibm = "IBM Plex Mono";

// to be used for styles
const ibmFontFamily = `"${ibm}"`;

export default async function Image({
  params,
}: {
  params: Promise<{ day: string; month: string }>;
}) {
  const { day, month } = await params;
  const { frontmatter } = await getDaily({ day, month });

  const cleanTitle = (await stripMarkdown(frontmatter.title)).toString();

  const subtitle = `${month} ${day}`;
  const title = cleanTitle || "Daily Philosophy Quotes";
  const author = frontmatter.author;

  const interFontData = await loadFont("InterDisplay-ExtraBold.ttf");
  const ibmFontData = await loadFont("IBMPlexMono-Regular.ttf");

  return new ImageResponse(
    <div
      style={{
        // olive 2
        background: "#f8faf8",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: "5%",
      }}
    >
      <div
        style={{
          fontFamily: ibmFontFamily,
          fontSize: 44,
          alignSelf: "flex-start",
          // olive 11
          color: "#6b716a",
          textTransform: "capitalize",
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
          color: "#141e12",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: ibmFontFamily,
          fontSize: 52,
          marginTop: "auto",
          // olive 11
          color: "#6b716a",
        }}
      >
        {author}
      </div>
    </div>,
    {
      emoji: "fluent",
      fonts: [
        {
          name: "Inter",
          data: interFontData,
          style: "normal",
          weight: 700,
        },
        {
          name: ibm,
          data: ibmFontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
