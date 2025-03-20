import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link
					href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400;1,700&display=swap"
					rel="stylesheet"
				/>
				<link rel="manifest" href="/manifest.json" />
				<link rel="apple-touch-icon" href="/icon.png" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
