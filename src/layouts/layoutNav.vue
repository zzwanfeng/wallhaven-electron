<template>
  <div class="layout-nav v-flex aic">
    <div class="nav-left flex-1 v-flex aic">
      <img draggable="false" :src="logo" alt />
      <div>One Wallhaven</div>
    </div>

    <div class="nav-right v-flex aic jsb">
      <div class="opt">
        <Popover width="220" ref="popover">
          <template v-slot:reference>
            <div class="opt-btn iconfont icon-caidan" title="功能菜单"></div>
          </template>

          <div class="dropdown-extended">
            <div
              v-for="item in navs"
              class="menu-nav"
              @click="handleNavClick(item)"
            >
              <span class="iconfont" :class="item.icon"></span>
              <div class="menu-nav-title">{{ item.title }}</div>
            </div>
          </div>
        </Popover>

        <span
          class="opt-btn iconfont icon-refresh"
          title="刷新"
          @click="handleRefresh"
        ></span>

        <span
          class="opt-btn iconfont icon-zuixiaohua"
          title="最小化"
          @click="handleTitleClick('min')"
        ></span>

        <span
          v-if="isMax"
          class="opt-btn iconfont icon-tuichuquanping"
          @click="handleTitleClick('max')"
        ></span>

        <span
          v-else
          class="opt-btn iconfont icon-quanping"
          @click="handleTitleClick('max')"
        ></span>

        <span
          class="opt-btn iconfont icon-guanbi"
          title="关闭"
          @click="handleTitleClick('close')"
        ></span>
      </div>

      <ThemeDialog ref="theme"></ThemeDialog>
      <AboutDialog ref="about"></AboutDialog>
      <LogDialog ref="log"></LogDialog>
    </div>
  </div>
</template>

<script setup>
import logo from "@/assets/logo.png";
import Popover from "./components/Popover";
import ThemeDialog from "./components/Theme";
import AboutDialog from "./components/About";
import LogDialog from "./components/Log";

import { openConfig } from "@/libs/send";
import { minWindow } from "@/utils/ipcRenderer";
import { useRouter } from "vue-router";

const router = useRouter();

const theme = ref("theme");
const about = ref("about");
const log = ref("log");
const navs = ref([
  {
    title: "下载",
    type: "down",
    icon: "icon-xiazai",
  },
  {
    title: "皮肤",
    type: "theme",
    icon: "icon-a-huaban2fuben9",
    refs: theme,
  },
  {
    title: "设置",
    type: "set",
    icon: "icon-shezhi",
  },
  {
    title: "日志",
    type: "log",
    icon: "icon-xitongrizhi",
    refs: log,
  },
  {
    title: "关于",
    type: "about",
    icon: "icon-guanyu1",
    refs: about,
  },
]);
const isMax = ref(false);

const { ipcRenderer } = require("electron");
ipcRenderer.on("mainWin-max", (_, status) => {
  isMax.value = status;
});

// 刷新
const handleRefresh = () => {
  //       let routerView = null;
  //       const findRouterVuew = (children = []) => {
  //         if (children.length) {
  //           children.forEach((item) => {
  //             if (item.$refs && item.$refs.routerView)
  //               routerView = item.$refs.routerView;
  //             if (!routerView) findRouterVuew(item.$children);
  //           });
  //         }
  //       };
  //       findRouterVuew(this.$root.$children);
  //       if (routerView && routerView.onRefresh) {
  //         routerView.onRefresh.call(routerView);
  //       }
};

// 最小化、放大、关闭
const handleTitleClick = (type) => {
  window.ipcRenderer.send(type, {});
};

// 菜单
const popover = ref("popover");
const handleNavClick = (item) => {
  popover.value.doToggle();

  if (item.type === "set") {
    openConfig();
  } else if (item.type === "down") {
    router.push({
      name: "downloadPage",
      query: {},
    });
  } else {
    item.refs.doToggle();
  }
};
</script>

<style lang="scss" scoped>
.layout-nav {
  height: var(--layout-header-height);
  color: var(--font-color);
  background-color: var(--head-bg-color);
  -webkit-app-region: drag;

  .nav-left {
    padding: 0 10px;
    width: 160px;
    font-size: 14px;
    font-weight: bold;
    flex-wrap: nowrap;

    img {
      margin-right: 6px;
      width: 20px;
    }
  }

  .nav-right {
    color: var(--head-font-color);

    > div {
      flex-shrink: 0;
    }

    .title {
      flex: 1;
      text-align: center;
    }

    .opt {
      width: 160px;
      letter-spacing: 2px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      -webkit-app-region: no-drag;

      .opt-btn {
        font-size: 14px;
        width: 40px;
        text-align: center;
        cursor: pointer;

        &:hover {
          color: #38acfa;
        }
      }
    }
  }
}
</style>
