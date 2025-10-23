import { type VariantProps, cva } from "cva";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import styles from "./Button.module.css";

export const buttonStyles = cva(
	[
		"h-10 px-3 rounded-lg border border-gray7 dark:border-gray6 bg-gray1 ",
		styles.button,
	],
	{
		variants: {
			motionSafe: {
				true: "motion-safe:transition-all hover:bg-gray3",
			},
			translucent: {
				true: [
					"dark:bg-gray-a3",
					// 'dark:backdrop-blur-md dark:backdrop-brightness-75 dark:saturate-200 dark:contrast-75',
				],
				false: ["dark:bg-gray3"],
			},
		},
		compoundVariants: [
			{
				motionSafe: true,
				translucent: true,
				className: "hover:dark:bg-gray-a4",
			},
			{
				motionSafe: true,
				translucent: false,
				className: "hover:dark:bg-gray4",
			},
		],
		defaultVariants: {
			translucent: false,
			motionSafe: true,
		},
	},
);

type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonStyles>;

export function Button(props: ButtonProps) {
	const { className, children, translucent = null, ..._props } = props;

	return (
		<button
			{..._props}
			className={twMerge(buttonStyles({ className, translucent: translucent }))}
		>
			{children}
		</button>
	);
}
