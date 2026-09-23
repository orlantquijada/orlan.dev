import { cva, type VariantProps } from "cva";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import styles from "./Button.module.css";

export const buttonStyles = cva(
	[
		"h-10 cursor-pointer rounded-lg border border-gray7 bg-gray1 px-3 dark:border-gray6",
		styles.button,
	],
	{
		compoundVariants: [
			{
				className: "hover:dark:bg-gray-a5",
				translucent: true,
				withAnimations: true,
			},
		],
		defaultVariants: {
			motionSafe: true,
			translucent: false,
			withAnimations: true,
		},
		variants: {
			motionSafe: {
				true: "transition-all ease-out",
			},
			translucent: {
				false: "dark:bg-gray3",
				true: "bg-chip-bg dark:bg-gray-a3",
			},
			withAnimations: {
				true: "hover:bg-gray1 active:scale-97 active:opacity-75 hover:dark:bg-gray5",
			},
		},
	}
);

type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonStyles>;

export function Button(props: ButtonProps) {
	const {
		className,
		children,
		withAnimations,
		motionSafe,
		translucent = null,
		..._props
	} = props;

	return (
		<button
			{..._props}
			className={twMerge(
				buttonStyles({ className, motionSafe, translucent, withAnimations })
			)}
		>
			{children}
		</button>
	);
}
