import {
  type ComponentProps,
  type Dispatch,
  type ReactElement,
  type ReactNode,
  type SetStateAction,
  createContext,
  forwardRef,
  useContext,
  useState,
} from 'react'
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from 'date-fns'

const CalendarContext = createContext<
  [Date, Dispatch<SetStateAction<Date>>] | undefined
>(undefined)

function useCalendar() {
  const context = useContext(CalendarContext)

  if (context === undefined)
    throw new Error('Must be used within a CalendarProvider')

  return context
}

export function Root({ children }: { children: ReactNode }) {
  const today = new Date()
  const state = useState(startOfMonth(today))

  return (
    <CalendarContext.Provider value={state}>
      {children}
    </CalendarContext.Provider>
  )
}

export const PreviousMonthButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<'button'>
>((props, ref) => {
  const [, setCurrentMonthStartDate] = useCalendar()

  const handleClick = () => {
    setCurrentMonthStartDate((current) => add(current, { months: -1 }))
  }

  return (
    <button
      ref={ref}
      {...props}
      onClick={(e) => {
        handleClick()

        if (props.onClick) props.onClick(e)
      }}
    />
  )
})
PreviousMonthButton.displayName = 'PreviousMonthButton'

export const NextMonthButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<'button'>
>((props, ref) => {
  const [, setCurrentMonthStartDate] = useCalendar()

  const handleClick = () => {
    setCurrentMonthStartDate((current) => add(current, { months: 1 }))
  }

  return (
    <button
      ref={ref}
      {...props}
      onClick={(e) => {
        handleClick()

        if (props.onClick) props.onClick(e)
      }}
    />
  )
})
NextMonthButton.displayName = 'NextMonthButton'

export function Days({
  children,
  includeAdjacentMonths,
}: {
  children: (days: Date[]) => ReactElement
  includeAdjacentMonths?: boolean
}) {
  const [currentMonthStartDate] = useCalendar()
  const endOfMonthDate = endOfMonth(currentMonthStartDate)

  const days = eachDayOfInterval({
    start: includeAdjacentMonths
      ? startOfWeek(currentMonthStartDate)
      : currentMonthStartDate,
    end: includeAdjacentMonths ? endOfWeek(endOfMonthDate) : endOfMonthDate,
  })

  return children(days)
}
