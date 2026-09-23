import { defineConfig, defineGlobalStyles } from "@pandacss/dev";
import pandaPreset from "@pandacss/preset-panda";
import { preset } from "styled";

const globalCss = defineGlobalStyles({
  "::selection": {
    backgroundColor: "colors.olive.5",
  },

  "*": {
    margin: 0,
  },
  "*, *::before, *::after": {
    boxSizing: "border-box",
  },

  a: {
    textDecoration: "none",
  },

  body: {
    "-webkit-font-smoothing": "antialiased",
    backgroundColor: "bg",
    lineHeight: 1.5,
  },

  button: {
    userSelect: "none",
  },

  "html, body": {
    color: "textColor",
    fontFamily: "sans-serif",
  },

  "html, body, #__next": {
    height: "100%",
  },

  "img, picture, video, canvas, svg": {
    display: "block",
    maxWidth: "100%",
  },

  "input, button, textarea, select": {
    font: "inherit",
  },

  "p, h1, h2, h3, h4, h5, h6": {
    overflowWrap: "break-word",
  },
});

export default defineConfig({
  // Files to exclude
  exclude: [],
  globalCss,

  importMap: "styled",

  // Where to look for your css declarations
  include: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "../../packages/ui/components/**/*.{ts,tsx}",
    "../../packages/ui/styled/**/*.{ts,tsx}",
  ],

  // The output directory for your css system
  outdir: "styled-system",
  // Whether to use css reset
  preflight: true,

  presets: [pandaPreset, preset],

  // Useful for theme customization
  theme: {
    extend: {},
  },
});
