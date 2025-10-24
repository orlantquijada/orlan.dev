import { ArrowLeftIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { Daily } from "contentlayer/generated";
import { format } from "date-fns";
import { motion, useIsomorphicLayoutEffect } from "motion/react";
import Link from "next/link";
import { useMDXComponent } from "next-contentlayer2/hooks";
import {
  type ComponentProps,
  type PropsWithChildren,
  type ReactNode,
  useRef,
  useState,
} from "react";
import { css, cva, cx } from "styled-system/css";
import { styled } from "styled-system/jsx";
import { text } from "styled-system/recipes";
import Heart from "@/components/HeartSvg";
import Share from "@/components/ShareSvg";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useIsLiked } from "@/hooks/useIsLiked";
import {
  useIsMinWidthTabDimensions,
  useShowActions,
} from "@/hooks/useShowActions";
import { BASE_URL } from "@/lib/constants";
import { type Month, Months } from "@/lib/contentlayer";
import { like, removeLike } from "@/lib/like";

import { bodyComponents } from "./BodyMDXComponents";
import { CopiedLinkToast } from "./CopiedLinkToast";
import { headerTitleComponents } from "./HeaderTitleMDXComponents";
import LikeWrapper from "./LikeWrapper";
import { Quote, quoteComponents } from "./QuoteMDXComponents";
import { titleComponents } from "./TitleMDXComponents";

// import InstallButton from './InstallButton'

type Props = {
  daily: Daily;
};

export default function DailyDetail({ daily }: Props) {
  const Title = useMDXComponent(daily.title.code);
  const Body = useMDXComponent(daily.body.code);
  const QuoteMDX = useMDXComponent(daily.quote.code);

  const [wrapperRef, shouldShow] = useShowActions();

  const year = new Date().getFullYear();
  const dateFormat = format(
    new Date(
      `${Months.indexOf(daily.month as Month) + 1}/${daily.day}/${year}`
    ),
    "LLLL do"
  );

  const [isLiked, setIsLiked] = useIsLiked(daily);

  const toastRef = useRef<CopiedLinkToast>(null);

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
              <span
                className={cx(text({ size: "base" }), css({ flexShrink: 0 }))}
              >
                {dateFormat}
              </span>
            </HeaderContent>
          </HeaderContentWrapper>
        </header>
        <Main ref={wrapperRef}>
          <div
            className={css({
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              alignSelf: "center",
              mb: "2rem",
            })}
          >
            <span className={text()}>{dateFormat}</span>
            <Title components={titleComponents} />
          </div>
          <Quote>
            <QuoteMDX components={quoteComponents} />
          </Quote>
          <address
            className={cx(
              text(),
              css({
                alignSelf: "flex-end",
                mt: "0.5rem",
                fontStyle: "normal",
              })
            )}
          >
            — {daily.author},{" "}
            <em className={css({ fontStyle: "italic" })}>{daily.book}</em>,{" "}
            {daily.section}
          </address>
          <article
            className={css({
              mt: "2.5rem",
              w: "full",

              "& > p:first-child::first-letter": {
                float: "left",
                lineHeight: "85%",
                width: ".7em",
                fontSize: "325%",
                fontStyle: "initial",

                paddingInlineEnd: "1rem",
              },
            })}
          >
            <Body components={bodyComponents} />
          </article>
        </Main>
        <Footer>
          <Actions shouldShow={shouldShow}>
            <Link
              href={`/${daily.month.toLowerCase()}`}
              legacyBehavior
              passHref
            >
              <motion.a
                aria-label="Go Back"
                className={footerButtonStyles({ size: "small" })}
              >
                <IconMotionWrapper>
                  <ArrowLeftIcon className={footerIconStyles()} />
                </IconMotionWrapper>
              </motion.a>
            </Link>
            <FooterButton
              onClick={() => {
                navigator.clipboard
                  .writeText(
                    `${BASE_URL}/${daily.month.toLowerCase()}/${daily.day}`
                  )
                  .then(() => {
                    toastRef.current?.open();
                  });
              }}
              size="small"
            >
              <IconMotionWrapper>
                <Share className={footerIconStyles()} />
              </IconMotionWrapper>
            </FooterButton>
            <FooterButton
              css={{ mt: "0.25rem" }}
              onClick={() => {
                if (isLiked) {
                  removeLike(daily);
                  setIsLiked(false);
                } else {
                  like(daily);
                  setIsLiked(true);
                }
              }}
              size="small"
            >
              <IconMotionWrapper
                animate={
                  isLiked
                    ? {
                        scale: [0.8, 1.3, 1],
                        rotate: [0, 25, 0],
                        transition: { ease: ["easeOut", "easeIn"] },
                      }
                    : {
                        scale: 1,
                      }
                }
              >
                <Heart
                  className={css(
                    footerIconStyles.raw(),
                    isLiked && {
                      color: "#F8312F",
                    }
                  )}
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
  );
}

const list = {
  visible: {
    height: "100%",
    transition: { staggerChildren: 0.125 },
  },
  hidden: { height: "var(--iconButtonSize)" },
};

