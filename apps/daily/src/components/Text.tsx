import { defineRecipe } from "@pandacss/dev";

export const textRecipe = defineRecipe({
  className: "text",
  variants: {
    size: {
      base: {
        fontSize: "base",
        lineHeight: "1.5rem",
      },
      lg: {
        fontSize: "lg",
        lineHeight: "1.75rem",
      },
      xl: {
        fontSize: "xl",
        lineHeight: "1.75rem",
      },
      "2xl": {
        fontSize: "2xl",
        lineHeight: "2rem",
      },
    },
  },
});
