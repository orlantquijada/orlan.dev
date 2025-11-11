import WIPBanner from "@components/WIPBanner";
import { Box, type Text } from "components";
import type { ComponentProps } from "react";
import { css, cx } from "styled/css";
import { _flex, text } from "styled/recipes";

export default function Home() {
	return (
		<div
			className={css({
				minHeight: "100vh",
				pt: "8",
				"& > *": { px: "4" },
				tab: {
					pt: "16",
				},
			})}
		>
			<div
				className={cx(
					_flex({ direction: "column" }),
					css({
						maxWidth: 780,
						tab: { mx: "auto" },
					}),
				)}
			>
				<WIPBanner css={{ mb: "6" }} />
				<HeaderText>
					<span
						className={cx(text(), css({ display: "block", color: "accent" }))}
					>
						Orlan Quijada
					</span>
					Full Stack
					<span className={cx(text(), css({ display: "block" }))}>
						Developer &
					</span>
					Freelancer
				</HeaderText>
			</div>
			<Box />
		</div>
	);
}

function HeaderText({ children }: ComponentProps<typeof Text>) {
	return (
		<span
			className={cx(
				text({
					size: {
						base: "5xl",
						tab: "7xl",
					},
				}),
				css({
					color: "olive.12",
					fontFamily: "serif",
				}),
			)}
		>
			{children}
		</span>
	);
}
