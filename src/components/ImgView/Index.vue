<!--
 * @Author: 曾志航
 * @Date: 2024-12-03 08:47:21
 * @LastEditors: 曾志航
 * @LastEditTime: 2024-12-16 10:31:31
 * @FilePath: \wallhaven-electron\src\components\ImgView\Index.vue
 * @Description: 图片预览
 * @TODO: 监听是否预览 更换为 组件通信
-->
<template>
  <transition name="slide">
    <div v-if="show" class="animation-content">
      <div
        class="img-view"
        ref="imgContentRef"
        v-loading="loading"
        element-loading-text="加载中..."
      >
        <img
          v-show="!loading"
          @error="loading ? '' : handleError"
          ref="imgRef"
          draggable="false"
          v-dragwidth
          :style="imgStyle"
          :src="imgUrl"
        />

        <div class="zoom-bage">{{ zoom }}</div>
      </div>

      <div class="btns">
        <div
          title="关闭"
          @click="handleClose"
          class="button-default iconfont icon-guanbi"
        ></div>

        <div
          title="还原"
          class="button-default iconfont icon-huifu"
          @click="handleRef"
        ></div>

        <div
          title="下载"
          class="button-default iconfont icon-xiazai"
          @click="handleDownFile(data)"
        ></div>

        <div
          title="设为壁纸"
          class="button-default iconfont icon-zhuomian"
          @click="handleDownFile(data, true)"
        ></div>

        <div
          title="取消收藏"
          v-if="getCollection(data.id)"
          @click="handleSetCollection(data, 'remove')"
          class="button-default iconfont icon-collection-b shoucang"
        ></div>

        <div
          title="收藏"
          v-else
          @click="handleSetCollection(data, 'add')"
          class="button-default iconfont icon-collection-b"
        ></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import handleWallhaven from "@/hooks/handleWallhaven";
import errimg from "@/assets/images/errimg.svg";

import { aspectRatioToWH } from "@/utils/util";
import { getTime } from "@/utils/util";
import { getImgBlod } from "@/utils/util";
import { ElMessage } from "element-plus";
import { SystemStore } from "@/store/modules/System";

const SystemPinia = SystemStore();
const { getCollection, handleSetCollection, handleDownFile } =
  handleWallhaven();

// 页面loading
let loading = ref(false);
// 窗口显示
let show = ref(false);
// 图片地址
let imgUrl = ref("");
// 缩放比例
let zoom = ref(0);
// 图片配置
const imgStyle = ref({
  width: 0,
  height: 0,
  transform: "none",
});
// 窗口宽
let clientWidth = ref(0);
// 窗口高
let clientHeight = ref(0);
let originalW = ref(0);
let minImg = ref({});
let data = ref({});
const imgRef = ref("imgRef");
const imgContentRef = ref("imgContentRef");
const resize = ref();

// 监听是否预览
SystemPinia.$subscribe(
  (mutation, state) => {
    if (state?.nowImgView?.url) {
      if (!!state.nowImgView.id && state.nowImgView.id === data.value.id) {
        return;
      }

      data.value = state.nowImgView;

      init(data.value);
    }
  },
  { detached: false }
);

const init = (val) => {
  let {
    thumbs_height = 200,
    thumbs_width = 300,
    thumbs,
    original,
    dimension_x,
    dimension_y,
    path,
    ratio,
    rect,
  } = val;
  imgUrl.value = "";
  show.value = true;
  loading.value = true;
  originalW.value = dimension_x;

  // 等待动画完成后
  nextTick(() => {
    const keyframes = [
      { transform: `translate(${rect.x}px, ${rect.y}px)` },
      { transform: imgStyle.value.transform },
    ];

    const options = {
      duration: 300,
      easing: "cubic-bezier(0,0,0.32,1)",
    };
    const animate = imgRef.value.animate(keyframes, options);

    animate.onfinish = () => {
      const { width, height } = aspectRatioToWH(
        clientWidth.value - 200,
        clientHeight.value - 200,
        ratio,
        dimension_x,
        dimension_y
      );

      imgContentRef.value.addEventListener("wheel", setImgWH);
      minImg.value = { width, height };
      zoom.value = parseInt((width / dimension_x) * 100);

      // 获取原始图片
      getImgBlod(path)
        .then((res) => {
          imgStyle.value = {
            width: width + "px",
            height: height + "px",
            transform: `translate(${(clientWidth.value - width) / 2}px, ${
              (clientHeight.value - height) / 2
            }px)`,
          };

          imgUrl.value = res;
          loading.value = false;
        })
        .catch((res) => {
          ElMessage({
            message: "图片加载失败",
            type: "error",
            duration: 2000,
          });
          loading.value = false;
        });
    };
  });
};

