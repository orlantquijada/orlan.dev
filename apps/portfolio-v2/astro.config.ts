import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import icon from "astro-icon";
import svgr from "vite-plugin-svgr";
import compress from "astro-compress";

// https://astro.build/config
const config = defineConfig({
	experimental: {
		fonts: [
			{
				provider: fontProviders.google(),
				name: "JetBrains Mono",
				cssVariable: "--font-jetbrains-mono",
				fallbacks: ["monospace"],
				subsets: ["latin"],
			},
		],
	},
	integrations: [
		react(),
		mdx(),
		icon(),
		compress({
			HTML: false,
		}),
	],
	scopedStyleStrategy: "where",
	markdown: {
	shikiConfig: {
		themes: {
			dark: "material-theme-ocean",
			light: "solarized-light",
		},
	},
	},
	vite: {
		plugins: [svgr(), tailwindcss()],
		ssr: {
			noExternal: ["@radix-ui/*"],
		},
	},
});

export default config;
