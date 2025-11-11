import { cva } from "cva";
import styles from "./styles.module.css";

export const noteCardStyles = cva(
	["rounded-lg border transition-colors", "flex flex-col p-4", styles.noteCard],
	{
		variants: {
			color: { gray: "border-gray3 bg-gray1 text-gray11" },
			transluscent: {
				true: "bg-[hsla(0,0%,99%,0.4)] text-gray12 dark:border-gray-a3 dark:bg-gray-a3 dark:hover:bg-gray-a4",
				false:
					"text-gray12 dark:border-gray3 dark:bg-gray3 dark:hover:bg-gray4",
			},
			stripes: {
				true: styles.stripes,
			},
		},
		defaultVariants: {
			color: "gray",
			transluscent: true,
			stripes: false,
		},
	},
);
