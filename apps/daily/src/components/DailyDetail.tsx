import { useEffect, useRef, useState, type MutableRefObject } from 'react'
import Link from 'next/link'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { format } from 'date-fns'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { type Daily } from 'contentlayer/generated'

import { headerTitleComponents } from './HeaderTitleMDXComponents'
import { titleComponents } from './TitleMDXComponents'
import { quoteComponents } from './QuoteMDXComponents'
import { bodyComponents } from './BodyMDXComponents'
import { Text } from '@/components/Text'
import { css, fadeIn, styled } from '@stitches.config'

interface Props {
  daily: Daily
}
const HIDDEN_OPACITY = 0

export default function DailyDetail({ daily }: Props) {
  const Title = useMDXComponent(daily.title.code)
  const Body = useMDXComponent(daily.body.code)
  const Quote = useMDXComponent(daily.quote.code)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>()
  const [show, initialOpacity, isLoading] = useShowBackButton(ref)

  const dateFormat = format(new Date(`${daily.month} ${daily.day}`), 'LLLL do')

  return (
    <Wrapper ref={ref}>
      <header>
        <HeaderCover />
        <HeaderContentWrapper>
          <HeaderContent>
            <Title components={headerTitleComponents} />
            <Text css={{ flexShrink: 0 }}>{dateFormat}</Text>
          </HeaderContent>
        </HeaderContentWrapper>
      </header>
      <Main>
        <Box
          css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            alignSelf: 'center',
            mb: '2rem',
          }}
        >
          <Text>{dateFormat}</Text>
          <Title components={titleComponents} />
        </Box>
        <Quote components={quoteComponents} />
        <Text
          as="address"
          css={{ alignSelf: 'flex-end', mt: '0.5rem', fontStyle: 'normal' }}
        >
          — {daily.author}, <em>{daily.book}</em>, {daily.section}
        </Text>
        <Box as="article" css={{ mt: '2.5rem', w: '100%' }}>
          <Body components={bodyComponents} />
        </Box>
      </Main>
      <Footer>
        {!isLoading ? (
          <Link href={`/${daily.month.toLowerCase()}`} passHref>
            <FooterIconButton show={show || initialOpacity === 1}>
              <ArrowLeftIcon className={footerIconStyles()} />
            </FooterIconButton>
          </Link>
        ) : null}
      </Footer>
    </Wrapper>
  )
}

function useShowBackButton(contentRef: MutableRefObject<HTMLDivElement>) {
  const [showBackButton, setShowBackButton] = useState(false)
  const [initialOpacity, setInitialOpacity] = useState(HIDDEN_OPACITY)

  // https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85#option-2-lazily-show-component-with-uselayouteffect
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    const htmlElement = document.querySelector('html')
    const contentClientHeight = contentRef.current.clientHeight
    const TAB_WIDTH = 768

    if (htmlElement)
      setInitialOpacity(
        htmlElement.clientWidth > TAB_WIDTH ||
          contentClientHeight < htmlElement.clientHeight
          ? 1
          : HIDDEN_OPACITY
      )
  }, [contentRef])

  useEffect(() => {
    const handleScrollToggle = () => {
      const OFFSET = 65
      if (window.scrollY > OFFSET && !showBackButton) setShowBackButton(true)
      else if (window.scrollY < OFFSET && showBackButton)
        setShowBackButton(false)
    }
    window.addEventListener('scroll', handleScrollToggle)

    return () => window.removeEventListener('scroll', handleScrollToggle)
  }, [showBackButton])

  return [showBackButton, initialOpacity, loading] as const
}

const Wrapper = styled('div', {
  '--contentMaxWidth': '650px',
  '--contentPX': '1rem',
  '--headerHeight': 'min(15vw, 7rem)',
  '--headerLayer': 10,
  '--iconButtonSize': '4rem',

  fontFamily: '"EB Garamond", serif',
  color: '$textColor',

  animation: `${fadeIn} 0.6s both`,
})
const Main = styled('main', {
  maxWidth: 'var(--contentMaxWidth)',
  mx: 'auto',
  pt: 'var(--headerHeight)',
  pb: 'calc(2.5rem + var(--iconButtonSize))',
  px: 'var(--contentPX)',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const HeaderCover = styled('div', {
  background: '$bg',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 'var(--headerHeight)',
  zIndex: 'calc(var(--headerLayer) + 1)',
})
const HeaderContentWrapper = styled('div', {
  zIndex: 'var(--headerLayer)',
  borderBottom: '1px solid $olive6',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: '$bg',
  height: '3rem',
  display: 'flex',
  alignItems: 'center',
})
const HeaderContent = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1rem',

  maxWidth: 'var(--contentMaxWidth)',
  width: '100%',
  mx: 'auto',
  px: 'var(--contentPX)',
})

const Footer = styled('footer', {
  display: 'flex',
  justifyContent: 'space-between',

  position: 'fixed',
  bottom: '1rem',
  left: 0,
  right: 0,

  $$paddingX: '1rem',

  maxWidth:
    'calc(var(--iconButtonSize) * 2 + $$paddingX * 2 + var(--contentMaxWidth))',
  mx: 'auto',
  px: '$$paddingX',

  '@tab': {
    bottom: '2.5rem',
  },
})
const FooterIconButton = styled('a', {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: '0.5rem',
  size: 'var(--iconButtonSize)',
  backgroundColor: '$olive4',
  transition:
    'background-color 150ms ease, box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  '-webkit-tap-highlight-color': 'transparent',

  '&:hover': { backgroundColor: '$olive5' },
  '&:active': { backgroundColor: '$olive6' },
  '&:focus': {
    '$$ring-offset': '2px',
    outline: 'none',
    boxShadow:
      '0 0 0 $$ring-offset $colors$bg, 0 0 0 calc($$ring-offset + 2px) $colors$olive7',
  },
  '&:hover, &:focus': { opacity: '1 !important' },

  variants: {
    show: {
      true: { opacity: 1 },
      false: { opacity: HIDDEN_OPACITY },
    },
  },
})
const footerIconStyles = css({
  color: '$textColor',
  size: '1.25rem',
})

const Box = styled('div', {})
