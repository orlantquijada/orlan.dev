import WIPBanner from "@components/WIPBanner";
import type { ComponentProps } from "react";
import { Box, Flex, Text } from "ui";

export default function Home() {
	return (
		<Box
			css={{
				minHeight: "100vh",
				pt: "$8",
				"& > *": { px: "$4" },
				"@tab": {
					pt: "$16",
				},
			}}
		>
			<Flex
				direction="column"
				as="header"
				css={{ maxWidth: 780, "@tab": { mx: "auto" } }}
			>
				<WIPBanner css={{ mb: "$6" }} />
				<HeaderText>
					<Text css={{ display: "block", color: "$accent" }}>
						Orlan Quijada
					</Text>
					Full Stack <Text css={{ display: "block" }}>Developer &</Text>
					Freelancer
				</HeaderText>
			</Flex>
			<Box as="main"></Box>
		</Box>
	);
}

function HeaderText({ children }: ComponentProps<typeof Text>) {
	return (
		<Text
			size={{ base: "5xl", tab: "7xl" }}
			css={{
				color: "olive.12",
				fontFamily: "seri",
			}}
		>
			{children}
		</Text>
	);
}
