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
