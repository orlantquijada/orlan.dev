import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import compress from "astro-compress";
import icon from "astro-icon";
import svgr from "vite-plugin-svgr";

// https://astro.build/config
export default defineConfig({
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
			theme: "min-dark",
		},
	},
	vite: {
		plugins: [svgr(), tailwindcss()],
		ssr: {
			noExternal: ["@radix-ui/*"],
		},
	},
});
