import layout from "../layouts/Index"

import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
// import recommendImg from '../assets/nav/recommend.png'
// import wallpaperImg from '../assets/nav/wallpaper.png'
// import componentImg from '../assets/nav/component.png'
// import myImg from '../assets/nav/my.png'



export const routes = [
  {
    path: "/",
    component: layout,
    redirect: "/hotPage",
    meta: {
      title: "在线壁纸",
      // icon: recommendImg
    },
    children: [
      {
        path: "/hotPage",
        name: "hotPage",
        meta: {
          title: "推荐",
        },
        component: () => import("@/views/wallhaven/hotPage/Index.vue")
      },
      {
        path: "/onlineWallpaperPage",
        name: "onlineWallpaperPage",
        meta: {
          title: "推荐",
        },
        component: () => import("@/views/wallhaven/onlineWallpaperPage/Index.vue")
      },
      {
        path: "/acgPage",
        name: "acgPage",
        meta: {
          title: "推荐",
        },
        component: () => import("@/views/acgPage/Index.vue")
      },
      {
        path: "/peoplePage",
        name: "peoplePage",
        meta: {
          title: "推荐",
        },
        component: () => import("@/views/peoplePage/Index.vue")
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
        path: "/collectionPage",
        name: "collectionPage",
        meta: {
          title: "我的收藏",
        },
        component: () => import("@/views/my/collectionPage/Index.vue")
      },
      {
        path: "/downloadPage",
        name: "downloadPage",
        meta: {
          title: "下载中心",
        },
        component: () => import("@/views/my/downloadPage/Index.vue")
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
        path: "/setting",
        name: "setting",
        meta: {
          title: "设置",
        },
        component: () => import("@/views/other/setting/index.vue")
      },
      {
        path: "/updateLog",
        name: "updateLog",
        meta: {
          title: "更新日志",
        },
        component: () => import("@/views/updateLog/Index.vue")
      },
      {
        path: "/aboutPage",
        name: "aboutPage",
        meta: {
          title: "关于",
        },
        component: () => import("@/views/aboutPage/Index.vue")
      },
    ]
  },
  {
    path: "/:catchAll(.*)",
    meta: {
      hide: true
    },
    component: layout,
    children: [
      {
        path: "/:catchAll(.*)",
        component: () => import("@/views/empty/Index.vue")
      }
    ]
  }
]

// const router = new VueRouter({
//   mode: "hash",
//   routes: routes,
// })

// export default router

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
