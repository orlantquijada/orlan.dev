import { Button, styled } from 'ui'

const H1 = styled('h1', { color: '$primary' })

export default function Web() {
  return (
    <div>
      <H1>Hello World!</H1>
      <Button />
    </div>
  )
}
