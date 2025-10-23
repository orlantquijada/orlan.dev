import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "cva";
import type { ReactNode, Ref } from "react";
import { twMerge } from "tailwind-merge";

import { chipStyles } from "./styles";

export type ChipVariantProps = VariantProps<typeof chipStyles>;

type ChipProps = ChipVariantProps & {
	children: ReactNode;
	className?: string | undefined;
	asChild?: boolean;
	ref?: Ref<HTMLButtonElement>;
};

export default function Chip({ ref, ...props }: ChipProps) {
	const {
		color = "gray",
		size = "responsive",
		transluscent = true,
		children,
		asChild,
		className,
	} = props;

	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			className={twMerge(chipStyles({ color, size, transluscent, className }))}
			ref={ref}
		>
			{children}
		</Comp>
	);
}
