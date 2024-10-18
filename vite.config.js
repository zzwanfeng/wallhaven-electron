import vue from '@vitejs/plugin-vue'
import path from 'path'
import commonjs from '@rollup/plugin-commonjs';

import { defineConfig } from 'vite'


// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  plugins: [
    vue(),
    commonjs()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, "./node_modules"),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: `@use "@/style/element.scss" as *;`,
      },
    },
  },
})
