import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useRef,
  useState,
  useEffect,
} from 'react'
import { useRouter } from 'next/router'
import { format, isSameDay } from 'date-fns'
import {
  motion,
  MotionValue,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'

import { css, styled } from '@stitches.config'
import { getNextMonth, getPreviousMonth } from '@/lib/api'
import { Month, MonthSubjectsMap } from '@/lib/contentlayer'

import { Text, textStyles } from '@/components/Text'
import * as Calendar from '@/components/Calendar'

import PreviewToast from './PreviewToast'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const NAVIGATION_OFFSET = 100

export default function DailyCalendar({ month }: { month: Month }) {
  const router = useRouter()
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const today = new Date()
    return new Date(`${month} 1, ${today.getFullYear()}`)
  })
  const onChangeCurrentMonthDate = useCallback(
    (date: Date) => setCurrentMonthDate(date),
    []
  )

  // TODO: refactor impl
  // currently drag next and prev actions are hacks by imperatively clicking these buttons
  const prevBtn = useRef<HTMLButtonElement>(null)
  const nextBtn = useRef<HTMLButtonElement>(null)

  const x = useMotionValue(0)
  const opacity = useTransform(
    x,
    [-NAVIGATION_OFFSET, 0, NAVIGATION_OFFSET],
    [0.1, 1, 0.1]
  )

  const [selectedDate, setSelectedDate] = useState<Date>()

  const handleRoute = (direction: 'next' | 'prev') => {
    const toMonth =
      direction === 'next' ? getNextMonth(month) : getPreviousMonth(month)

    // shallow is required bec data fetching will be handled client-side but
    // calendar month state will be handled with the URL
    router.push(`/${toMonth.toLowerCase()}`, undefined, { shallow: true })
  }

  return (
    <>
      <Calendar.Root
        defaultCurrentMonth={currentMonthDate}
        onChangeCurrentMonthDate={onChangeCurrentMonthDate}
      >
        <Header>
          <Text
            size={{ '@initial': 'base', '@tab': 'xl' }}
            as="h1"
            css={{ fontWeight: '$regular' }}
          >
            {format(currentMonthDate, 'MMM y')}
          </Text>

          <SubjectTitle
            size={{ '@initial': 'base', '@tab': 'xl' }}
            style={{ opacity }}
          >
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

        <CalendarBody>
          <CalendarRow>
            {weekdays.map((weekday) => (
              <Weekday size="base" key={weekday}>
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
  )
}

function Days({
  next,
  prev,
  x,
  opacity,
  selectedDate,
  setSelectedDate,
}: {
  next: () => void
  prev: () => void
  x: MotionValue<number>
  opacity: MotionValue<number>
  selectedDate: Date | undefined
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>
}) {
  const today = new Date()

  const [jsLoaded, setJsLoaded] = useState(false)
  useEffect(() => {
    setJsLoaded(true)
  }, [])

  return (
    <Calendar.Days includeAdjacentMonths>
      {(days) => (
        <motion.div
          drag="x"
          dragSnapToOrigin
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          onDragEnd={(_, info) => {
            const offset = info.offset.x

            if (offset > 0 && offset > NAVIGATION_OFFSET) prev()
            else if (offset < 0 && offset < -NAVIGATION_OFFSET) next()
          }}
          style={{ x, opacity, paddingBlockEnd: '5rem' }}
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
                <span style={{ zIndex: 1 }}>{format(day, 'd')}</span>
              </StyledDay>
            ))}
          </DaysContainer>
        </motion.div>
      )}
    </Calendar.Days>
  )
}

//////////////////////////////////////////////////////////////////

const SubjectTitle = styled(motion.h2, textStyles, {
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
  width: '100%',

  '@tab': {
    justifyContent: 'space-between',
  },
})

const CalendarBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',

  gap: '1rem',

  width: '100%',
})

const calendarButtonStyle = css({
  size: '2rem',
  color: '$olive11',
  border: 'none',
  background: 'none',
  cursor: 'pointer',

  display: 'grid',
  placeItems: 'center',
  transition: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: '0.25rem',

  '&:hover': {
    color: '$olive12',
  },
  '&:focus, &:active': {
    ring: '$olive7',
  },
})
const CalendarRow = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
})

const DaysContainer = styled('div', CalendarRow, {
  '@tab': {
    border: '1px solid $olive3',
  },
})

const StyledDay = styled('button', {
  p: '1rem',
  // px: '1rem',
  height: '4rem',

  border: 'none',
  borderTop: '1px solid $olive3',
  background: '$bg',
  fontSize: '$base',
  color: '$textColor',
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
  lineHeight: 1,
  '-webkit-tap-highlight-color': 'transparent',

  '&:focus': {
    outlineColor: '$olive7',
  },

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

const Weekday = styled('span', textStyles, {
  textAlign: 'center',
  color: '$olive11',

  '@tab': { textAlign: 'left' },
})
