import { defineConfig, defineGlobalStyles } from "@pandacss/dev";
import { textRecipe } from "@/components/Text";

const globalCss = defineGlobalStyles({
	"*, *::before, *::after": {
		boxSizing: "border-box",
	},

	"*": {
		margin: 0,
	},

	"html, body": {
		fontFamily: "serif",
		color: "textColor",
	},

	"html, body, #__next": {
		height: "100%",
	},

	body: {
		backgroundColor: "bg",
		lineHeight: 1.5,
		WebkitFontSmoothing: "antialiased",
	},

	"::selection": {
		backgroundColor: "selection",
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

export const olive = {
	1: { value: "#fcfdfc" },
	2: { value: "#f8faf8" },
	3: { value: "#f2f4f2" },
	4: { value: "#ecefec" },
	5: { value: "#e6e9e6" },
	6: { value: "#e0e4e0" },
	7: { value: "#d8dcd8" },
	8: { value: "#c3c8c2" },
	9: { value: "#8b918a" },
	10: { value: "#818780" },
	11: { value: "#6b716a" },
	12: { value: "#141e12" },
} as const;

export default defineConfig({
	// Whether to use css reset
	preflight: true,

	// Where to look for your css declarations
	include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

	// Files to exclude
	exclude: [],

	// Useful for theme customization
	theme: {
		extend: {
			recipes: {
				text: textRecipe,
			},

			tokens: {
				colors: {
					olive,
				},

				fonts: {
					serif: {
						value: '"EB Garamond", Georgia, "Times New Roman", Times, serif',
					},
				},

				fontSizes: {
					base: { value: "1rem" },
					lg: { value: "1.125rem" },
					xl: { value: "1.25rem" },
					"2xl": { value: "1.5rem" },
				},

				fontWeights: {
					regular: { value: 400 },
					bold: { value: 700 },
				},
			},

			semanticTokens: {
				colors: {
					bg: { value: "{colors.olive.1}" },
					textColor: { value: "{colors.olive.12}" },
					selection: { value: "{colors.olive.5}" },
				},
			},

			keyframes: {
				fadeIn: {
					"0%": {
						mask: "linear-gradient(90deg, #000 25%, #000000e6 50%, #00000000) 150% 0 / 400% no-repeat",
						opacity: 0,
					},
					"100%": {
						mask: "linear-gradient(90deg, #000 25%, #000000e6 50%, #00000000) 0 / 400% no-repeat",
						opacity: 1,
					},
				},

				shimmer: {
					from: {
						backgroundPosition: "200% 0",
					},
					to: {
						backgroundPosition: "-200% 0",
					},
				},
			},
		},
	},

	// The output directory for your css system
	outdir: "styled-system",

	jsxFramework: "react",

	globalCss,
});
