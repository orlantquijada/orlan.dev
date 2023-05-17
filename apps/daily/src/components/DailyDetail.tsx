import { useEffect, useRef, useState, type MutableRefObject } from 'react'
// import Link from 'next/link'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { ArrowLeftIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'

import { type Daily } from 'contentlayer/generated'
import { css, fadeIn, styled } from '@stitches.config'
import { Month, Months } from '@/lib/contentlayer'
import { getIsLiked, like, removeLike } from '@/lib/like'

import { Text } from '@/components/Text'
import Heart from '@/components/HeartSvg'
import Share from '@/components/ShareSvg'

import { headerTitleComponents } from './HeaderTitleMDXComponents'
import { titleComponents } from './TitleMDXComponents'
import { Quote, quoteComponents } from './QuoteMDXComponents'
import { bodyComponents } from './BodyMDXComponents'
import LikeWrapper from './LikeWrapper'

interface Props {
  daily: Daily
}
const HIDDEN_OPACITY = 0

export default function DailyDetail({ daily }: Props) {
  const Title = useMDXComponent(daily.title.code)
  const Body = useMDXComponent(daily.body.code)
  const QuoteMDX = useMDXComponent(daily.quote.code)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrapperRef = useRef<any>()
  // const [show, initialOpacity, isLoading] = useShowBackButton(wrapperRef)
  const [, , isLoading] = useShowBackButton(wrapperRef)

  const year = new Date().getFullYear()
  const dateFormat = format(
    new Date(
      `${Months.indexOf(daily.month as Month) + 1}/${daily.day}/${year}`
    ),
    'LLLL do'
  )

  const [isLiked, setIsLiked] = useState(() => {
    if (typeof localStorage === 'object') {
      return getIsLiked(daily)
    }
  })

  return (
    <LikeWrapper
      day={daily.day}
      month={daily.month}
      onLike={() => setIsLiked(true)}
    >
      <Wrapper>
        <header>
          <HeaderCover />
          <HeaderContentWrapper>
            <HeaderContent>
              <Title components={headerTitleComponents} />
              <Box css={{ display: 'flex', alignItems: 'center' }}>
                <Text css={{ flexShrink: 0 }}>{dateFormat}</Text>
                <Box css={{ display: 'flex' }}>
                  <Heart />
                </Box>
              </Box>
            </HeaderContent>
          </HeaderContentWrapper>
        </header>
        <Main ref={wrapperRef}>
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
          <Quote>
            <QuoteMDX components={quoteComponents} />
          </Quote>
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
            <>
              <Actions>
                <FooterButton
                  css={{ mt: '0.25rem' }}
                  size="small"
                  onClick={() => {
                    if (isLiked) {
                      removeLike(daily)
                      setIsLiked(false)
                    } else {
                      like(daily)
                      setIsLiked(true)
                    }
                  }}
                >
                  <motion.div
                    initial={false}
                    animate={
                      isLiked
                        ? {
                            scale: [0.8, 1.3, 1],
                            transition: { duration: 0.5 },
                          }
                        : {}
                    }
                    whileTap={{
                      scale: 0.8,
                      transition: {
                        type: 'spring',
                        stiffness: 400,
                        damping: 17,
                      },
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Heart
                      className={footerIconStyles({
                        css: isLiked ? { color: '#F8312F' } : undefined,
                      })}
                    />
                  </motion.div>
                </FooterButton>
                <FooterButton size="small">
                  <Share className={footerIconStyles()} />
                </FooterButton>
                <FooterButton css={{ mb: '0.25rem' }} size="small">
                  <ArrowLeftIcon className={footerIconStyles()} />
                </FooterButton>
                <FooterButton css={{ size: 'var(--iconButtonSize)' }}>
                  <DotsHorizontalIcon className={footerIconStyles()} />
                </FooterButton>
              </Actions>
              {/* <Link href={`/${daily.month.toLowerCase()}`} passHref> */}
              {/*   <FooterIconButton */}
              {/*     show={show || initialOpacity === 1} */}
              {/*     aria-label="Go Back" */}
              {/*   > */}
              {/*     <ArrowLeftIcon className={footerIconStyles()} /> */}
              {/*   </FooterIconButton> */}
              {/* </Link> */}
            </>
          ) : null}
        </Footer>
      </Wrapper>
    </LikeWrapper>
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

  '@tab': {
    '--iconButtonSize': '5rem',
  },

  fontFamily: '"EB Garamond", serif',
  color: '$textColor',

  animation: `${fadeIn} 1s both`,
  minHeight: '100vh',
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
  flexDirection: 'column',
  position: 'fixed',
  bottom: '1rem',
  left: 0,
  right: 0,

  $$paddingX: '1rem',

  // paddingX * 4 to have a little breathing room between the buttons
  maxWidth:
    'calc(var(--iconButtonSize) * 2 + $$paddingX * 4 + var(--contentMaxWidth))',
  mx: 'auto',
  px: '$$paddingX',

  '@tab': {
    bottom: '2.5rem',
  },
})
const FooterButton = styled('button', {
  padding: 0,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  backgroundColor: 'transparent',
  borderRadius: '0.25rem',
  transition:
    'background-color 150ms ease, box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  '-webkit-tap-highlight-color': 'transparent',

  // '&:hover': { backgroundColor: '$olive5' },
  // '&:active': { backgroundColor: '$olive6' },
  // '&:focus': {
  //   '$$ring-offset': '2px',
  //   outline: 'none',
  //   boxShadow:
  //     '0 0 0 $$ring-offset $colors$bg, 0 0 0 calc($$ring-offset + 2px) $colors$olive7',
  // },
  // '&:hover, &:focus': { opacity: '1 !important' },

  variants: {
    show: {
      true: { opacity: 1 },
      false: { opacity: HIDDEN_OPACITY },
    },
    size: {
      small: {
        size: 'calc(var(--iconButtonSize) - 0.5rem)',
      },
      normal: {
        size: 'var(--iconButtonSize)',
      },
    },
  },
  defaultVariants: {
    size: 'normal',
  },
})
const footerIconStyles = css({
  // color: '$textColor',
  color: '$olive11',
  size: '1.25rem',
  transition: 'color 150ms ease',

  '@tab': {
    size: '1.5rem',
  },
})
const Actions = styled('div', {
  opacity: 0.75,
  width: 'var(--iconButtonSize)',
  borderRadius: '0.5rem',
  backgroundColor: 'transparent',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'background-color 150ms ease, opacity 150ms ease',

  '&:hover': {
    backgroundColor: '$olive4',
    opacity: 1,

    [`& ${FooterButton}:hover`]: {
      backgroundColor: '$olive2',
    },
  },
})

const Box = styled('div', {})
// const FooterIconButton = styled('a', {
//   cursor: 'pointer',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   border: 'none',
//   borderRadius: '0.5rem',
//   size: 'var(--iconButtonSize)',
//   backgroundColor: '$olive4',
//   transition:
//     'background-color 150ms ease, box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
//   '-webkit-tap-highlight-color': 'transparent',

//   '&:hover': { backgroundColor: '$olive5' },
//   '&:active': { backgroundColor: '$olive6' },
//   '&:focus': {
//     '$$ring-offset': '2px',
//     outline: 'none',
//     boxShadow:
//       '0 0 0 $$ring-offset $colors$bg, 0 0 0 calc($$ring-offset + 2px) $colors$olive7',
//   },
//   '&:hover, &:focus': { opacity: '1 !important' },

//   variants: {
//     show: {
//       true: { opacity: 1 },
//       false: { opacity: HIDDEN_OPACITY },
//     },
//   },
// })
