import type { ComponentProps, ReactNode } from "react";
import { css } from "styled-system/css";
import { styled } from "styled-system/jsx";
import { text } from "styled-system/recipes";

import type { MDXComponents } from "@/lib/contentlayer";

const Q = styled("q", {
  base: {
    alignSelf: "stretch",

    "& > :first-child::before": {
      content: "open-quote",
    },
    "& > :last-child:not(ol)::after": {
      content: "close-quote",
    },
    "& > :last-child:where(ol)": {
      "& li:last-of-type::after": {
        content: "close-quote",
      },
    },

    _before: {
      content: "''",
    },
    _after: {
      content: "''",
    },
  },
});

const COUNTER_NAME = "list-counter";
const Ol = styled("ol", {
  base: {
    pl: "1.5rem",
    counterReset: COUNTER_NAME,
  },
});
const Li = styled("li", {
  base: {
    pl: "0.5rem",
    counterIncrement: COUNTER_NAME,

    "&::marker": {
      content: `counter(${COUNTER_NAME}) ")"`,
    },
  },
});

export const quoteComponents = {
  p: (props: ComponentProps<"p">) => (
    <p {...props} className={text({ size: "xl" })} />
  ),
  ol: (props: ComponentProps<typeof Ol>) => <Ol {...props} />,
  li: (props: ComponentProps<typeof Li>) => (
    <Li {...props} className={text({ size: "xl" })} />
  ),
  em: (props: ComponentProps<"em">) => (
    <em {...props} className={css({ fontStyle: "italic" })} />
  ),
} as MDXComponents;

export function Quote({ children }: { children: ReactNode }) {
  return <Q>{children}</Q>;
}
