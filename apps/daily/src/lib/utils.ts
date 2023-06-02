import { BASE_URL } from './constants'

export type FilterFalseProps<K extends Record<string, boolean | undefined>> =
  NonNullable<
    {
      [Key in keyof K]: K[Key] extends true ? Key : never
    }[keyof K]
  >

export type KeysFlag<T extends Record<string, unknown>> = Partial<
  Record<keyof T, boolean>
>

export function pickProps<
  Obj extends Record<string, unknown>,
  Flags extends KeysFlag<Obj>,
  PickedProps = FilterFalseProps<Flags> extends keyof Obj
    ? Pick<Obj, FilterFalseProps<Flags>>
    : never
>(
  obj: Obj,
  keysFlag: Flags
): Flags extends Record<string, never | false> ? Obj : PickedProps {
  const keysList = Object.entries(keysFlag)
    .filter(([, value]) => value)
    .map(([key]) => key) as Array<keyof Obj>

  const propsObj: { [Key in keyof Obj]?: Obj[Key] } = {}
  for (const key of keysList) propsObj[key] = obj[key]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return propsObj as any
}

export function capitalize<T extends string>(str: T) {
  return `${str[0].toUpperCase()}${str.slice(1)}` as Capitalize<T>
}

export function getDetailSocialMediaImage(params: {
  title: string
  subtitle: string
  author: string
}) {
  const URLParams = new URLSearchParams(params)

  return `${BASE_URL}/api/og?${URLParams}`
}

export type NonEmptyArray<T> = [T, ...T[]]
