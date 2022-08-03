import { ReactNode, useCallback, useEffect, useState } from 'react'
import { format, isSameDay, isToday } from 'date-fns'
import { useRouter } from 'next/router'
import { Daily } from 'contentlayer/generated'
import { motion, useMotionValue, useTransform } from 'framer-motion'

import { css, styled } from '@stitches.config'
import { getNextMonth, getPreviousMonth } from '@/lib/api'
import { Month, MonthSubjectsMap } from '@/lib/contentlayer'
import { Text, textStyles } from '@/components/Text'
import * as Calendar from '@/components/Calendar'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'

type Data = Pick<Daily, '_id' | 'title' | 'url'>

export default function DailyCalendar({
  month,
}: {
  month: Month
  data: Data[]
}) {
  const router = useRouter()

  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date())

  const onChangeCurrentMonthDate = useCallback(
    (date: Date) => setCurrentMonthDate(date),
    []
  )

  const handleRoute = (direction: 'next' | 'prev') => {
    const toMonth =
      direction === 'next' ? getNextMonth(month) : getPreviousMonth(month)

    // shallow is required bec data fetching will be handled client-side but
    // calendar month state will be handled with the URL
    router.push(`/${toMonth.toLowerCase()}`, undefined, { shallow: true })
  }

  return (
    // root
    <Main>
      <Calendar.Root onChangeCurrentMonthDate={onChangeCurrentMonthDate}>
        <Header>
          <Text
            size={{ '@initial': 'base', '@tab': 'xl' }}
            as="h1"
            css={{ fontWeight: '$regular' }}
          >
            {format(currentMonthDate, 'MMM y')}
          </Text>

          <SubjectTitle size={{ '@initial': 'base', '@tab': 'xl' }} as="h2">
            {MonthSubjectsMap[month]}
          </SubjectTitle>

          <CalendarButtonsContainer>
            <Calendar.PreviousMonthButton
              className={calendarButtonStyle()}
              onClick={() => handleRoute('prev')}
            >
              <ChevronLeftIcon />
            </Calendar.PreviousMonthButton>
            <Calendar.NextMonthButton
              className={calendarButtonStyle()}
              onClick={() => handleRoute('next')}
            >
              <ChevronRightIcon />
            </Calendar.NextMonthButton>
          </CalendarButtonsContainer>
        </Header>

        {/* calendar body */}
        <div>
          {/* weekdays container */}
          <CalendarRow css={{ mb: '1rem' }}>
            <Weekday>Sun</Weekday>
            <Weekday>Mon</Weekday>
            <Weekday>Tue</Weekday>
            <Weekday>Wed</Weekday>
            <Weekday>Thu</Weekday>
            <Weekday>Fri</Weekday>
            <Weekday>Sat</Weekday>
          </CalendarRow>
          <Days />
        </div>
      </Calendar.Root>
    </Main>
  )
}

const NAVIGATION_OFFSET = 85

function Days() {
  const [selectedDate, setSelectedDate] = useState(() => new Date())

  const [draggable, setDraggable] = useState(false)

  useEffect(() => {
    const htmlElement = document.querySelector('html')
    const TAB_WIDTH = 768

    if (htmlElement && htmlElement.clientWidth < TAB_WIDTH) setDraggable(true)
  }, [])

  const x = useMotionValue(0)
  const opacity = useTransform(
    x,
    [-NAVIGATION_OFFSET, 0, NAVIGATION_OFFSET],
    [0, 1, 0]
  )

  return (
    <Calendar.Days includeAdjacentMonths>
      {(days) => (
        <motion.div
          className={calendarRowStyle()}
          drag={draggable ? 'x' : false}
          dragSnapToOrigin
          dragConstraints={{
            left: 0,
            right: 0,
          }}
          // eslint-disable-next-line no-console
          onDragEnd={(_, info) => console.log(info.offset.x)}
          style={{ x, opacity }}
        >
          {days.map(({ value: day, isInCurrentMonth }, index) => (
            <Day
              key={day.toString()}
              css={
                index === 0 ? { gridColumnStart: day.getDay() + 1 } : undefined
              }
              onClick={() => setSelectedDate(day)}
              selected={isSameDay(day, selectedDate)}
              today={isToday(day)}
              inCurrentMonth={isInCurrentMonth}
            >
              {format(day, 'd')}
            </Day>
          ))}
        </motion.div>
      )}
    </Calendar.Days>
  )
}

const Main = styled('main', {
  maxWidth: '650px',
  mx: 'auto',
  px: '1rem',
  py: '2rem',

  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
})
const SubjectTitle = styled('h2', textStyles, {
  fontStyle: 'italic',
  color: '$olive11',
  fontWeight: '$regular',

  ml: '0.625rem',

  '@tab': { ml: 'initial' },
})
const CalendarButtonsContainer = styled('div', {
  display: 'flex',
  ml: 'auto',

  '@tab': { ml: 'initial' },
})
const Header = styled('header', {
  display: 'flex',
  alignItems: 'center',

  '@tab': {
    justifyContent: 'space-between',
  },
})

const calendarButtonStyle = css({
  size: '2rem',
  color: '$olive11',
  border: 'none',
  background: 'none',
  cursor: 'pointer',

  display: 'grid',
  placeItems: 'center',

  '&:hover': {
    color: '$olive12',
  },
})

const Day = styled('button', {
  p: '1rem',
  border: 'none',
  borderTop: '1px solid $olive3',
  background: 'none',
  fontSize: '$base',
  color: '$textColor',
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',

  '@tab': {
    height: '6.25rem',
    placeItems: 'flex-start',

    border: '1px solid $olive3',
  },

  variants: {
    today: {
      true: {
        position: 'relative',
        color: '$olive10',

        '&::before': {
          content: '',
          backgroundColor: '$olive3',
          borderRadius: '999px',
          position: 'absolute',
          size: '2em',
          zIndex: -1,

          '@tab': {
            top: '0.75em',
            left: '0.25em',
          },
        },
      },
    },
    selected: {
      true: {
        textDecoration: 'underline',
      },
    },
    inCurrentMonth: {
      false: {
        color: '$olive8',
      },
    },
  },
})

const calendarRowStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
})
const CalendarRow = styled('div', calendarRowStyle)

function Weekday({ children }: { children: ReactNode }) {
  return (
    <Text
      size="base"
      css={{
        textAlign: 'center',
        color: '$olive11',

        '@tab': { textAlign: 'left' },
      }}
    >
      {children}
    </Text>
  )
}
