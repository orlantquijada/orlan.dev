import { format } from 'date-fns'
import { useRouter } from 'next/router'

import { getNextMonth, getPreviousMonth } from '@/lib/api'
import { Month, MonthSubjectsMap } from '@/lib/contentlayer'
import { Text } from '@/components/Text'
import * as Calendar from '@/components/Calendar'

export default function DailyCalendar({ month }: { month: Month }) {
  const router = useRouter()

  const handleRoute = (direction: 'next' | 'prev') => {
    const toMonth =
      direction === 'next' ? getNextMonth(month) : getPreviousMonth(month)

    // shallow is required bec data fetching will be handled client-side but
    // calendar month state will be handled with the URL
    router.push(`/${toMonth.toLowerCase()}`, undefined, { shallow: true })
  }

  return (
    // root
    <div>
      <Calendar.Root>
        <header>
          {/* title */}
          <h1>{month}</h1>

          <h2>{MonthSubjectsMap[month]}</h2>

          <div>
            <Calendar.PreviousMonthButton onClick={() => handleRoute('prev')}>
              left
            </Calendar.PreviousMonthButton>
            <Calendar.PreviousMonthButton onClick={() => handleRoute('next')}>
              right
            </Calendar.PreviousMonthButton>
          </div>
        </header>

        {/* calendar body */}
        <div>
          {/* weekdays container */}
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}
          >
            <Text>Sun</Text>
            <Text>Mon</Text>
            <Text>Tue</Text>
            <Text>Wed</Text>
            <Text>Thu</Text>
            <Text>Fri</Text>
            <Text>Sat</Text>
          </div>

          <Calendar.Days>
            {(days) => (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                }}
              >
                {days.map((day, index) => (
                  <button
                    key={day.toString()}
                    style={
                      index === 0
                        ? { gridColumnStart: day.getDay() + 1 }
                        : undefined
                    }
                  >
                    {format(day, 'MMM d, y')}
                  </button>
                ))}
              </div>
            )}
          </Calendar.Days>
        </div>
      </Calendar.Root>
    </div>
  )
}
