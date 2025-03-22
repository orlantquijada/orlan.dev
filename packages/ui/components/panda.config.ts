import { defineConfig } from "@pandacss/dev";
import pandaPreset from "@pandacss/preset-panda";
import { preset } from "styled";

export default defineConfig({
	// Whether to use css reset
	preflight: true,

	// Where to look for your css declarations
	include: ["./src/**/*.{js,jsx,ts,tsx}", "../styled/src/**/*.{ts,tsx}"],

	// Files to exclude
	exclude: [],

	// Useful for theme customization
	theme: {
		extend: {},
	},

	presets: [pandaPreset, preset],
	// The output directory for your css system
	outdir: "styled-system",
	importMap: "styled",
});
