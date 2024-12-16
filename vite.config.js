import vue from '@vitejs/plugin-vue'
import path from 'path'
import commonjs from '@rollup/plugin-commonjs';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';


import { resolve } from 'path';
import { defineConfig } from 'vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import'


// 如果编辑器提示 path 模块找不到，则可以安装一下 @types/node -> npm i @types/node -D
function pathResolve (dir) {
  return resolve(__dirname, dir);
}



// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // '/api': {
      //   target: 'https://wallhaven.cc/api/v1/',
      //   changeOrigin: true,
      //   ws: true,
      // },
      // '/api1': {
      //   target: 'https://wallhaven.cc/api/v1/',
      //   changeOrigin: true,
      //   ws: true,
      // },
    },
  },
  plugins: [
    vue({
      script: {
        defineModel: true,
      },
    }),
    commonjs(),
    AutoImport({
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue', 'vue-router'],
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      resolvers: [
        ElementPlusResolver(),
      ],
      dts: resolve(pathResolve('src'), 'auto-imports.d.ts'),
    }),
    // unplugin-vue-components插件 自动导入自己的插件 需要的可以打开
    Components({
      // ui库解析器，也可以自定义
      resolvers: [
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
      ],
      //  指定组件位置，默认是src/components
      dirs: ['src/components'],
      // 要搜索组件的目录的相对路径
      // dts: resolve(pathResolve('src'), 'components.d.ts'),
      dts: 'src/components.d.ts',
      // 组件的有效文件扩展名。
      extensions: ['vue'],
      // 允许子目录作为组件的命名空间前缀。
      directoryAsNamespace: true,
    }),
    createStyleImportPlugin({
      resolves: [
        ElementPlusResolve()
      ],
      // libs: [
      //   {
      //     libraryName: 'element-plus',
      //     esModule: true,
      //     resolveStyle: (name) => {
      //       return `element-plus/lib/theme-chalk/${name}.css`;
      //     },
      //   }
      // ]
    })
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
