import type { MDXComponents } from "next-mdx-remote-client";
export const quoteComponents = {
  p: (props) => <p {...props} className="text-xl" />,
  ol: (props) => (
    <ol {...props} className="pl-6 [counter-reset:list-counter]" />
  ),
  li: (props) => (
    <li
      {...props}
      className="pl-2 text-xl [counter-increment:list-counter] marker:[content:counter(list-counter)_')']"
    />
  ),
} satisfies MDXComponents;

export const bodyComponents = {
  p: (props) => <p {...props} className="not-first:indent-[2em] text-xl" />,
  blockquote: (props) => (
    <blockquote
      {...props}
      className="relative my-8 mr-4 ml-6 before:absolute before:top-[0.1ch] before:left-[-0.9ch] before:content-[open-quote] [&>p:last-child::after]:content-[close-quote]"
    />
  ),
  span: (props) => <span {...props} className="text-xl" />,
  Text: (props) => <span {...props} className="text-xl" />,
  ul: (props) => <ul {...props} className="my-6 px-10 [all:revert]" />,
  ol: (props) => <ol {...props} className="my-0 [all:revert]" />,
  li: (props) => <li {...props} className="text-xl" />,
} satisfies MDXComponents;
