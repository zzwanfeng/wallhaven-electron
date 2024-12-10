# package

Vite 需要 Node.js 版本 >= 12.0.0。

electron-builder：打包工具

concurrently：阻塞运行多个命令，-k 参数用来清除其它已经存在或者挂掉的进程
wait-on：等待资源，此处用来等待 url 可访问

cross-env:运行跨平台设置和使用环境变量(Node 中的环境变量)的脚本

yarn electron 为等待 tcp 协议 3000 端口可访问，然后执行 electron
yarn electron:serve 为阻塞执行开发服务器运行和 npm run electron 命令

github 下载超时
手动下载后，放到 C:\Users\user\AppData\Local\electron\Cache

## plugins

- unplugin-vue-components([https://github.com/unplugin/unplugin-vue-components]): 按需自动导入 Vue 组件。ui(Element-ui)库,vue hooks 等.unplugin-vue-components/resolvers

- unplugin-auto-import([https://github.com/unplugin/unplugin-auto-import]): 按需自动导入 Vite、Webpack、Rspack、Rollup 和 esbuild 的 API。支持 TypeScript。unplugin-auto-import/vite

- vite-plugin-style-import([https://github.com/vbenjs/vite-plugin-style-import]):该插件可按需导入组件库样式

- unplugin-vue-components/vite([https://github.com/vbenjs/unplugin-vue-components/vite]):该插件可按需导入组件

- consola([https://github.com/unjs/consola]): 重定向到控制台 console 并轻松恢复重定向。

- vitejs/plugin-legacy([https://github.com/vitejs/vite/tree/main/packages/plugin-legacy]):Vite 默认的浏览器支持基线是 Native ESM、Native ESM 动态导入和 import.meta。此插件为在生产构建时不支持这些功能的旧版浏览器提供支持。

- rollup/plugin-commonjs([https://github.com/rollup/plugins/tree/master/packages/commonjs]): Rollup 插件用于将 CommonJS 模块转换为 ES6，以便将它们包含在 Rollup 包中

- electron-builder：打包工具

- concurrently：阻塞运行多个命令，-k 参数用来清除其它已经存在或者挂掉的进程

- wait-on：等待资源，此处用来等待 url 可访问

- cross-env:运行跨平台设置和使用环境变量(Node 中的环境变量)的脚本