function Actions({
  children,
  shouldShow,
}: {
  children: ReactNode;
  shouldShow: boolean;
}) {
  const [isOnTabDimensions, loading] = useIsMinWidthTabDimensions();
  const [open, setOpen] = useState<boolean>();
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => {
    if (isOnTabDimensions) {
      setOpen(false);
    }
  });

  useIsomorphicLayoutEffect(() => {
    if (!loading) {
      setOpen(!isOnTabDimensions);
    }
  }, [loading]);

  if (loading) {
    return null;
  }

  return (
    <StyledActions
      animate={open ? "visible" : "hidden"}
      initial={open ? "visible" : "hidden"}
      ref={ref}
      show={shouldShow}
      variants={list}
    >
      <FooterButton
        css={{ mb: "0.25rem", mt: ".5rem" }}
        onClick={() => {
          if (open) {
            setOpen(false);
          } else {
            setOpen(true);
          }
        }}
        size="small"
      >
        <IconMotionWrapper>
          <DotsHorizontalIcon className={footerIconStyles()} />
        </IconMotionWrapper>
      </FooterButton>

      {children}
    </StyledActions>
  );
}

function IconMotionWrapper({
  children,
  ...props
}: PropsWithChildren<ComponentProps<(typeof motion)["div"]>>) {
  return (
    <motion.div
      className={css({
        scale: 1,
        w: "full",
        h: "full",
        display: "grid",
        placeItems: "center",
      })}
      whileTap={{
        scale: 0.8,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 17,
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

const Wrapper = styled("div", {
  base: {
    "--contentMaxWidth": "650px",
    "--contentPX": "1rem",
    "--headerHeight": "min(15vw, 7rem)",
    "--headerLayer": 10,
    "--iconButtonSize": "4rem",

    md: {
      "--iconButtonSize": "5rem",
    },

    fontFamily: "serif",
    color: "textColor",

    animation: "fadeIn 1s both",
    minHeight: "100vh",
  },
});
const Main = styled("main", {
  base: {
    maxWidth: "var(--contentMaxWidth)",
    mx: "auto",
    pt: "var(--headerHeight)",
    pb: "calc(2.5rem + var(--iconButtonSize))",
    px: "var(--contentPX)",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});

const HeaderCover = styled("div", {
  base: {
    background: "bg",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "var(--headerHeight)",
    zIndex: "calc(var(--headerLayer) + 1)",
  },
});
const HeaderContentWrapper = styled("div", {
  base: {
    zIndex: "var(--headerLayer)",
    borderBottom: "1px solid",
    borderBottomColor: "olive.6",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "bg",
    height: "3rem",
    display: "flex",
    alignItems: "center",
  },
});
const HeaderContent = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",

    maxWidth: "var(--contentMaxWidth)",
    width: "full",
    mx: "auto",
    px: "var(--contentPX)",
  },
});

const Footer = styled("footer", {
  base: {
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    bottom: "1rem",
    left: 0,
    right: 0,

    "--paddingX": "1rem",

    // paddingX * 4 to have a little breathing room between the buttons
    maxWidth:
      "calc(var(--iconButtonSize) * 2 + var(--paddingX) * 4 + var(--contentMaxWidth))",
    mx: "auto",
    px: "var(--paddingX)",

    md: {
      bottom: "2.5rem",
    },
  },
});
const footerButtonStyles = cva({
  base: {
    padding: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    backgroundColor: "transparent",
    borderRadius: "0.25rem",
    transition:
      "background-color 150ms ease, box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    WebkitTapHighlightColor: "transparent",
    flexShrink: 0,
    w: "var(--iconButtonSize)",
    aspectRatio: "square",

    _focusWithin: {
      bgColor: "olive.2",
      outline: "none",
    },
    _hover: {
      bgColor: "olive.2",
      outline: "none",
    },
  },
  variants: {
    size: {
      small: {
        w: "calc(var(--iconButtonSize) - 0.5rem)",
      },
      normal: {
        w: "var(--iconButtonSize)",
      },
    },
  },
  defaultVariants: {
    size: "normal",
  },
});
const FooterButton = styled(motion.button, footerButtonStyles);
const footerIconStyles = cva({
  base: {
    color: "olive.11",
    "--size": "1.25rem",
    w: "var(--size)",
    h: "var(--size)",

    md: {
      "--size": "1.5rem",
    },
  },
});

const TAB_TRANSPARENCY = 0.75;

// FIX: dili in-proper order ang pag tab sa mga buttons
const StyledActions = styled(motion.div, {
  base: {
    opacity: 1,
    width: "var(--iconButtonSize)",
    borderRadius: "0.5rem",
    backgroundColor: "olive.4",
    display: "flex",
    alignItems: "center",
    transition:
      "background-color 150ms ease, opacity 150ms ease, box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)",

    overflow: "hidden",
    justifyContent: "flex-start",
    flexDirection: "column-reverse",

    md: {
      opacity: TAB_TRANSPARENCY,
      backgroundColor: "transparent",
    },

    _hover: {
      backgroundColor: "olive.4",
      opacity: 1,
    },
    _focusWithin: {
      "--ring-offset": "2px",
      "--ring-color": "colors.olive.7",

      outline: "none",
      boxShadow:
        "0 0 0 var(--ring-offset) var(--colors-bg), 0 0 0 calc(var(--ring-offset) + 2px) var(--ring-color)",

      backgroundColor: "olive.4",
      opacity: 1,
    },
  },
  variants: {
    show: {
      true: {
        opacity: 1,
        md: { opacity: TAB_TRANSPARENCY },
      },
      false: { opacity: 0 },
    },
  },
});
