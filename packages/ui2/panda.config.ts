import { defineConfig } from "@pandacss/dev";

import { gridRecipe } from "./recipes/grid";
import { pillRecipe } from "./recipes/pill";
import { textRecipe } from "./recipes/text";

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

export const oliveDark = {
	olive1: "#151715",
	olive2: "#1a1d19",
	olive3: "#20241f",
	olive4: "#262925",
	olive5: "#2b2f2a",
	olive6: "#313530",
	olive7: "#3b3f3a",
	olive8: "#4c514b",
	olive9: "#687366",
	olive10: "#778175",
	olive11: "#9aa299",
	olive12: "#eceeec",
} as const;

const spaceAndSizesCommon = {
	0: "0px",
	px: "1px",
	1: "0.25rem",
	2: "0.5rem",
	3: "0.75rem",
	4: "1rem",
	5: "1.25rem",
	6: "1.5rem",
	7: "1.75rem",
	8: "2rem",
	9: "2.25rem",
	10: "2.5rem",
	11: "2.75rem",
	12: "3rem",
	14: "3.5rem",
	16: "4rem",
	20: "5rem",
	24: "6rem",
	28: "7rem",
	32: "8rem",
	36: "9rem",
	40: "10rem",
	// 44: '11rem',
	// 48: '12rem',
	// 52: '13rem',
	// 56: '14rem',
	// 60: '15rem',
	// 64: '16rem',
};

export default defineConfig({
	// Whether to use css reset
	preflight: true,

	// Where to look for your css declarations
	include: [
		"./components/**/*.{js,jsx,ts,tsx}",
		"./recipes/**/*.{js,jsx,ts,tsx}",
	],

	// Files to exclude
	exclude: [],

	// Useful for theme customization
	theme: {
		extend: {
			recipes: {
				text: textRecipe,
				pill: pillRecipe,
			},

			tokens: {
				colors: {
					olive: olive,
				},

				fonts: {
					serif: {
						value: "'Serif', Georgia, 'Times New Roman', Times, serif",
					},
					"sans-serif": {
						value:
							'"Inter",-apple-system,ui-sans-serif,system-ui,"Helvetica Neue","Helvetica", BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell, "Open Sans",sans-serif',
					},
				},

				fontSizes: {
					"2xs": { value: "0.625rem" },
					xs: { value: "0.75rem" },
					sm: { value: "0.875rem" },
					base: { value: "1rem" },
					lg: { value: "1.125rem" },
					xl: { value: "1.25rem" },
					"2xl": { value: "1.5rem" },
					"3xl": { value: "1.875rem" },
					"4xl": { value: "2.25rem" },
					"5xl": { value: "3rem" },
					"6xl": { value: "3.75rem" },
					"7xl": { value: "4.5rem" },
					"8xl": { value: "6rem" },
					"9xl": { value: "8rem" },
				},

				fontWeights: {
					light: { value: 300 },
					regular: { value: 400 },
					medium: { value: 500 },
					semibold: { value: 600 },
					bold: { value: 700 },
				},

				radii: {
					none: { value: "0" },
					sm: { value: "0.125rem" },
					base: { value: "0.25rem" },
					md: { value: "0.375rem" },
					lg: { value: "0.5rem" },
					xl: { value: "0.75rem" },
					"2xl": { value: "1rem" },
					"3xl": { value: "1.5rem" },
					full: { value: "9999px" },
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

		breakpoints: {
			mobile: " 375px",
			tab: "768px",
			desktop: "1024px",
		},
	},

	jsxFramework: "react",

	// The output directory for your css system
	outdir: "styled-system",
});
