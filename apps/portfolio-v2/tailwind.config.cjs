const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", ...defaultTheme.fontFamily.sans],
				redaction: ["Redaction", ...defaultTheme.fontFamily.sans],
			},
			colors: {
				gray1: "var(--gray1)",
				gray2: "var(--gray2)",
				gray3: "var(--gray3)",
				gray4: "var(--gray4)",
				gray5: "var(--gray5)",
				gray6: "var(--gray6)",
				gray7: "var(--gray7)",
				gray8: "var(--gray8)",
				gray9: "var(--gray9)",
				gray10: "var(--gray10)",
				gray11: "var(--gray11)",
				gray12: "var(--gray12)",

				grayA1: "var(--grayA1)",
				grayA2: "var(--grayA2)",
				grayA3: "var(--grayA3)",
				grayA4: "var(--grayA4)",
				grayA5: "var(--grayA5)",
				grayA6: "var(--grayA6)",
				grayA7: "var(--grayA7)",
				grayA8: "var(--grayA8)",
				grayA9: "var(--grayA9)",
				grayA10: "var(--grayA10)",
				grayA11: "var(--grayA11)",
				grayA12: "var(--grayA12)",

				// Misc
				overlay: "var(--overlay)",
				accent: "var(--accent)",
				"accent-blue": "var(--accent-blue)",
				"accent-pink": "var(--accent-pink)",
				"accent-violet": "var(--accent-violet)",
				selectionColor: "var(--selection-color)",
			},
			keyframes: {
				show: {
					from: { opacity: 0 },
					to: { opacity: 1 },
				},
				hide: {
					from: { opacity: 1 },
					to: { opacity: 0 },
				},
				showContent: {
					from: { opacity: 0, transform: "translate(-50%, -45%) scale(.96)" },
					to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
				},
				hideContent: {
					from: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
					to: { opacity: 0, transform: "translate(-50%, -45%) scale(.96)" },
				},
			},
			animation: {
				show: "show 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
				hide: "hide 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
				showContent: "showContent 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
				hideContent: "hideContent 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
			},
			boxShadow: ({ theme }) => ({
				// inspired by https://www.joshwcomeau.com/shadow-palette/
				"surface-glass": `
          inset 0.25px 1px 0 0 ${theme("colors.rose.200 / 3%")},
          0px 0.3px 0.3px rgba(3, 2, 2, 0.02),
          0px 2.2px 2.5px -0.4px rgba(3, 2, 2, 0.02),
          0px 4.3px 4.8px -0.8px rgba(3, 2, 2, 0.02),
          0px 7.5px 8.4px -1.2px rgba(3, 2, 2, 0.02),
          0px 12.8px 14.4px -1.7px rgba(3, 2, 2, 0.02),
          0px 21px 23.6px -2.1px rgba(3, 2, 2, 0.02),
          0px 33.2px 37.4px -2.5px rgba(3, 2, 2, 0.02)`,
				"surface-elevation-low": `
          inset 0.25px 1px 1px 0 ${theme("colors.rose.200 / 1.5%")}, 
          0.3px 0.5px 0.7px rgba(3, 2, 2, 0.2),
          0.4px 0.8px 1px -1.2px rgba(3, 2, 2, 0.2),
          1px 2px 2.5px -2.5px rgba(3, 2, 2, 0.2);`,
				"surface-elevation-medium": `
          inset 0.25px 1px 1px 0 ${theme("colors.rose.200 / 3%")},
          0.3px 0.5px 0.7px rgba(3, 2, 2, 0.1),
          0.8px 1.6px 2px -0.8px rgba(3, 2, 2, 0.1),
          2.1px 4.1px 5.2px -1.7px rgba(3, 2, 2, 0.1),
          5px 10px 12.6px -2.5px rgba(3, 2, 2, 0.1)`,
			}),
		},
	},
	darkMode: "class",
	plugins: [],
};
