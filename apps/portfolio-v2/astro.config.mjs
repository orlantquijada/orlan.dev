import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import compress from "astro-compress";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import svgr from "vite-plugin-svgr";

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind(), react(), mdx(), icon(), compress()],
	scopedStyleStrategy: "where",
	markdown: {
		shikiConfig: {
			theme: "min-dark",
		},
	},
	vite: {
		plugins: [svgr()],
		ssr: {
			noExternal: ["@radix-ui/*"],
		},
	},
});
