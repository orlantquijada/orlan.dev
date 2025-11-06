import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    orientation: "portrait",
    theme_color: "#ECEEEC",
    background_color: "#ECEEEC",
    display: "standalone",
    scope: "/",
    start_url: "/",
    name: "Daily Stoic",
    short_name: "Daily Stoic",
    description:
      "366 Meditations on Wisdom, Perseverance, and The Art of Living",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
