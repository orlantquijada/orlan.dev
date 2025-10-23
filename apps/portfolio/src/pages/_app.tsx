import "../globals.css";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";

function MyApp({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPage & { theme?: "dark" | "light" };
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
      forcedTheme={Component.theme}
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
