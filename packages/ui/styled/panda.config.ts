import { defineConfig, definePreset } from "@pandacss/dev";
import pandaPreset from "@pandacss/preset-panda";

import { oliveP3 } from "./src/colors";
import { flexRecipe } from "./src/recipes/flex";
import { gridRecipe } from "./src/recipes/grid";
import { pillRecipe } from "./src/recipes/pill";
import { textRecipe } from "./src/recipes/text";

export const preset = definePreset({
	name: "styled-preset",

	conditions: {
		light: "[data-color-mode=light] &",
		dark: "[data-color-mode=dark] &",
	},
	theme: {
		extend: {
			recipes: {
				text: textRecipe,
				pill: pillRecipe,
				_grid: gridRecipe,
				_flex: flexRecipe,
			},

			tokens: {
				colors: {
					olive: oliveP3,
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
	utilities: {
		extend: {
			px: {
				values: "spacing",
				transform: (value) => ({ paddingInline: value }),
			},
			py: {
				values: "spacing",
				transform: (value) => ({ paddingBlock: value }),
			},
			pt: {
				values: "spacing",
				transform: (value) => ({ paddingInlineStart: value }),
			},
		},
	},
});

export default defineConfig({
	// Whether to use css reset
	presets: [pandaPreset, preset],
	preflight: true,

	// Where to look for your css declarations
	include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

	// Files to exclude
	exclude: [],

	// Useful for theme customization
	theme: {
		extend: {},
	},

	jsxFramework: "react",

	// The output directory for your css system
	outdir: "styled-system",
});