//还原位置
const handleRef = () => {
  const { width, height } = minImg.value;

  imgStyle.value = {
    width: width + "px",
    height: height + "px",
    transform: `translate(${(clientWidth.value - width) / 2}px, ${
      (clientHeight.value - height) / 2
    }px)`,
  };

  imgRef.value.style.transform = imgStyle.value.transform;
};

// 图片加载失败
const handleError = () => {
  imgUrl.value = errimg;
  imgStyle.value = { width: "600px", h: "600px" };
};

// 获取等比高度
const setImgWH = (e) => {
  if (imgRef.value) {
    let { x, y } = imgRef.value.getBoundingClientRect();

    let { width, height } = imgStyle.value;
    width = parseFloat(width.replace("px", ""));
    height = parseFloat(height.replace("px", ""));

    let oX = x + width / 2;
    let oY = y + height / 2;

    if (e.wheelDeltaY > 0) {
      width += width * 0.1;
      height += height * 0.1;
    } else {
      width -= width * 0.1;
      height -= height * 0.1;
    }

    if (width < minImg.value.width) {
      width = minImg.value.width;
    }

    if (height < minImg.value.height) {
      height = minImg.value.height;
    }

    imgStyle.value = {
      width: width + "px",
      height: height + "px",
      transform: `translate(${oX - width / 2}px, ${oY - height / 2}px)`,
    };

    zoom.value = parseInt((width / originalW.value) * 100);
  }
};

// 关闭
const handleClose = async () => {
  show.value = false;
  await SystemPinia.setNowImgView(null);

  window.removeEventListener("resize", resize.value);
  data.value = {};
};

onMounted(() => {
  resize.value = () => {
    let { height, width } = document.documentElement.getBoundingClientRect();
    clientWidth.value = width;
    clientHeight.value = height;
  };

  resize.value();

  window.addEventListener("resize", resize.value);
});
onUnmounted(() => {
  window.removeEventListener("resize", resize.value);
  data.value = {};
});
</script>

<style lang="scss" scoped>
.animation-content {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vw;
  z-index: 9;
  backdrop-filter: blur(20px);
  overflow: hidden;

  .img-view {
    position: relative;
    width: 100vw;
    height: 100vh;

    img {
      left: 0;
      top: 0;
      position: absolute;
    }

    .zoom-bage {
      position: absolute;
      right: 0;
      left: 0;
      margin: 0 auto;
      bottom: 20px;
      color: #cacaca;
      width: 88px;
      text-align: center;
      font-size: 18px;
      font-family: fantasy;
    }
  }

  .btns {
    position: absolute;
    right: 20px;
    top: 50vh;
    transform: translateY(-50%);
    color: #ffffff9e;
    z-index: 9999;

    div {
      margin: 10px 0;
      padding: 16px;
      border-radius: 50%;
      transition: all 0.2s;

      &:hover {
        background-color: var(--button-hover-bg-color);
        color: var(--button-hover-font-color);
        border: 1px solid var(--button-hover-border-color);
      }

      &.shoucang {
        color: var(--button-plain-font-active-color);
      }
    }
  }
}

.slide-enter-active {
  transition: all 0.5s, border-radius 0.8s 0.3s;
}
.slide-leave-active {
  transition: all 0.8s;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  border-radius: 0 0 100vw 0;
  width: 10px;
  height: 10px;
  background: #000;
}

.slide-leave-to {
  border-radius: 0 0 0 100vw;
  right: 0;
}
</style>
