<template>
  <div class="layout-aside">
    <div class="logo">
      <img draggable="false" :src="logo" alt />
      <div>One Wallpaper</div>
    </div>

    <ul class="nav">
      <li v-for="(item, index) in nav" :key="index">
        <div class="nav-title">{{ item.lable }}</div>

        <ul>
          <li
            :class="{ actice: actice === i.id }"
            v-for="(i, idx) in item.childer"
            :key="idx"
            @click="handleSelect(i)"
            class="nav-subtitle"
          >
            <i class="iconfont" :class="i.icon"></i>
            {{ i.lable }}

            <el-badge
              is-dot
              v-if="i.id === 'down' && downFiles.length > 0"
            ></el-badge>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup>
import logo from "@/assets/images/logo.svg";

import { ref } from "vue";
import { storeToRefs } from "pinia";
import { SystemStore } from "@/store/modules/System";
import { useRouter } from "vue-router";

const router = useRouter();
const emit = defineEmits();

const nav = [
  {
    lable: "在线壁纸",
    childer: [
      {
        id: "hot",
        lable: "热门推荐",
        icon: "icon-remen",
        cname: "hotPage",
      },
      {
        id: "acg",
        lable: "动漫精选",
        cname: "acgPage",
        icon: "icon-erciyuan",
      },
      {
        id: "people",
        lable: "人物精选",
        icon: "icon-meinv",
        cname: "peoplePage",
      },
    ],
  },
  {
    lable: "我的壁纸",
    childer: [
      {
        id: "my",
        lable: "我的收藏",
        icon: "icon-collection-b",
        cname: "collectionPage",
      },
      {
        id: "down",
        lable: "下载中心",
        cname: "downloadPage",
        icon: "icon-xiazai",
      },
    ],
  },
  {
    lable: "更多",
    childer: [
      {
        id: "setting",
        lable: "设置",
        cname: "setting",
        icon: "icon-guanyu",
      },
      {
        id: "updateLog",
        lable: "更新日志",
        cname: "updateLog",
        icon: "icon-guanyu",
      },
      {
        id: "about",
        lable: "关于",
        cname: "aboutPage",
        icon: "icon-guanyu",
      },
    ],
  },
];

let actice = ref("hot");

const SystemPinia = SystemStore();
const downFiles = SystemPinia?.getAllDownFiles ?? [];

const handleSelect = (i) => {
  actice.value = i.id;
  router.push({
    name: i.cname,
    query: {},
  });
};
</script>

<style lang="scss" scoped>
.layout-aside {
  width: 260px;
  background-color: #201f2908;
  box-shadow: -10px 0 20px 0px #000000c4;
  color: var(--font-color);

  .logo {
    -webkit-app-region: no-drag;
    text-align: center;
    font-size: 20px;
    line-height: 30px;
    font-weight: 700;

    img {
      margin-top: 30px;
      width: 120px;
    }
  }

  .nav {
    padding: 20px 30px;
    user-select: none;
    /*  -webkit-app-region: no-drag; */

    li {
      list-style: none;
      line-height: 50px;
      padding-left: 20px;
      font-size: 14px;
      position: relative;

      .nav-title {
        font-size: 16px;
        font-weight: 600;
      }

      .nav-subtitle {
        display: inline-block;
        padding: 0 10px;
        margin: 0 18px;

        &:hover {
          color: var(--hover-font-color);
        }

        &::before {
          content: "";
          position: absolute;
          bottom: 0;
          height: 2px;
          width: 100px;
          left: 0;
          /*  right: 0; */
          /* margin: 0 auto; */
          border-radius: 4px;
          background: linear-gradient(45deg, #0081ff, #22ebff);
          transition: transform 0.85s cubic-bezier(0.215, 0.61, 0.355, 1),
            opacity 0.85s cubic-bezier(0.215, 0.61, 0.355, 1);
          transform: scaleX(0);
          transform-origin: bottom right;
          opacity: 0;
        }

        &.actice::before {
          transform-origin: bottom left;
          transform: scaleX(1);
          opacity: 1;
          /*  animation: ttt 0.8s forwards; */
        }

        @keyframes ttt {
          0% {
            width: 10%;
          }

          100% {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
