import router from "@/routers/index"
import App from './App.vue'
import ElementPlus from 'element-plus'
import '@/style/iconfont.css';
import '@/style/index.scss';



import { createApp } from 'vue'
import { store } from '@/store'
import { initDirective } from './directives'
import { initPath, updateDownState } from '@/libs/send'
// 初始化下载目录
initPath()





const app = createApp(App)
initDirective(app)
app.use(store).use(ElementPlus).use(router)

// 现在所有的导航都是异步的，等路由ready以后再进行挂载组件；
router.isReady().then(() => app.mount('#app'))
// 在导航期间每次发生未捕获的错误时都会调用该处理程序
// eslint-disable-next-line no-console
router.onError((err) => {
  console.error(err)
})


import { SystemStore } from '@/store/modules/System'
const SystemPinia = SystemStore()
updateDownState(SystemPinia.setDownState);