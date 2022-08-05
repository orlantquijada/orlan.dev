import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { format, isSameDay, isToday } from 'date-fns'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Daily } from 'contentlayer/generated'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'

import { css, styled } from '@stitches.config'
import { getNextMonth, getPreviousMonth } from '@/lib/api'
import { Month, Months, MonthSubjectsMap } from '@/lib/contentlayer'
import { Text, textStyles } from '@/components/Text'
import * as Calendar from '@/components/Calendar'

type Data = Pick<Daily, '_id' | 'title' | 'url'>
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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

  // TODO: refactor impl
  // currently drag next and prev actions are hacks by imperatively clicking these buttons
  const prevBtn = useRef<HTMLButtonElement>(null)
  const nextBtn = useRef<HTMLButtonElement>(null)

  const handleRoute = (direction: 'next' | 'prev') => {
    const toMonth =
      direction === 'next' ? getNextMonth(month) : getPreviousMonth(month)

    // shallow is required bec data fetching will be handled client-side but
    // calendar month state will be handled with the URL
    router.push(`/${toMonth.toLowerCase()}`, undefined, { shallow: true })
  }

  return (
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
              ref={prevBtn}
              className={calendarButtonStyle()}
              onClick={() => handleRoute('prev')}
            >
              <ChevronLeftIcon />
            </Calendar.PreviousMonthButton>
            <Calendar.NextMonthButton
              ref={nextBtn}
              className={calendarButtonStyle()}
              onClick={() => handleRoute('next')}
            >
              <ChevronRightIcon />
            </Calendar.NextMonthButton>
          </CalendarButtonsContainer>
        </Header>

        <div>
          <CalendarRow css={{ mb: '1rem' }}>
            {weekdays.map((weekday) => (
              <Weekday size="base" key={weekday}>
                {weekday}
              </Weekday>
            ))}
          </CalendarRow>
          <Days
            next={() => nextBtn.current?.click()}
            prev={() => prevBtn.current?.click()}
          />
        </div>
      </Calendar.Root>
    </Main>
  )
}

const NAVIGATION_OFFSET = 100

function Days({ next, prev }: { next: () => void; prev: () => void }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date())

  const x = useMotionValue(0)
  const opacity = useTransform(
    x,
    [-NAVIGATION_OFFSET, 0, NAVIGATION_OFFSET],
    [0.1, 1, 0.1],
    { clamp: true }
  )

  return (
    <Calendar.Days includeAdjacentMonths>
      {(days) => (
        <motion.div
          className={calendarRowStyle({ css: { pb: '4rem' } })}
          drag="x"
          dragSnapToOrigin
          dragConstraints={{ left: -10, right: 10 }}
          dragPropagation
          onDragEnd={(_, info) => {
            const offset = info.offset.x

            if (offset > 0 && offset > NAVIGATION_OFFSET) prev()
            else if (offset < 0 && offset < -NAVIGATION_OFFSET) next()
          }}
          style={{ x, opacity }}
        >
          {days.map(({ value: day, isInCurrentMonth }, index) => (
            <Link
              passHref
              href={`/${Months[day.getMonth()].toLowerCase()}/${day.getDate()}`}
              key={day.toString()}
            >
              <Day
                onDragStart={(e) => e.preventDefault()}
                css={
                  index === 0
                    ? { gridColumnStart: day.getDay() + 1 }
                    : undefined
                }
                onClick={() => {
                  setSelectedDate(day)

                  //TODO: handle onclick if not in current month to set it to the adjacent month
                }}
                selected={isSameDay(day, selectedDate)}
                today={isToday(day)}
                inCurrentMonth={isInCurrentMonth}
              >
                {format(day, 'd')}
              </Day>
            </Link>
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

  // handle days drag to the right (translateX overflow) which causes everything to scale down
  overflowX: 'hidden',

  '@tab': {
    overflowX: 'initial',
  },
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

const Day = styled('a', {
  p: '1rem',
  border: 'none',
  borderTop: '1px solid $olive3',
  background: '$bg',
  fontSize: '$base',
  color: '$textColor',
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
  lineHeight: 1,

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
            size: '2em',
            top: '0.5em',
            left: '0.5em',
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

const Weekday = styled('span', textStyles, {
  textAlign: 'center',
  color: '$olive11',

  '@tab': { textAlign: 'left' },
})
