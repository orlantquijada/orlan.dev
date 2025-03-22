import { type ComponentProps, forwardRef } from "react";

import { css, cx } from "styled/css";

import type { CSS } from "styled";
import { pill, text } from "styled/recipes";
import type { TextVariantProps } from "../styled-system/recipes";

export function Container({
	className,
	css: cssProp,
	...props
}: ComponentProps<"div"> & { css?: CSS }) {
	return (
		<div
			className={cx(
				css(
					{
						border: "3px dashed {colors.olive.6}",
						borderRadius: "md",
						p: "3",
						display: "flex",
						justifyContent: "space-around",
						alignItems: "center",
						gap: "2",
					},
					cssProp,
				),
				className,
			)}
			{...props}
		/>
	);
}

export const Tag = forwardRef<
	HTMLSpanElement,
	ComponentProps<"span"> & TextVariantProps & { css?: CSS }
>(({ css: cssProp, className, size, ...props }, ref) => (
	<span
		{...props}
		className={cx(
			text({ size: size || "2xs" }),
			css(
				{
					color: "olive.9",
					fontWeight: "bold",
					border: "2px solid {colors.olive.6}",
					borderRadius: "md",
					py: "1",
					px: "2",
					display: "inline-flex",
					alignItems: "center",
					justifyContent: "center",
				},
				cssProp,
			),
			className,
		)}
		ref={ref}
	/>
));

export const Title = forwardRef<
	HTMLParagraphElement,
	ComponentProps<"span"> & TextVariantProps & { css?: CSS }
>(({ size, css: cssProp, className, ...props }, ref) => (
	<p
		{...props}
		className={cx(
			text({ size: size || { base: "xs", tab: "sm" } }),
			css({ color: "olive.11", flex: 1 }, cssProp),
			className,
		)}
		ref={ref}
	/>
));

export const Close = forwardRef<
	HTMLButtonElement,
	ComponentProps<"button"> & { css?: CSS }
>(({ css: cssProp, className, ...props }, ref) => (
	<button
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
));
