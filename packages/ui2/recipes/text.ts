import { defineRecipe } from "@pandacss/dev";

export const textRecipe = defineRecipe({
	className: "text",
	variants: {
		size: {
			"2xs": {
				fontSize: "2xs",
				lineHeight: "0.875rem",
			},
			xs: {
				fontSize: "xs",
				lineHeight: "1rem",
			},
			sm: {
				fontSize: "sm",
				lineHeight: "1.25rem",
			},
			base: {
				fontSize: "base",
				lineHeight: "1.5rem",
			},
			lg: {
				fontSize: "lg",
				lineHeight: "1.75rem",
			},
			xl: {
				fontSize: "xl",
				lineHeight: "1.75rem",
			},
			"2xl": {
				fontSize: "2xl",
				lineHeight: "2rem",
			},
			"3xl": {
				fontSize: "3xl",
				lineHeight: "2.25rem",
			},
			"4xl": {
				fontSize: "4xl",
				lineHeight: "calc(fontSizes.4xl + 0.25rem)",
				letterSpacing: "-0.02em",
			},
			"5xl": {
				fontSize: "5xl",
				lineHeight: "calc(fontSizes.5xl + 0.25rem)",
				letterSpacing: "-0.02em",
			},
			"6xl": {
				fontSize: "6xl",
				lineHeight: "calc(fontSizes.6xl + 0.25rem)",
				letterSpacing: "-0.02em",
			},
			"7xl": {
				fontSize: "7xl",
				lineHeight: "calc(fontSizes.7xl + 0.25rem)",
				letterSpacing: "-0.02em",
			},
		},
	},
});
