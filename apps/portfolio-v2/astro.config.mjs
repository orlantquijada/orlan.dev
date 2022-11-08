import { defineConfig } from 'astro/config'

import compress from 'astro-compress'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), compress()],
})
