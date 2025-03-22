import { defineConfig, defineGlobalStyles } from "@pandacss/dev";
import pandaPreset from "@pandacss/preset-panda";
import { preset } from "styled";

const globalCss = defineGlobalStyles({
	"*, *::before, *::after": {
		boxSizing: "border-box",
	},

	"*": {
		margin: 0,
	},

	"html, body": {
		fontFamily: "sans-serif",
		color: "textColor",
	},

	"html, body, #__next": {
		height: "100%",
	},

	body: {
		backgroundColor: "bg",
		lineHeight: 1.5,
		"-webkit-font-smoothing": "antialiased",
	},

	"::selection": {
		backgroundColor: "colors.olive.5",
	},

	"img, picture, video, canvas, svg": {
		display: "block",
		maxWidth: "100%",
	},

	"input, button, textarea, select": {
		font: "inherit",
	},

	button: {
		userSelect: "none",
	},

	"p, h1, h2, h3, h4, h5, h6": {
		overflowWrap: "break-word",
	},

	a: {
		textDecoration: "none",
	},
});

export default defineConfig({
	// Whether to use css reset
	preflight: true,
	globalCss,

	// Where to look for your css declarations
	include: [
		"./src/**/*.{js,jsx,ts,tsx}",
		"./pages/**/*.{js,jsx,ts,tsx}",
		"../../packages/ui/components/**/*.{ts,tsx}",
		"../../packages/ui/styled/**/*.{ts,tsx}",
	],

	// Files to exclude
	exclude: [],

	// Useful for theme customization
	theme: {
		extend: {},
	},

	presets: [pandaPreset, preset],

	importMap: "styled",

	// The output directory for your css system
	outdir: "styled-system",
});
