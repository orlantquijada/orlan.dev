import {
	add,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	isSameMonth,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import {
	type ComponentProps,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	createContext,
	forwardRef,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

const CalendarContext = createContext<
	[Date, Dispatch<SetStateAction<Date>>] | undefined
>(undefined);

function useCalendar() {
	const context = useContext(CalendarContext);

	if (context === undefined)
		throw new Error("Must be used within a CalendarProvider");

	return context;
}

export function Root({
	children,
	onChangeCurrentMonthDate,
	defaultCurrentMonth: defaultValue,
}: {
	children: ReactNode;
	onChangeCurrentMonthDate?: (date: Date) => void;
	defaultCurrentMonth?: Date;
}) {
	const today = new Date();
	const [currentMonthStartDate, setCurrentMonthStartDate] = useState(() =>
		startOfMonth(defaultValue || today),
	);

	const state = useMemo(
		() =>
			[currentMonthStartDate, setCurrentMonthStartDate] as [
				Date,
				Dispatch<SetStateAction<Date>>,
			],
		[currentMonthStartDate],
	);

	useEffect(() => {
		if (onChangeCurrentMonthDate)
			onChangeCurrentMonthDate(currentMonthStartDate);
	}, [currentMonthStartDate, onChangeCurrentMonthDate]);

	return (
		<CalendarContext.Provider value={state}>
			{children}
		</CalendarContext.Provider>
	);
}

export const PreviousMonthButton = forwardRef<
	HTMLButtonElement,
	ComponentProps<"button">
>((props, ref) => {
	const [, setCurrentMonthStartDate] = useCalendar();

	const handleClick = () => {
		setCurrentMonthStartDate((current) => add(current, { months: -1 }));
	};

	return (
		<button
			ref={ref}
			{...props}
			onClick={(e) => {
				handleClick();

				if (props.onClick) props.onClick(e);
			}}
		/>
	);
});
PreviousMonthButton.displayName = "PreviousMonthButton";

export const NextMonthButton = forwardRef<
	HTMLButtonElement,
	ComponentProps<"button">
>((props, ref) => {
	const [, setCurrentMonthStartDate] = useCalendar();

	const handleClick = () => {
		setCurrentMonthStartDate((current) => add(current, { months: 1 }));
	};

	return (
		<button
			ref={ref}
			{...props}
			onClick={(e) => {
				handleClick();

				if (props.onClick) props.onClick(e);
			}}
		/>
	);
});
NextMonthButton.displayName = "NextMonthButton";

export const ResetToTodayButton = forwardRef<
	HTMLButtonElement,
	ComponentProps<"button">
>((props, ref) => {
	const [, setCurrentMonthStartDate] = useCalendar();

	const handleClick = () => {
		setCurrentMonthStartDate(startOfMonth(new Date()));
	};

	return (
		<button
			ref={ref}
			{...props}
			onClick={(e) => {
				handleClick();

				if (props.onClick) props.onClick(e);
			}}
		/>
	);
});
ResetToTodayButton.displayName = "ResetToTodayButton";

type DaysResult<T extends boolean> = T extends true
	? { value: Date; isInCurrentMonth: boolean }
	: { value: Date };

export function Days<TIncludeAdjacent extends boolean>(props: {
	children: (days: DaysResult<TIncludeAdjacent>[]) => ReactNode;
	includeAdjacentMonths?: TIncludeAdjacent;
}) {
	const { children, includeAdjacentMonths } = props;
	const [currentMonthStartDate] = useCalendar();
	const endOfMonthDate = endOfMonth(currentMonthStartDate);

	const days = eachDayOfInterval({
		start: includeAdjacentMonths
			? startOfWeek(currentMonthStartDate)
			: currentMonthStartDate,
		end: includeAdjacentMonths ? endOfWeek(endOfMonthDate) : endOfMonthDate,
	});

	if (includeAdjacentMonths)
		return children(
			days.map((day) => ({
				value: day,
				isInCurrentMonth: isSameMonth(day, currentMonthStartDate),
			})) as DaysResult<true>[],
		);

	return children(
		days.map((day) => ({ value: day })) as DaysResult<TIncludeAdjacent>[],
	);
}
