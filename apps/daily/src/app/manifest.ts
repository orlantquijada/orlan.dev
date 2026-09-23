import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#ECEEEC",
    description:
      "366 Meditations on Wisdom, Perseverance, and The Art of Living",
    display: "standalone",
    icons: [
      {
        sizes: "192x192",
        src: "/icon-192x192.png",
        type: "image/png",
      },
      {
        sizes: "256x256",
        src: "/icon-256x256.png",
        type: "image/png",
      },
      {
        sizes: "384x384",
        src: "/icon-384x384.png",
        type: "image/png",
      },
      {
        sizes: "512x512",
        src: "/icon-512x512.png",
        type: "image/png",
      },
    ],
    name: "Daily Stoic",
    orientation: "portrait",
    scope: "/",
    short_name: "Daily Stoic",
    start_url: "/",
    theme_color: "#ECEEEC",
  };
}
