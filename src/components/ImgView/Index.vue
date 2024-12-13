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
          @click="handleDownFile()"
        ></div>

        <div
          title="设为壁纸"
          class="button-default iconfont icon-zhuomian"
          @click="() => handleSetWallpaper(item, true)"
        ></div>

        <div
          title="取消收藏"
          v-if="getCollection(data.id)"
          @click="handleRemoveCollection(data)"
          class="button-default iconfont icon-collection-b shoucang"
        ></div>

        <div
          title="收藏"
          v-else
          @click="handleAddCollection(data)"
          class="button-default iconfont icon-collection-b"
        ></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { aspectRatioToWH } from "@/utils/util";
import { getTime } from "@/utils/util";
import { getImgBlod } from "@/utils/util";
import errimg from "@/assets/images/errimg.svg";
import { ElMessage } from "element-plus";
import { SystemStore } from "@/store/modules/System";
const SystemPinia = SystemStore();

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

// 监听是否预览
SystemPinia.$subscribe(
  (mutation, state) => {
    if (state?.nowImgView?.url) {
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

    imgStyle.value.width = width + "px";
    imgStyle.value.height = height + "px";

    imgRef.value.style.transform = `translate(${oX - width / 2}px, ${
      oY - height / 2
    }px)`;

    zoom.value = parseInt((width / originalW.value) * 100);
  }
};

// 关闭
const handleClose = async () => {
  show.value = false;
  await SystemPinia.setNowImgView(null);
};

// 添加收藏
const handleAddCollection = async (item) => {
  await SystemPinia.setCollectFiles(item, "add");

  ElMessage({
    message: "收藏成功",
    type: "success",
    duration: 2000,
  });
};

// 移除收藏
const handleRemoveCollection = async (item) => {
  await SystemPinia.setCollectFiles(item, "remove");
  ElMessage({
    message: "取消收藏",
    type: "success",
    duration: 2000,
  });
};

// 设置壁纸
const handleSetWallpaper = () => {};

// 下载
const handleDownFile = async (item = data.value) => {
  let {
    id,
    path: url,
    file_size: size,
    resolution,
    thumbs: { small },
  } = item;

  // if (/^blob:/.test(imgUrl.value)) {
  //  // 方法一 ()这个方法还没处理 下载管理的数据 暂时不用)
  //   setTimeout(async () => {
  //     const a = document.createElement('a')
  //     a.href = imgUrl.value
  //     a.download = `one-${id}${url.substr(url.lastIndexOf('.'))}`
  //     a.click()
  //     setTimeout(() => {
  //       URL.revokeObjectURL(a.href)
  //       a.remove()
  //     }, 3000)

  //     SystemPinia.setDownDoneFiles(
  //       {
  //         id,
  //         resolution,
  //         size,
  //         small,
  //         url,
  //         downloadtime: getTime(),
  //       },
  //       'add'
  //     )
  //   }, 3000)

  //   ElMessage({
  //     message: '下载成功',
  //     type: 'success',
  //     duration: 2000,
  //   })
  // } else {
  // 方法二
  let obj = JSON.parse(
    JSON.stringify({
      id,
      url,
      size,
      resolution,
      small,
      _img: item,
    })
  );
  setTimeout(async () => {
    await SystemPinia.setDownFiles(obj);
  }, 1000);

  ElMessage({
    message: "已加入下载",
    type: "success",
    duration: 2000,
  });
  // }
};

// 获取收藏状态
const getCollection = (id) => {
  let collections = SystemPinia?.getAllCollectFiles ?? [];
  const isShow =
    collections.length > 0 &&
    collections.findIndex((item) => id == item.id) !== -1;
  return isShow;
};

onMounted(() => {
  const resize = () => {
    let { height, width } = document.documentElement.getBoundingClientRect();
    clientWidth.value = width;
    clientHeight.value = height;
  };

  resize();

  window.addEventListener("resize", resize);
});
onUnmounted(() => {
  window.removeEventListener("resize", resize);
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
        color: var(--button-plain-font-color);
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
