import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getDaily } from "@/lib/content";
import { stripMarkdown } from "@/lib/utils";

export const size = {
  height: 630,
  width: 1200,
};

function loadFont(font: string) {
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
  const {
    frontmatter: { author, title: markdownTitle },
  } = await getDaily({ day, month });

  const cleanTitle = (await stripMarkdown(markdownTitle)).toString();

  const subtitle = `${month} ${day}`;
  const title = cleanTitle || "Daily Philosophy Quotes";

  const interFontData = await loadFont("InterDisplay-ExtraBold.ttf");
  const ibmFontData = await loadFont("IBMPlexMono-Regular.ttf");

  return new ImageResponse(
    <div
      style={{
        alignItems: "flex-start",
        // olive 2
        background: "#f8faf8",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "flex-start",
        padding: "5%",
        width: "100%",
      }}
    >
      <div
        style={{
          alignSelf: "flex-start",
          // olive 11
          color: "#6b716a",
          fontFamily: ibmFontFamily,
          fontSize: 44,
          textTransform: "capitalize",
        }}
      >
        {subtitle}
      </div>
      <div
        style={{
          // olive 12
          color: "#141e12",
          fontFamily: '"Inter"',
          fontSize: 88,
          marginBottom: 6,
          marginTop: 12,
        }}
      >
        {title}
      </div>
      <div
        style={{
          // olive 11
          color: "#6b716a",
          fontFamily: ibmFontFamily,
          fontSize: 52,
          marginTop: "auto",
        }}
      >
        {author}
      </div>
    </div>,
    {
      emoji: "fluent",
      fonts: [
        {
          data: interFontData,
          name: "Inter",
          style: "normal",
          weight: 700,
        },
        {
          data: ibmFontData,
          name: ibm,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
