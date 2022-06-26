import { Banner } from 'ui'

export default function WIPBanner() {
  return (
    <Banner.Container>
      <Banner.Tag css={{ mr: '$2' }}>In Progress</Banner.Tag>
      <Banner.Title>
        Hey There! This page is actively being iterated on.
      </Banner.Title>
      <Banner.Close>Close</Banner.Close>
    </Banner.Container>
  )
}
