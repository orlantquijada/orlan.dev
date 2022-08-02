import { getNextMonth, getPreviousMonth } from '@/lib/api'
import { Month, MonthSubjectsMap } from '@/lib/contentlayer'
import { useRouter } from 'next/router'
import { Text } from './Text'

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
      <header>
        {/* title */}
        <h1>{month}</h1>

        <h2>{MonthSubjectsMap[month]}</h2>

        <div>
          <button onClick={() => handleRoute('prev')}>left</button>
          <button onClick={() => handleRoute('next')}>right</button>
        </div>
      </header>

      {/* calendar body */}
      <div>
        {/* weekdays container */}
        <div>
          <Text>Sun</Text>
          <Text>Mon</Text>
          <Text>Tue</Text>
          <Text>Wed</Text>
          <Text>Thu</Text>
          <Text>Fri</Text>
          <Text>Sat</Text>
        </div>

        {/* days table */}
        <div>
          <button>1</button>
        </div>
      </div>
    </div>
  )
}
