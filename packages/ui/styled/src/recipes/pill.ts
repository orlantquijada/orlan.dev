import { defineRecipe } from "@pandacss/dev";

export const pillRecipe = defineRecipe({
	className: "pill",
	base: {
		appearance: "none",
		borderRadius: "full",

		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",

		fontWeight: "medium",
	},
	variants: {
		size: {
			"1": {
				fontSize: "xs",
				paddingBlock: "1",
				paddingInline: "2",
			},
			"2": {
				fontSize: "xs",
				paddingBlock: "2",
				paddingInline: "3",
			},
		},
		variant: {
			muted: {
				backgroundColor: "olive.3",
				border: "1px solid {colors.olive.5}",
				color: "olive.11",
				transition: "box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)",

				_hover: { backgroundColor: "olive.4" },
				_active: { backgroundColor: "olive.5" },
				_focus: {
					"--ring-offset": "2px",
					outline: "none",
					boxShadow:
						"0 0 0 var(--ring-offset) {colors.bg}, 0 0 0 calc(var(--ring-offset) + 2px) {colors.olive.7}",
				},
			},
		},
	},
	defaultVariants: {
		variant: "muted",
		size: "1",
	},
});
