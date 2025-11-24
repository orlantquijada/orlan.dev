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
		variants: {
			withAnimations: {
				true: "hover:bg-gray1 active:scale-97 active:opacity-75 hover:dark:bg-gray5",
			},
			motionSafe: {
				true: "transition-all ease-out",
			},
			translucent: {
				true: "bg-chip-bg dark:bg-gray-a3",
				false: "dark:bg-gray3",
			},
		},
		compoundVariants: [
			{
				withAnimations: true,
				translucent: true,
				className: "hover:dark:bg-gray-a5",
			},
		],
		defaultVariants: {
			withAnimations: true,
			translucent: false,
			motionSafe: true,
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
				buttonStyles({ className, translucent, withAnimations, motionSafe })
			)}
		>
			{children}
		</button>
	);
}
