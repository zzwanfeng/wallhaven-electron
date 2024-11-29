import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path";
import commonjs from '@rollup/plugin-commonjs';


// https://vitejs.dev/config/
export default () => defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  plugins: [
    vue(),
    commonjs(),
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
  define: {
    "APP_VERSION": JSON.stringify(process.env.npm_package_version),
  },
  build: {
    outDir: path.join(__dirname, 'dist/'),
    assetsDir: '', // 相对路径 加载问题
  },
  optimizeDeps: {
    // exclude: ['electron'], // 告诉 Vite 不要转换 electron 模块
  },
})
