type Props = {
  open?: boolean
}

export default function MenuIcon({ open }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-[1em] h-[1em] stroke-gray10 ${open ? 'translate-y-1' : ''}`}
    >
      <path d="M1 8H23" strokeWidth="2" strokeLinecap="round"></path>
      <path d="M1 16H23" strokeWidth="2" strokeLinecap="round"></path>
    </svg>
  )
}
