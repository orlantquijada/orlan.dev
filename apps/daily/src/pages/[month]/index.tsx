import { AnimatePresence, motion } from "motion/react";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { useLikes } from "@/hooks/useLikes";
import { type Month, MonthSubjectsMap, Months } from "@/lib/contentlayer";
import { capitalize, getDetailSocialMediaImage } from "@/lib/utils";
import { css, cx } from "styled-system/css";
import { styled } from "styled-system/jsx";
import { text } from "styled-system/recipes";

import DailyCalendar from "@/components/DailyCalendar";
import { LikesList } from "@/components/Likes";
import MetaTags from "@/components/MetaTags";
import type { Daily } from "contentlayer/generated";
// import InstallButton from '@/components/InstallButton'

export default function MonthsNavPage() {
	const { query } = useRouter();
	const month = query.month as Lowercase<Month>;
	const capitalizedMonth = capitalize(month);
	const subject = MonthSubjectsMap[capitalizedMonth];
	const image = getDetailSocialMediaImage({
		title: subject,
		subtitle: capitalizedMonth,
		author: "",
	});

	const likes = useLikes();
	const likesThisMonth = likes
		.filter((daily) => daily.month === capitalizedMonth)
		.sort((current, next) => current.day - next.day);

	return (
		<>
			<MetaTags
				description={subject}
				title={`${capitalizedMonth} — ${subject}`}
				image={image}
				url={`/${month}`}
			/>
			<Main>
				<DailyCalendar month={capitalizedMonth} />
				<Likes likes={likesThisMonth} month={capitalizedMonth} />

				{/* <InstallButton */}
				{/*   css={{ */}
				{/*     height: 'var(--toastHeight)', */}
				{/*     position: 'fixed', */}
				{/*     bottom: 'var(--contentPaddingY)', */}
				{/*     right: 'var(--contentPaddingX)', */}

				{/*     '@tab': { */}
				{/*       right: 'var(--contentPaddingY)', */}
				{/*     }, */}
				{/*   }} */}
				{/* /> */}
			</Main>
		</>
	);
}

function Likes({ likes, month }: { likes: Daily[]; month: Month }) {
	return (
		<AnimatePresence mode="wait">
			{likes.length ? (
				<motion.section
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15 }}
					className={css({ width: "full" })}
					key={month}
				>
					<h2
						className={cx(
							text({ size: { base: "xl", md: "2xl" } }),
							css({ fontWeight: "bold", color: "olive.11" }),
						)}
					>
						Liked
					</h2>

					<LikesList likes={likes} />
				</motion.section>
			) : null}
		</AnimatePresence>
	);
}

const Main = styled("main", {
	base: {
		"--contentMaxWidth": "650px",
		"--contentPaddingX": "1rem",
		"--contentPaddingY": "2rem",
		"--toastHeight": "4rem",

		maxWidth: "var(--contentMaxWidth)",
		mx: "auto",
		px: "var(--contentPaddingX)",
		pt: "var(--contentPaddingY)",
		pb: "calc(var(--contentPaddingY) + var(--toastHeight) + 1rem)",
		minHeight: "100vh",

		display: "flex",
		flexDirection: "column",
		gap: "1.5rem",
		alignItems: "center",

		animation: "fadeIn 1s both",

		// handle days drag to the right (translateX overflow) which causes everything to scale down
		overflowX: "hidden",

		md: {
			overflowX: "initial",
		},
	},
});

export const getStaticPaths: GetStaticPaths = async () => {
	const paths = Months.map((month) => ({
		params: { month: month.toLowerCase() },
	}));

	return {
		paths,
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps<
	Record<string, never>,
	{ month: Lowercase<Month> }
> = async ({ params }) => {
	if (!params) return { notFound: true };

	const month = capitalize(params.month);

	if (!Months.includes(month)) return { notFound: true };

	return {
		props: {},
	};
};
