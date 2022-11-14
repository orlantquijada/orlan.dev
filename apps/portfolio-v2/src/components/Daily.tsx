import { useEffect, useState } from 'react'

function fetchDaily() {
  return fetch('https://daily.orlan.dev/api/daily').then((res) =>
    res.ok ? res.json() : { title: '' }
  )
}

export default function Daily() {
  const [loading, setLoading] = useState(true)
  const [daily, setDaily] = useState<{ title: string }>({ title: '' })

  useEffect(() => {
    fetchDaily().then((daily) => {
      setDaily(daily)
      setLoading(false)
    })
  }, [])

  return <div>{loading ? 'Loading...' : daily.title}</div>
}
