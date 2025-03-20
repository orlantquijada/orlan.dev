import type { Daily } from "contentlayer/generated";
import { AnimatePresence, type Variants, motion } from "motion/react";
import { useMDXComponent } from "next-contentlayer2/hooks";
import Link from "next/link";
import {
	type ComponentProps,
	type Dispatch,
	type SetStateAction,
	useEffect,
} from "react";
import useSWR from "swr";

import { type MDXComponents, Months } from "@/lib/contentlayer";
import { cva } from "styled-system/css";
import { styled } from "styled-system/jsx";
import { text } from "styled-system/recipes";

// const variants: Variants = {
//   hide: { y: 'calc(100% + var(--contentPaddingY))', x: '50%' },
//   show: { y: 0, x: '50%' },
// }
const variants: Variants = {
	hide: { y: "30%", opacity: 0 },
	show: { y: 0, opacity: 1 },
};

export default function PreviewToast({
	selectedDate,
	setSelectedDate,
}: {
	selectedDate: Date | undefined;
	setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
}) {
	const { data: daily, error } = useSWR<Daily>(
		() =>
			selectedDate
				? `api/${Months[selectedDate.getMonth()]}/${selectedDate.getDate()}`
				: null,
		fetcher,
	);

	useEffect(() => {
		function hideOnEsc(event: KeyboardEvent) {
			if (event.code === "Escape") setSelectedDate(undefined);
		}

		window.addEventListener("keydown", hideOnEsc);

		return () => window.removeEventListener("keydown", hideOnEsc);
	}, [setSelectedDate]);

	const loading = !daily && !error;

	return (
		<AnimatePresence mode="wait">
			{selectedDate && (
				<motion.div
					variants={variants}
					// react magic: unmount component on `selectedDate` change
					key={selectedDate.toString()}
					initial="hide"
					animate="show"
					exit="hide"
					transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
					className={container()}
				>
					{loading ? (
						<LoadingTitleSkeleton />
					) : daily ? (
						<ToastTitle title={daily.title} />
					) : (
						<Title className={text({ size: { base: "base", md: "lg" } })}>
							No content yet!
						</Title>
					)}

					{daily ? (
						<Link passHref href={daily ? daily.url : "/"} legacyBehavior>
							<Action>View</Action>
						</Link>
					) : null}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

const LoadingTitleSkeleton = styled("div", {
	base: {
		"--skeletonColor": "colors.olive.5",
		"--shineColor": "colors.olive.2",

		backgroundImage:
			"linear-gradient(270deg, var(--skeletonColor), var(--shineColor), var(--skeletonColor))",
		backgroundSize: "400% 100%",
		width: "15rem",
		height: "1.5rem",
		borderRadius: "0.5rem",
		animation: "shimmer 8s ease-in-out infinite",
	},
});

const toastTitleComponents = {
	p: (props: ComponentProps<typeof Title>) => (
		<Title {...props} className={text({ size: { base: "base", md: "lg" } })} />
	),
} as MDXComponents;

function ToastTitle({ title }: Pick<Daily, "title">) {
	const TitleMDX = useMDXComponent(title.code);

	return <TitleMDX components={toastTitleComponents} />;
}

//////////////////////////////////////////////////////////////////

const container = cva({
	base: {
		backgroundColor: "olive.1",
		borderRadius: "0.5rem",
		border: "1px solid",
		borderColor: "olive.6",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		gap: "1rem",
		p: "0.75rem",
		zIndex: 1,

		height: "var(--toastHeight)",
		position: "fixed",
		bottom: "var(--contentPaddingY)",
		left: 0,
		right: 0,
		mx: "auto",
		"--viewportPadding": "calc(var(--contentPaddingX) * 2)",
		width: "calc(100% - var(--viewportPadding))",
		maxWidth: "calc(var(--contentMaxWidth) - var(--viewportPadding))",
	},
});

const Title = styled("span", {
	base: {
		color: "olive.11",
		fontWeight: "bold",
		display: "block",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
	},
});

const Action = styled("a", {
	base: {
		backgroundColor: "transparent",
		color: "olive.11",
		borderRadius: "4px",
		height: "full",
		px: "0.5rem",
		display: "grid",
		placeItems: "center",
		transition:
			"box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)",
		fontSize: "base",
		WebkitTapHighlightColor: "transparent",

		_hover: { backgroundColor: "olive.3" },
		_focus: {
			backgroundColor: "olive.3",
			outline: "none",
			"--ring-width": "2px",
			"--ring-offset": "2px",
			"--ring-color": "colors.olive.7",
			boxShadow:
				"0 0 0 var(--ring-width) var(--colors-bg), 0 0 0 calc(var(--ring-width) + var(--ring-offset)) var(--ring-color)",
		},

		md: {
			fontSize: "lg",
			px: "0.75rem",
		},
	},
});

//////////////////////////////////////////////////////////////////

async function fetcher(url: string) {
	const res = await fetch(url);

	if (!res.ok) {
		const error: Error & { info: unknown; status: number } = {
			...new Error("An error occurred while fetching the data."),
			info: await res.json(),
			status: res.status,
		};
		throw error;
	}

	return res.json();
}
