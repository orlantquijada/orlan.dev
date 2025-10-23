import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import compress from "astro-compress";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import svgr from "vite-plugin-svgr";

// https://astro.build/config
export default defineConfig({
	integrations: [react(), mdx(), icon(), compress()],
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
