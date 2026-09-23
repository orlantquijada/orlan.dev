import { cva } from "cva";

export const chipStyles = cva(
	[
		"grid cursor-pointer place-items-center rounded-full border leading-none transition-colors",
	],
	{
		compoundVariants: [
			{
				className: "bg-chip-bg dark:bg-gray-a3 dark:text-gray12",
				color: "gray",
				transluscent: true,
			},
			{
				className:
					"dark:bg-gray3 dark:hover:bg-gray4 dark:focus-within:bg-gray4",
				color: "gray",
				transluscent: false,
			},
		],
		defaultVariants: {
			color: "gray",
			size: "responsive",
			transluscent: true,
		},
		variants: {
			color: {
				gray: "border-gray6 bg-gray1 text-gray11 focus-within:border-gray7 focus-within:bg-gray3 hover:border-gray7 hover:bg-gray3",
				primary: "border-gray12 bg-gray12 text-gray1 focus-visible:bg-gray-a11",
			},
			size: {
				lg: "h-8 px-4",
				md: "h-7 min-w-12 px-3 text-sm",
				responsive:
					"h-6 min-w-10 px-2 text-xs md:h-7 md:min-w-12 md:px-3 md:text-sm",
				sm: "h-6 min-w-10 px-2 text-xs",
			},
			transluscent: {
				false: "dark:border-gray3",
				true: "dark:border-gray-a4 dark:hover:border-gray-a10 dark:focus-within:border-gray-a10",
			},
		},
	}
);
