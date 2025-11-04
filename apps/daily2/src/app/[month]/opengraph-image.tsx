import { ImageResponse } from "next/og";
import { type Month, monthSubjectsMap } from "@/lib/like";

export const size = {
  width: 1200,
  height: 630,
};

async function loadGoogleFont(font: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status === 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export default async function Image({ params }: { params: { month: string } }) {
  const month = params.month as unknown as Month;
  const subject = monthSubjectsMap[month];

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
          fontFamily: '"EB Garamond"',
          fontSize: 44,
          alignSelf: "flex-start",
          // olive 11
          color: "#6b716a",
          textTransform: "capitalize",
        }}
      >
        {params.month}
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
          data: await loadGoogleFont("Inter"),
          style: "normal",
        },
        {
          name: "EB Garamond",
          data: await loadGoogleFont("EB Garamond"),
          style: "normal",
        },
      ],
    }
  );
}
