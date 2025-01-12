import { builtinModules } from 'node:module';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactTweetPreview',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-tweet', ...builtinModules],
      output: {
        globals: {
          react: 'React',
          'react-tweet': 'ReactTweet',
        },
      },
    },
  },
});
