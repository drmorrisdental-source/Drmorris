import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.drmorris.co.il',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
