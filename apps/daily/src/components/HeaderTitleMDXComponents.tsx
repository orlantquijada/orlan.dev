import type { ComponentProps } from "react";
import { styled } from "styled-system/jsx";
import { text } from "styled-system/recipes";

import type { MDXComponents } from "@/lib/contentlayer";

const HeaderTitleHeading = styled("h1", {
  base: {
    color: "textColor",
    fontWeight: "regular",
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});
export const headerTitleComponents = {
  // override <p> tags to render as <h1> to avoid adding a necessary <h1> tag in the
  // content files `title` frontmatter since `title`'s type is markdown to enable italics
  p: (props: ComponentProps<typeof HeaderTitleHeading>) => (
    <HeaderTitleHeading {...props} className={text({ size: "base" })} />
  ),
} as MDXComponents;
