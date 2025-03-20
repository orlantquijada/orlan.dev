import { useMDXComponent } from "next-contentlayer2/hooks";
import Link from "next/link";
import type { ComponentProps } from "react";

import type { Daily } from "contentlayer/generated";
import { cva, cx } from "styled-system/css";
import { styled } from "styled-system/jsx";
import { text } from "styled-system/recipes";

export function LikesList({ likes }: { likes: Daily[] }) {
	return (
		<StyledLikesList>
			{likes.map((like) => (
				<LikedCard daily={like} key={`${like.month}-${like.day}`} />
			))}
		</StyledLikesList>
	);
}

function LikedCard({ daily }: { daily: Daily }) {
	const Title = useMDXComponent(daily.title.code);

	return (
		<StyledLi>
			<Link
				href={{
					pathname: "/[month]/[day]",
					query: {
						month: daily.month,
						day: daily.day,
					},
				}}
				passHref
				legacyBehavior
			>
				<StyledA>
					<StyledDate>
						{daily.month.slice(0, 3)} {daily.day}
					</StyledDate>
					<Title components={likedTitleComponents} />
					<StyledAuthor>{daily.author}</StyledAuthor>
				</StyledA>
			</Link>
		</StyledLi>
	);
}

const StyledDate = styled("span", {
	base: {
		gridArea: "date",
		display: "flex",
		justifyContent: "flex-end",
		alignItems: "flex-end",

		color: "olive.9",

		md: {
			justifyContent: "flex-start",
		},
	},
});
const StyledAuthor = styled("span", {
	base: {
		gridArea: "author",
		color: "olive.11",
		flexShrink: 0,
		md: {
			ml: "auto",
		},
	},
});
const StyledLikesList = styled("ol", {
	base: {
		listStyle: "none",
		padding: 0,
	},
});
const StyledLi = styled("li", {
	base: {
		"&:not(:first-of-type)": {
			borderTop: "1px solid",
			borderTopColor: "olive.3",
		},
	},
});
const StyledA = styled("a", {
	base: {
		display: "grid",
		gridTemplateAreas: `
"title title"
"author date"
`,

		py: "1rem",
		px: "0.5rem",
		mx: "-0.5rem",
		transition: "all 150ms ease",

		md: {
			gridTemplateAreas: `
"date title author"
`,
			gridTemplateColumns: "5rem auto auto",
		},

		_hover: {
			backgroundColor: "olive.2",
		},
	},
});
const title = cva({
	base: {
		gridArea: "title",

		color: "olive.11",
		fontWeight: "bold",

		display: "block",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",

		md: {
			marginTop: 0,
		},
	},
});

const likedTitleComponents = {
	p: (props: ComponentProps<"p">) => (
		<p
			{...props}
			className={cx(text({ size: { base: "base", md: "lg" } }), title())}
		/>
	),
};
