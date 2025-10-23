import { cva } from "cva";
import styles from "./styles.module.css";

export const noteCardStyles = cva(
	["transition-colors border rounded-lg", "p-4 flex flex-col", styles.noteCard],
	{
		variants: {
			color: { gray: "border-gray3 bg-gray1 text-gray11" },
			transluscent: {
				true: "dark:border-gray-a3 dark:bg-gray-a3 dark:hover:bg-gray-a4 text-gray12 bg-[hsla(0,0%,99%,0.4)]",
				false:
					"dark:border-gray3 dark:bg-gray3 dark:hover:bg-gray4 text-gray12",
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
