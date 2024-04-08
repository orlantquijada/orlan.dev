import { type ComponentProps } from 'react'

export default function CheckSvg(props: ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 8 6"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M1 3.66667L2.5 5L7 1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
      ></path>
    </svg>
  )
}
