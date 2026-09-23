import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  /* config options here */
  reactCompiler: true,
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,

  options: {
    remarkPlugins: [
      "remark-smartypants",
      "remark-frontmatter",
      "remark-mdx-frontmatter",
    ],
  },
});

export default withMDX(nextConfig);
