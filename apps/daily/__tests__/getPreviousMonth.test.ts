import { getPreviousMonth } from '@/lib/api'
import { describe, expect, test } from 'vitest'

describe.concurrent('should get previous month', () => {
  test('default', () => {
    expect(getPreviousMonth('October')).toBe('September')
  })

  test('front boundary', () => {
    expect(getPreviousMonth('January')).toBe('December')
  })
})
