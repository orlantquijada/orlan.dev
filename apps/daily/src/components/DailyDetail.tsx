import {
  ComponentProps,
  PropsWithChildren,
  ReactNode,
  useRef,
  useState,
} from 'react'
import Link from 'next/link'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { motion, useIsomorphicLayoutEffect } from 'framer-motion'
import { format } from 'date-fns'
import { ArrowLeftIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'

import { type Daily } from 'contentlayer/generated'
import { css, fadeIn, styled } from '@stitches.config'
import { Month, Months } from '@/lib/contentlayer'
import { like, removeLike } from '@/lib/like'
import {
  useIsMinWidthTabDimensions,
  useShowActions,
} from '@/hooks/useShowActions'
import { useIsLiked } from '@/hooks/useIsLiked'
import { useClickOutside } from '@/hooks/useClickOutside'
import { BASE_URL } from '@/lib/constants'

import { Text } from '@/components/Text'
import Heart from '@/components/HeartSvg'
import Share from '@/components/ShareSvg'

import { headerTitleComponents } from './HeaderTitleMDXComponents'
import { titleComponents } from './TitleMDXComponents'
import { Quote, quoteComponents } from './QuoteMDXComponents'
import { bodyComponents } from './BodyMDXComponents'
import LikeWrapper from './LikeWrapper'
import { CopiedLinkToast } from './CopiedLinkToast'
// import InstallButton from './InstallButton'

interface Props {
  daily: Daily
}

export default function DailyDetail({ daily }: Props) {
  const Title = useMDXComponent(daily.title.code)
  const Body = useMDXComponent(daily.body.code)
  const QuoteMDX = useMDXComponent(daily.quote.code)

  const [wrapperRef, shouldShow] = useShowActions()

  const year = new Date().getFullYear()
  const dateFormat = format(
    new Date(
      `${Months.indexOf(daily.month as Month) + 1}/${daily.day}/${year}`,
    ),
    'LLLL do',
  )

  const [isLiked, setIsLiked] = useIsLiked(daily)

  const toastRef = useRef<CopiedLinkToast>(null)

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
              <Text css={{ flexShrink: 0 }}>{dateFormat}</Text>
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
          <Actions shouldShow={shouldShow}>
            <Link href={`/${daily.month.toLowerCase()}`} passHref>
              <FooterButton as={motion.a} size="small" aria-label="Go Back">
                <IconMotionWrapper>
                  <ArrowLeftIcon className={footerIconStyles()} />
                </IconMotionWrapper>
              </FooterButton>
            </Link>
            <FooterButton
              size="small"
              onClick={() => {
                navigator.clipboard
                  .writeText(
                    `${BASE_URL}/${daily.month.toLowerCase()}/${daily.day}`,
                  )
                  .then(() => {
                    toastRef.current?.open()
                  })
              }}
            >
              <IconMotionWrapper>
                <Share className={footerIconStyles()} />
              </IconMotionWrapper>
            </FooterButton>
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
              <IconMotionWrapper
                animate={
                  isLiked
                    ? {
                        scale: [0.8, 1.3, 1],
                        transition: {
                          duration: 0.5,
                          type: 'spring',
                          stiffness: 400,
                          damping: 17,
                        },
                      }
                    : {}
                }
              >
                <Heart
                  className={footerIconStyles({
                    css: isLiked ? { color: '#F8312F' } : {},
                  })}
                />
              </IconMotionWrapper>
            </FooterButton>
          </Actions>
        </Footer>

        <CopiedLinkToast ref={toastRef} />
        {/* <InstallButton */}
        {/*   css={{ */}
        {/*     height: 'var(--iconButtonSize)', */}
        {/*     position: 'absolute', */}
        {/*     bottom: '1rem', */}
        {/*     right: '1rem', */}

        {/*     '@tab': { */}
        {/*       bottom: '2.5rem', */}
        {/*       right: '2.5rem', */}
        {/*     }, */}
        {/*   }} */}
        {/* /> */}
      </Wrapper>
    </LikeWrapper>
  )
}

const list = {
  visible: {
    height: '100%',
    transition: { staggerChildren: 0.125 },
  },
  hidden: { height: 'var(--iconButtonSize)' },
}

function Actions({
  children,
  shouldShow,
}: {
  children: ReactNode
  shouldShow: boolean
}) {
  const [isOnTabDimensions, loading] = useIsMinWidthTabDimensions()
  const [open, setOpen] = useState<boolean>()
  const ref = useRef<HTMLDivElement>(null)

  useClickOutside(ref, () => {
    if (isOnTabDimensions) setOpen(false)
  })

  useIsomorphicLayoutEffect(() => {
    if (!loading) setOpen(!isOnTabDimensions)
  }, [loading])

  if (loading) return null

  return (
    <StyledActions
      initial={open ? 'visible' : 'hidden'}
      animate={open ? 'visible' : 'hidden'}
      variants={list}
      show={shouldShow}
      ref={ref}
    >
      <FooterButton
        css={{ mb: '0.25rem', mt: '.5rem' }}
        size="small"
        onClick={() => {
          if (open) setOpen(false)
          else setOpen(true)
        }}
      >
        <IconMotionWrapper>
          <DotsHorizontalIcon className={footerIconStyles()} />
        </IconMotionWrapper>
      </FooterButton>

      {children}
    </StyledActions>
  )
}

function IconMotionWrapper({
  children,
  ...props
}: PropsWithChildren<ComponentProps<(typeof motion)['div']>>) {
  return (
    <motion.div
      whileTap={{
        scale: 0.8,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 17,
        },
      }}
      style={{
        scale: 1,
        width: '100%',
        height: '100%',
        display: 'grid',
        placeItems: 'center',
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
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
const FooterButton = styled(motion.button, {
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
  flexShrink: 0,

  '&:hover, &:focus': {
    backgroundColor: '$olive2',
    outline: 'none',
  },

  variants: {
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

  '@tab': {
    size: '1.5rem',
  },
})

const TAB_TRANSPARENCY = 0.75

// FIX: dili in-proper order ang pag tab sa mga buttons
const StyledActions = styled(motion.div, {
  opacity: 1,
  width: 'var(--iconButtonSize)',
  borderRadius: '0.5rem',
  backgroundColor: '$olive4',
  display: 'flex',
  alignItems: 'center',
  transition:
    'background-color 150ms ease, opacity 150ms ease, box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',

  overflow: 'hidden',
  justifyContent: 'flex-start',
  flexDirection: 'column-reverse',

  '@tab': {
    opacity: TAB_TRANSPARENCY,
    backgroundColor: 'transparent',
  },

  '&:focus-within': {
    '$$ring-offset': '2px',
    outline: 'none',
    boxShadow:
      '0 0 0 $$ring-offset $colors$bg, 0 0 0 calc($$ring-offset + 2px) $colors$olive7',
  },

  '&:hover, &:focus-within': {
    backgroundColor: '$olive4',
    opacity: 1,
  },

  variants: {
    show: {
      true: {
        opacity: 1,
        '@tab': { opacity: TAB_TRANSPARENCY },
      },
      false: { opacity: 0 },
    },
  },
})

const Box = styled('div', {})
