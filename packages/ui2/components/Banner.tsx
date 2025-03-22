import { type ComponentProps, forwardRef } from "react";

import { css, cx } from "../styled-system/css";

import { styled } from "../styled-system/jsx";
import { pill, text } from "../styled-system/recipes";
import type { Pill } from "./Pill";
import { Text } from "./Text";

export const Container = styled.div({
	border: "3px dashed colors.olive.6",
	borderRadius: "md",
	p: "3",
	display: "flex",
	justifyContent: "space-around",
	alignItems: "center",
	gap: "2",
});

export const Tag = forwardRef<HTMLSpanElement, ComponentProps<typeof Text>>(
	(props, ref) => (
		<Text
			{...props}
			size="2xs"
			css={{
				color: "olive.9",
				fontWeight: "bold",
				border: "2px solid colors.olive.6",
				borderRadius: "md",
				py: "1",
				px: "2",
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				...props.css,
			}}
			ref={ref}
		/>
	),
);

export const Title = forwardRef<
	HTMLParagraphElement,
	ComponentProps<typeof Text>
>(({ size, css: cssProp, className, ...props }, ref) => (
	<styled.p
		{...props}
		className={cx(
			text({ size: size || { base: "xs", tab: "sm" } }),
			css({ color: "olive.11", flex: 1 }, cssProp),
			className,
		)}
		ref={ref}
	/>
));

export const Close = forwardRef<HTMLButtonElement, ComponentProps<typeof Pill>>(
	({ css: cssProp, className, ...props }, ref) => (
		<styled.button
			{...props}
			className={cx(
				pill({ size: "1" }),
				css(
					{
						fontSize: "xs",
						fontWeight: "semibold",
					},
					cssProp,
				),
				className,
			)}
			ref={ref}
		/>
	),
);
