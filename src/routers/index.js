import VueRouter from "vue-router";
import Vue from "vue";
import layout from "../layouts/main"
// import recommendImg from '../assets/nav/recommend.png'
// import wallpaperImg from '../assets/nav/wallpaper.png'
// import componentImg from '../assets/nav/component.png'
// import myImg from '../assets/nav/my.png'


Vue.use(VueRouter);

export const routes = [
  {
    path: "/",
    component: layout,
    meta: {
      title: "在线壁纸",
      // icon: recommendImg
    },
    children: [
      {
        path: "/",
        name: "热门推荐",
        meta: {
          title: "推荐",
        },
        component: () => import("@/views/HotPage/Index.vue")
      },
      {
        path: "/AcgPage",
        name: "动漫精选",
        meta: {
          title: "推荐",
        },
        component: () => import("@/views/AcgPage/Index.vue")
      },
      {
        path: "/PeoplePage",
        name: "人物精选",
        meta: {
          title: "推荐",
        },
        component: () => import("@/views/PeoplePage/Index.vue")
      }
    ]
  },
  {
    path: "/my",
    component: layout,
    meta: {
      title: "我的壁纸",
      // icon: wallpaperImg
    },
    children: [
      {
        path: "/CollectionPage",
        name: "CollectionPage",
        meta: {
          title: "我的收藏",
        },
        component: () => import("@/views/CollectionPage/Index.vue")
      },
      {
        path: "/DownloadPage",
        name: "DownloadPage",
        meta: {
          title: "下载中心",
        },
        component: () => import("@/views/DownloadPage/Index.vue")
      }
    ]
  },
  // {
  //   path: "/component",
  //   component: layout,
  //   meta: {
  //     title: "组件",
  //     // icon: componentImg
  //   },
  //   children: [
  //     {
  //       path: "/",
  //       name: "component",
  //       meta: {
  //         title: "桌面组件",
  //       },
  //       component: () => import("../pages/empty")
  //     }
  //   ]
  // },
  {
    path: "/other",
    meta: {
      title: "更多",
      // icon: myImg
    },
    component: layout,
    children: [
      {
        path: "/updateLog",
        name: "updateLog",
        meta: {
          title: "更新日志",
        },
        component: () => import("@/views/UpdateLog/Index.vue")
      },
      {
        path: "/AboutPage",
        name: "AboutPage",
        meta: {
          title: "关于",
        },
        component: () => import("@/views/AboutPage/Index.vue")
      },
    ]
  },
  {
    path: "*",
    meta: {
      hide: true
    },
    component: layout,
    children: [
      {
        path: "/",
        component: () => import("@/views/empty/Index.vue")
      }
    ]
  }
]

const router = new VueRouter({
  mode: "hash",
  routes: routes,
})

export default router