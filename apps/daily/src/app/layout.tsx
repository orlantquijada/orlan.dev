import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import { BASE_URL } from "@/lib/constants";
import "./globals.css";

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Daily Stoic",
    template: "%s — Daily Stoic",
  },
  description: "366 Meditations on Wisdom, Perseverance, and The Art of Living",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ebGaramond.variable} antialiased`}>{children}</body>
    </html>
  );
}
