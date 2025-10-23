import type { ComponentProps } from "react";
import type { CSS } from "styled";
import { css, cx } from "styled/css";
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

type TagProps = ComponentProps<"span"> & TextVariantProps & { css?: CSS };

export function Tag({
	css: cssProp,
	className,
	size,
	ref,
	...props
}: TagProps) {
	return (
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
	);
}

type TitleProps = ComponentProps<"p"> & TextVariantProps & { css?: CSS };

export function Title({
	size,
	css: cssProp,
	className,
	ref,
	...props
}: TitleProps) {
	return (
		<p
			{...props}
			className={cx(
				text({ size: size || { base: "xs", tab: "sm" } }),
				css({ color: "olive.11", flex: 1 }, cssProp),
				className,
			)}
			ref={ref}
		/>
	);
}

type CloseProps = ComponentProps<"button"> & { css?: CSS };

export function Close({ css: cssProp, className, ref, ...props }: CloseProps) {
	return (
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
	);
}
