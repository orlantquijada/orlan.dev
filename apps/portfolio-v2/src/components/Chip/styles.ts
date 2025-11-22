import { cva } from "cva";

export const chipStyles = cva(
	[
		"grid cursor-pointer place-items-center rounded-full border leading-none transition-colors focus-within:outline-none",
	],
	{
		variants: {
			size: {
				sm: "h-6 min-w-10 px-2 text-xs",
				md: "h-7 min-w-12 px-3 text-sm",
				lg: "h-8 px-4",
				responsive:
					"h-6 min-w-10 px-2 text-xs md:h-7 md:min-w-12 md:px-3 md:text-sm",
			},
			color: {
				gray: "border-gray6 bg-gray1 text-gray11 focus-within:border-gray7 focus-within:bg-gray3 hover:border-gray7 hover:bg-gray3",
				primary: "border-gray12 bg-gray12 text-gray1 focus-visible:bg-gray-a11",
			},
			transluscent: {
				true: "dark:border-gray-a4 dark:hover:border-gray-a10 dark:focus-within:border-gray-a10",
				false: "dark:border-gray3",
			},
		},
		defaultVariants: {
			size: "responsive",
			color: "gray",
			transluscent: true,
		},
		compoundVariants: [
			{
				color: "gray",
				transluscent: true,
				className: "bg-chip-bg dark:bg-gray-a3 dark:text-gray12",
			},
			{
				color: "gray",
				transluscent: false,
				className:
					"dark:bg-gray3 dark:hover:bg-gray4 dark:focus-within:bg-gray4",
			},
		],
	}
);
