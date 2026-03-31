import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'ggul-musae',
  brand: {
    displayName: '껄무새',
    primaryColor: '#3182F6',
    icon: 'http://localhost:5173/kkeolmuse_icon.png',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
});
