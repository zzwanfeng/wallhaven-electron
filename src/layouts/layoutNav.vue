<template>
  <div class="layout-nav v-flex aic">
    <div class="nav-left flex-1">
      <div class="logo">
        <img draggable="false" :src="logo" alt />
        <div>One Wallhaven</div>
      </div>
    </div>

    <div class="nav-right">
      <div class="opt">
        <Popover width="220" ref="popover">
          <!-- <div
            class="opt-btn iconfont icon-caidan"
            title="功能菜单"
            slot="reference"
          ></div> -->

          <template v-slot:reference>
            <div class="opt-btn iconfont icon-caidan" title="功能菜单"></div>
          </template>

          <div class="dropdown-extended">
            <div
              v-for="item in navs"
              class="menu-nav"
              @click="handleNavClick(item.type)"
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

<script>
import logo from "@/assets/logo.png";
import Popover from "./components/Popover";
import ThemeDialog from "./components/Theme";
import AboutDialog from "./components/About";
import LogDialog from "./components/Log";

import { openConfig } from "@/libs/send";

export default {
  name: "LayoutNav",
  components: {
    Popover,
    ThemeDialog,
    AboutDialog,
    LogDialog,
  },
  data() {
    return {
      logo,
      navs: [
        {
          title: "下载",
          type: "down",
          icon: "icon-xiazai",
        },
        {
          title: "皮肤",
          type: "theme",
          icon: "icon-a-huaban2fuben9",
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
        },
        {
          title: "关于",
          type: "about",
          icon: "icon-guanyu1",
        },
      ],
    };
  },
  watch: {},
  methods: {
    handleRefresh() {
      let routerView = null;
      const findRouterVuew = (children = []) => {
        if (children.length) {
          children.forEach((item) => {
            if (item.$refs && item.$refs.routerView)
              routerView = item.$refs.routerView;
            if (!routerView) findRouterVuew(item.$children);
          });
        }
      };
      findRouterVuew(this.$root.$children);
      if (routerView && routerView.onRefresh) {
        routerView.onRefresh.call(routerView);
      }
    },
    handleTitleClick(type) {
      window.send[type](type);
    },
    handleNavClick(type) {
      this.$refs.popover.doToggle();
      if (type === "set") {
        openConfig();
      } else if (type === "down") {
        this.$router.push({
          name: "download",
        });
      } else {
        this.$refs[type].doToggle();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.layout-nav {
  height: 30px;
  color: var(--font-color);
  background-color: var(--head-bg-color);

  .nav-left {
    .logo {
      width: 160px;
      display: flex;
      align-items: center;
      padding: 0 10px;

      img {
        width: 20px;
        margin-right: 6px;
      }
    }
  }

  .nav-right {
    -webkit-app-region: drag;
    color: var(--head-font-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    flex-wrap: nowrap;

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
