import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://whatsappjobs.com.au',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/balloons-js')) return 'balloons';
          },
        },
      },
    },
  },
});
