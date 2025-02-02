import { defineConfig } from 'astro/config'
import compress from 'astro-compress'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import svgr from 'vite-plugin-svgr'
import mdx from '@astrojs/mdx'
import icon from 'astro-icon'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), mdx(), icon(), compress()],
  scopedStyleStrategy: 'where',
  markdown: {
    shikiConfig: {
      theme: 'min-dark',
    },
  },
  vite: {
    plugins: [svgr()],
    ssr: {
      noExternal: ['@radix-ui/*'],
    },
  },
})
