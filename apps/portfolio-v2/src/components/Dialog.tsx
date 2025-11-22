import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva } from "cva";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const contentStyles = cva(
	[
		"-translate-1/2 fixed top-1/2 left-1/2 max-h-[80vh] w-[calc(100vw-(24px*2))] max-w-[570px] p-8",
		"rounded-2xl border shadow-sm",
		"z-50",
		"data-[state=closed]:motion-safe:animate-hideContent data-[state=open]:motion-safe:animate-showContent",
	],
	{
		variants: {
			color: {
				gray: "border-gray7 bg-gray1",
			},
			transluscent: {
				true: "dark:bg-gray-a3 dark:backdrop-blur-md dark:backdrop-brightness-75",
				false: "dark:border-gray6 dark:bg-gray3",
			},
		},
		defaultVariants: {
			transluscent: false,
			color: "gray",
		},
	}
);

const overlayStyles = cva([
	"fixed inset-0 bg-overlay",
	"data-[state=closed]:motion-safe:animate-hide data-[state=open]:motion-safe:animate-show",
	"z-40",
]);

type Props = {
	trigger: ReactNode;
	children: ReactNode;
} & DialogPrimitive.DialogProps;

export function Root(props: Props) {
	const { children, trigger } = props;

	return (
		<DialogPrimitive.Root>
			<DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay className={overlayStyles()} />
				<DialogPrimitive.Content
					className={twMerge(contentStyles({ transluscent: true }))}
				>
					{children}
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}

export const Trigger = DialogPrimitive.Trigger;
export const Close = DialogPrimitive.Close;
export const Title = DialogPrimitive.Title;
export const Description = DialogPrimitive.Description;
