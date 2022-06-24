import { type ComponentProps } from 'react'
import { Text, Box, Banner } from 'ui'

export default function Home() {
  return (
    <Box
      css={{
        minHeight: '100vh',
        pt: '$16',
        backgroundColor: '$bg',
        '& > *': { px: '$4' },
      }}
    >
      <Box as="header" css={{ maxWidth: 780, '@tab': { mx: 'auto' } }}>
        <Banner.Container css={{ mb: '$5' }}>
          <Banner.Close>Close</Banner.Close>
        </Banner.Container>
        <HeaderText>
          <Text css={{ display: 'block', color: '$accent' }}>
            Orlan Quijada
          </Text>
          Full Stack <Text css={{ display: 'block' }}>Developer &</Text>
          Freelancer
        </HeaderText>
      </Box>
      <Box as="main"></Box>
    </Box>
  )
}

function HeaderText({ children }: ComponentProps<'h1'>) {
  return (
    <Text
      as="h1"
      size={{ '@initial': '5xl', '@tab': '7xl' }}
      css={{
        color: '$olive12',
        fontFamily: '$serif',
      }}
    >
      {children}
    </Text>
  )
}
