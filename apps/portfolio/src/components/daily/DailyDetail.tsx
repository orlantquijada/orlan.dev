import { useMDXComponent } from 'next-contentlayer/hooks'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ArrowLeftIcon } from '@radix-ui/react-icons'

import { type Daily } from 'contentlayer/generated'
import { Box, css, Flex, styled, Text, textStyles } from 'ui'
import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type MutableRefObject,
} from 'react'
import { Months } from 'src/lib/contentlayer'

interface Props {
  daily: Daily
}

export default function DailyDetail({ daily }: Props) {
  const Title = useMDXComponent(daily.title.code)
  const Body = useMDXComponent(daily.body.code)
  const Quote = useMDXComponent(daily.quote.code)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>()

  const [show, initial, isLoading] = useShowBackButton(ref)

  const today = new Date()
  const currentMonth = Months[today.getMonth()].toLowerCase()

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
        <Flex
          direction="column"
          align="center"
          css={{ alignSelf: 'center', mb: '$8' }}
        >
          <Text>{dateFormat}</Text>
          <Title components={titleComponents} />
        </Flex>
        <Quote components={quoteComponents} />
        <Box css={{ alignSelf: 'flex-end', mt: '$2' }}>
          — {daily.author}, <em>{daily.book}</em>, {daily.section}
        </Box>
        <Box as="article" css={{ mt: '$10' }}>
          <Body components={bodyComponents} />
        </Box>
      </Main>
      <Footer>
        {!isLoading ? (
          <FooterIconButton
            href={`/daily/${currentMonth}`}
            initial={{ opacity: initial }}
            animate={{ opacity: show || initial ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowLeftIcon className={footerIconStyles()} />
          </FooterIconButton>
        ) : null}
      </Footer>
    </Wrapper>
  )
}

function useShowBackButton(contentRef: MutableRefObject<HTMLDivElement>) {
  const [showBackButton, setShowBackButton] = useState(false)
  const [showInitial, setShowInitial] = useState(0)

  // https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85#option-2-lazily-show-component-with-uselayouteffect
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    const htmlClientHeight = document.querySelector('html')?.clientHeight
    const contentClientHeight = contentRef.current.clientHeight

    if (htmlClientHeight)
      setShowInitial(contentClientHeight < htmlClientHeight ? 1 : 0)
  }, [contentRef])

  useEffect(() => {
    const handleScrollToggle = () => {
      const OFFSET = 80
      if (window.scrollY > OFFSET && !showBackButton) setShowBackButton(true)
      else if (window.scrollY < OFFSET && showBackButton)
        setShowBackButton(false)
    }
    window.addEventListener('scroll', handleScrollToggle)

    return () => window.removeEventListener('scroll', handleScrollToggle)
  }, [showBackButton])

  return [showBackButton, showInitial, loading] as const
}

const Wrapper = styled('div', {
  '--contentMaxWidth': '650px',
  '--contentPX': '$sizes$4',
  '--headerHeight': 'min(15vw, $sizes$28)',
  '--headerLayer': 10,
  '--iconButtonSize': '4rem',

  fontFamily: '"EB Garamond", serif',
  color: '$textColor',
})
const Main = styled('main', {
  maxWidth: 'var(--contentMaxWidth)',
  mx: 'auto',
  pt: 'var(--headerHeight)',
  pb: 'calc($sizes$10 + var(--iconButtonSize))',
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
  gap: '$4',

  maxWidth: 'var(--contentMaxWidth)',
  width: '100%',
  mx: 'auto',
  px: 'var(--contentPX)',
})
const HeaderTitleHeading = styled('h1', textStyles, {
  color: '$textColor',
  fontWeight: '$regular',
  fontFamily: '"EB Garamond", serif',
  display: 'block',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})
const headerTitleComponents = {
  // override <p> tags to render as <h1> to avoid adding a necessary <h1> tag in the
  // content files `title` frontmatter since `title`'s type is markdown to enable italics
  p: (props: ComponentProps<typeof TitleHeading>) => (
    <HeaderTitleHeading {...props} size="base" />
  ),
}

const Footer = styled('footer', {
  display: 'flex',
  justifyContent: 'space-between',

  position: 'fixed',
  bottom: '$4',
  left: 0,
  right: 0,

  maxWidth:
    'calc(var(--iconButtonSize) * 2 + var(--contentMaxWidth) + $sizes$6)',
  mx: 'auto',
  px: '$4',

  '@tab': {
    bottom: '$10',
  },
})
const FooterIconButton = styled(motion.a, {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: '$lg',
  size: 'var(--iconButtonSize)',
  backgroundColor: '$olive4',
  transition: 'background-color 150ms ease',
  '-webkit-tap-highlight-color': 'transparent',

  '&:hover': { backgroundColor: '$olive5' },
  '&:active': { backgroundColor: '$olive6' },
})
const footerIconStyles = css({
  color: '$textColor',
  size: '1.25rem',
  fontWeight: '$medium',
})

const TitleHeading = styled('h1', textStyles, {
  textAlign: 'center',
})

const titleComponents = {
  // override <p> tags to render as <h1> to avoid adding a necessary <h1> tag in the
  // content files `title` frontmatter since `title`'s type is markdown to enable italics
  p: (props: ComponentProps<typeof TitleHeading>) => (
    <TitleHeading {...props} size="2xl" />
  ),
}

const QuoteParagraph = styled('q', textStyles, {
  '&::before': {
    content: 'open-quote',
  },
  '&::after': {
    content: 'close-quote',
  },
})

const quoteComponents = {
  p: (props: ComponentProps<typeof QuoteParagraph>) => (
    <QuoteParagraph {...props} size="xl" />
  ),
}

const BodyParagraph = styled('p', textStyles, {
  '&:not(:first-of-type)': {
    textIndent: '2em',
  },

  '&:first-of-type::first-letter': {
    float: 'left',
    lineHeight: '85%',
    width: '.7em',
    fontSize: '325%',
  },
})

const bodyComponents = {
  p: (props: ComponentProps<typeof BodyParagraph>) => (
    <BodyParagraph {...props} size="xl" />
  ),
}
