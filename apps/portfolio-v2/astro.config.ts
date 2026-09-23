import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

import icon from "astro-icon";
import svgr from "vite-plugin-svgr";

// https://astro.build/config
const config = defineConfig({
	adapter: vercel(),
	// Astro 7 defaults to JSX whitespace compression; retain Astro 6's
	// spacing between adjacent inline elements.
	compressHTML: true,
	fonts: [
		{
			cssVariable: "--font-jetbrains-mono",
			fallbacks: ["monospace"],
			name: "JetBrains Mono",
			provider: fontProviders.google(),
			subsets: ["latin"],
		},
	],
	integrations: [react(), mdx(), icon()],
	markdown: {
		shikiConfig: {
			themes: {
				dark: "material-theme-ocean",
				light: "solarized-light",
			},
		},
	},
	redirects: {
		"/resume": { destination: "/01Quijada.pdf", status: 301 },
	},
	scopedStyleStrategy: "where",
	vite: {
		plugins: [svgr(), tailwindcss()],
		ssr: {
			noExternal: ["@radix-ui/*"],
		},
	},
});

export default config;
