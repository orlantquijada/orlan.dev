import { cva } from "cva";

export const styles = cva(["relative scroll-mt-28 font-medium"], {
	variants: {
		tag: {
			h2: "before:-top-3 mt-24 mb-8 text-2xl before:absolute before:left-0 before:h-[2px] before:w-6 before:rounded-sm before:bg-current",
			h3: "mt-8 mb-6 text-xl",
		},
	},
});
