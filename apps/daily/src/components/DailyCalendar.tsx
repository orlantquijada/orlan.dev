import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { format, isSameDay, isThisMonth } from "date-fns";
import {
	type MotionValue,
	motion,
	useMotionValue,
	useTransform,
} from "motion/react";
import { useRouter } from "next/router";
import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

import { getMonthToday, getNextMonth, getPreviousMonth } from "@/lib/api";
import { type Month, MonthSubjectsMap } from "@/lib/contentlayer";
import { css, cva, cx } from "styled-system/css";
import { styled } from "styled-system/jsx";
import { text } from "styled-system/recipes";

import * as Calendar from "@/components/Calendar";

import PreviewToast from "./PreviewToast";
import UTurnLeftIcon from "./UTurnLeftIcon";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const NAVIGATION_OFFSET = 100;

export default function DailyCalendar({ month }: { month: Month }) {
	const router = useRouter();
	const [currentMonthDate, setCurrentMonthDate] = useState(() => {
		const today = new Date();
		return new Date(`${month} 1, ${today.getFullYear()}`);
	});
	const onChangeCurrentMonthDate = useCallback(
		(date: Date) => setCurrentMonthDate(date),
		[],
	);

	// TODO: refactor impl
	// currently drag next and prev actions are hacks by imperatively clicking these buttons
	const prevBtn = useRef<HTMLButtonElement>(null);
	const nextBtn = useRef<HTMLButtonElement>(null);

	const x = useMotionValue(0);
	const opacity = useTransform(
		x,
		[-NAVIGATION_OFFSET, 0, NAVIGATION_OFFSET],
		[0.1, 1, 0.1],
	);

	const [selectedDate, setSelectedDate] = useState<Date>();

	const handleRoute = (direction: "next" | "prev" | "reset") => {
		let toMonth = "";
		if (direction === "reset") toMonth = getMonthToday();
		else if (direction === "next") toMonth = getNextMonth(month);
		else if (direction === "prev") toMonth = getPreviousMonth(month);

		// shallow is required bec data fetching will be handled client-side but
		// calendar month state will be handled with the URL
		router.push(`/${toMonth.toLowerCase()}`, undefined, { shallow: true });
	};

	return (
		<>
			<Calendar.Root
				defaultCurrentMonth={currentMonthDate}
				onChangeCurrentMonthDate={onChangeCurrentMonthDate}
			>
				<Header>
					<h1
						className={cx(
							text({ size: { base: "base", md: "xl" } }),
							css({ fontWeight: "regular" }),
						)}
					>
						{format(currentMonthDate, "MMM y")}
					</h1>

					<SubjectTitle
						className={text({ size: { base: "base", md: "xl" } })}
						style={{ opacity }}
					>
						{MonthSubjectsMap[month]}
					</SubjectTitle>

					<CalendarButtonsContainer>
						{isThisMonth(currentMonthDate) ? null : (
							<Calendar.ResetToTodayButton
								className={calendarButtonStyle}
								onClick={() => handleRoute("reset")}
							>
								<span>
									<UTurnLeftIcon />
								</span>
							</Calendar.ResetToTodayButton>
						)}
						<Calendar.PreviousMonthButton
							ref={prevBtn}
							className={calendarButtonStyle}
							onClick={() => handleRoute("prev")}
						>
							<span>
								<ChevronLeftIcon />
							</span>
						</Calendar.PreviousMonthButton>
						<Calendar.NextMonthButton
							ref={nextBtn}
							className={calendarButtonStyle}
							onClick={() => handleRoute("next")}
						>
							<span>
								<ChevronRightIcon />
							</span>
						</Calendar.NextMonthButton>
					</CalendarButtonsContainer>
				</Header>

				<CalendarBody>
					<CalendarRow>
						{weekdays.map((weekday) => (
							<Weekday className={text({ size: "base" })} key={weekday}>
								{weekday}
							</Weekday>
						))}
					</CalendarRow>
					<Days
						next={() => nextBtn.current?.click()}
						prev={() => prevBtn.current?.click()}
						x={x}
						opacity={opacity}
						selectedDate={selectedDate}
						setSelectedDate={setSelectedDate}
					/>
				</CalendarBody>
			</Calendar.Root>
			<PreviewToast
				selectedDate={selectedDate}
				setSelectedDate={setSelectedDate}
			/>
		</>
	);
}

