import { defineConfig } from "@pandacss/dev";
import { preset } from "styled";

export default defineConfig({
	// Whether to use css reset
	preflight: true,

	// Where to look for your css declarations
	include: [
		"./src/**/*.{js,jsx,ts,tsx}",
		"./pages/**/*.{js,jsx,ts,tsx}",
		"../../packages/ui/styled/**/*.{ts,tsx}",
		"../../packages/ui/components/**/*.{ts,tsx}",
	],

	// Files to exclude
	exclude: [],

	// Useful for theme customization
	theme: {
		extend: {},
	},

	presets: [preset],

	importMap: "styled",

	// The output directory for your css system
	outdir: "styled-system",
});
