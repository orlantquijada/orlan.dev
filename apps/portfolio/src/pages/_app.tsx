import "../globals.css";
import type { NextPage } from "next";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";

function MyApp({
	Component,
	pageProps,
}: AppProps & {
	Component: NextPage & { theme?: "dark" | "light" };
}) {
	return (
		<ThemeProvider
			defaultTheme="system"
			forcedTheme={Component.theme}
			attribute="class"
			enableSystem
			disableTransitionOnChange
		>
			<Component {...pageProps} />
		</ThemeProvider>
	);
}

export default MyApp;