function Days({
	next,
	prev,
	x,
	opacity,
	selectedDate,
	setSelectedDate,
}: {
	next: () => void;
	prev: () => void;
	x: MotionValue<number>;
	opacity: MotionValue<number>;
	selectedDate: Date | undefined;
	setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
}) {
	const today = new Date();

	const [jsLoaded, setJsLoaded] = useState(false);
	useEffect(() => {
		setJsLoaded(true);
	}, []);

	return (
		<Calendar.Days includeAdjacentMonths>
			{(days) => (
				<motion.div
					drag="x"
					dragSnapToOrigin
					dragConstraints={{ left: 0, right: 0 }}
					dragElastic={0.3}
					onDragEnd={(_, info) => {
						const offset = info.offset.x;

						if (offset > 0 && offset > NAVIGATION_OFFSET) prev();
						else if (offset < 0 && offset < -NAVIGATION_OFFSET) next();
					}}
					style={{ x, opacity, paddingBlockEnd: "5rem" }}
				>
					<DaysContainer>
						{days.map(({ value: day, isInCurrentMonth }) => (
							<StyledDay
								key={day.toString()}
								onDragStart={(e) => e.preventDefault()}
								onClick={() => setSelectedDate(day)}
								selected={selectedDate && isSameDay(day, selectedDate)}
								today={jsLoaded && isSameDay(day, today)}
								inCurrentMonth={isInCurrentMonth}
							>
								<span style={{ zIndex: 1 }}>{format(day, "d")}</span>
							</StyledDay>
						))}
					</DaysContainer>
				</motion.div>
			)}
		</Calendar.Days>
	);
}

//////////////////////////////////////////////////////////////////

const SubjectTitle = styled(motion.h2, {
	base: {
		fontStyle: "italic",
		color: "olive.11",
		fontWeight: "regular",

		ml: "0.625rem",

		md: { ml: "initial" },
	},
});
const CalendarButtonsContainer = styled("div", {
	base: {
		display: "flex",
		ml: "auto",

		md: { ml: "initial" },
	},
});
const Header = styled("header", {
	base: {
		display: "flex",
		alignItems: "center",
		width: "full",

		md: {
			justifyContent: "space-between",
		},
	},
});

const CalendarBody = styled("div", {
	base: {
		display: "flex",
		flexDirection: "column",

		gap: "1rem",

		width: "full",
	},
});

const calendarButtonStyle = css({
	w: "2rem",
	h: "2rem",
	color: "olive.11",
	border: "none",
	background: "none",
	cursor: "pointer",

	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	transition: "box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)",
	borderRadius: "0.25rem",

	"& span": {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},

	_hover: {
		color: "olive.12",
	},
	"&:focus-within, &:active": {
		outline: "none",
		"--ring-width": "2px",
		"--ring-offset": "2px",
		"--ring-color": "colors.olive.7",
		boxShadow:
			"0 0 0 var(--ring-width) var(--colors-bg), 0 0 0 calc(var(--ring-width) + var(--ring-offset)) var(--ring-color)",
	},
});

const calendarGrid = cva({
	base: {
		display: "grid",
		gridTemplateColumns: "repeat(7, 1fr)",
	},
});
const CalendarRow = styled("div", calendarGrid);
const DaysContainer = styled("div", {
	base: {
		...calendarGrid.raw(),

		md: {
			border: "1px solid",
			borderColor: "olive.3",
		},
	},
});

const StyledDay = styled("button", {
	base: {
		p: "1rem",
		// px: '1rem',
		height: "4rem",

		border: "none",
		borderTop: "1px solid",
		borderTopColor: "olive.3",
		background: "bg",
		fontSize: "base",
		color: "textColor",
		display: "grid",
		placeItems: "center",
		cursor: "pointer",
		lineHeight: 1,
		WebkitTapHighlightColor: "transparent",

		_focus: {
			outlineColor: "olive.7",
		},

		md: {
			height: "6.25rem",
			placeItems: "flex-start",
			border: "1px solid",
			borderColor: "olive.3",
		},
	},
	variants: {
		today: {
			true: {
				position: "relative",
				color: "olive.10",

				_before: {
					content: "''",
					backgroundColor: "olive.3",
					borderRadius: "999px",
					position: "absolute",
					w: "2em",
					h: "2em",

					md: {
						top: "0.5em",
						left: "0.5em",
					},
				},
			},
		},
		selected: {
			true: {
				textDecoration: "underline",
			},
		},
		inCurrentMonth: {
			false: {
				color: "olive.8",
			},
		},
	},
});

const Weekday = styled("span", {
	base: {
		textAlign: "center",
		color: "olive.11",

		md: { textAlign: "left" },
	},
});
