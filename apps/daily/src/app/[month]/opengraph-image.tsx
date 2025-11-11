import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { type Month, monthSubjectsMap } from "@/lib/like";

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
  params: Promise<{ month: Month }>;
}) {
  const { month } = await params;
  const subject = monthSubjectsMap[month];

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
        {month}
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
        {subject}
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
    },
  );
}
