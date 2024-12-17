<!--
 * @Author: 曾志航
 * @Date: 2024-12-03 08:47:21
 * @LastEditors: 曾志航
 * @LastEditTime: 2024-12-17 14:12:05
 * @FilePath: \wallhaven-electron\src\components\ImgList\Index.vue
 * @Description: 图片列表 水平模式
 * @TODO:
-->
<template>
  <div ref="visibleContainer" class="visible-container" key="visible-container">
    <template v-if="skeleton">
      <div class="skeleton-wrapper">
        <li v-for="item in 24" :key="item" class="skeleton">
          <div class="img"></div>
          <div class="desc">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </li>
      </div>
    </template>

    <template v-else>
      <template v-if="visibleList.length > 0">
        <ul class="visible-list" :style="visibleListStyle">
          <li
            ref="imgs"
            v-for="item in visibleList"
            :key="item.id"
            :style="item.style"
            class="visible-list-item"
            :id="item.id"
          >
            <div
              class="img"
              :style="{ height: item.thumbs_height + 'px' }"
              @click="handleView($event, item)"
            >
              <img-plus :src="item.original"></img-plus>
              <div class="img-info">
                <span>{{ byte(item.file_size) }}</span>
                <span>{{ item.resolution }}</span>
                <span>{{ item.file_type }}</span>
              </div>
            </div>
            <div class="desc">
              <span
                title="取消收藏"
                :key="item.id + 'cxx'"
                v-if="getCollection(item.id)"
                @click="handleRemoveCollection(item)"
                class="iconfont icon-collection-b shoucang"
              ></span>
              <span
                title="收藏"
                :key="item.id + 'cx'"
                v-else
                @click="handleAddCollection(item)"
                class="iconfont icon-collection-b"
              ></span>
              <span
                title="设为壁纸"
                class="iconfont icon-zhuomian"
                @click="handleDownFile(item, true)"
              ></span>
              <span
                title="下载"
                class="iconfont icon-xiazai"
                @click="handleDownFile(item)"
              ></span>
            </div>
          </li>
        </ul>

        <div
          :style="{ height: placeholderHeight + 'px' }"
          key="placeholder"
        ></div>
      </template>

      <template v-else>
        <!-- <empty-page title="未找到图片信息~"></empty-page> -->
      </template>
    </template>
  </div>
</template>

<script setup>
import handleWallhaven from "@/hooks/handleWallhaven";

import {
  byte,
  debounce,
  toTwoDimensionalArray,
  minValIndex,
  maxVal,
  getTransforms,
  getRandom,
} from "@/utils/util";
import { SystemStore } from "@/store/modules/System";

const { handleView, getCollection, handleSetCollection, handleDownFile } =
  handleWallhaven();

const props = defineProps({
  skeleton: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: "",
  },
});

// 页面ref
const visibleContainer = ref("visibleContainer");
// 图片列表 ref
const imgs = ref("imgs");
// 占位高度
const placeholderHeight = ref(0);
// 滚动条高度
const scrollTop = ref(0);
// 虚拟列表容器可视区大小
const clientHeight = ref(0);
const clientWidth = ref(0);
// 虚拟列表数据
const visibleList = ref([]);
// 虚拟列表样式
const visibleListStyle = ref({});
// 缓存列表 数据
const catchList = ref([]);
const catchKeys = ref({});
const catchIndex = ref(0);
const catchScrollTop = ref(0);
// 总高度
const sumHeight = ref([]);
// 单行显示个数
const column = ref(3);
// 单个元素宽度
const width = ref(300);
// 间隔
const gap = ref(20);
// 动画标识 仅在 column 发生变化时执行
const isAnimate = ref(false);
// 预览模式
const previewMode = ref();
// 更新滚动
const updateScrollTop = ref();

const emit = defineEmits(["loadMore"]);

// 修改时间
const changeTime = computed(() => {
  return {
    placeholderHeight: placeholderHeight.value,
    scrollTop: scrollTop.value,
    clientHeight: clientHeight.value,
  };
});

watch(
  () => changeTime,
  (newValue, oldValue) => {
    updateVisibleList();
  },
  { immediate: false, deep: true }
);

// 初始化
const init = () => {
  // 单行显示个数
  column.value = 3;
  // 单个元素宽度
  width.value = 300;
  // 间隔
  gap.value = 20;
  // 缓存列表
  catchList.value = [];
  catchKeys.value = {};
  // 缓存下标和滚动高度
  catchIndex.value = 0;
  catchScrollTop.value = 0;
  // 动画标识 仅在 column 发生变化时执行
  isAnimate.value = false;
  updateScrollTop.value = debounce((res) => {
    isAnimate.value = false;
    scrollTop.value = res;
  }, 50);
};
// 重置
const handleReset = (column) => {
  catchList.value = [];
  catchKeys.value = {};
  sumHeight.value = toTwoDimensionalArray(column, 0);
  visibleContainer.value.scrollTo(0, 0);
  catchIndex.value = 0;
  catchScrollTop.value = 0;
};

// 更新虚拟列表
const updateVisibleList = () => {
  let startIndex = catchIndex.value;
  let startItem = catchList.value[startIndex];
  if (!startItem) {
    return;
  }

  let top = scrollTop.value - clientHeight.value * 1.5;
  let bottom = scrollTop.value + clientHeight.value * 2.5;
  let len = catchList.value.length;

  const find = (index, catchList, comparefun) => {
    let startIndex = index;
    let endIndex = index + 1;
    let startState = true;
    let endState = true;
    let len = catchList.length;
    let list = [];

    while (startState || endState) {
      if (startState) {
        if (startIndex >= 0) {
          let item = catchList[startIndex];
          if (item && comparefun(item)) {
            list.push(item);
            startIndex--;
          } else {
            startState = false;
          }
        } else {
          startState = false;
        }
      }

      if (endState) {
        if (endIndex < len) {
          let item = catchList[endIndex];
          if (item && comparefun(item)) {
            list.push(item);
            endIndex++;
          } else {
            endState = false;
          }
        } else {
          endState = false;
        }
      }
    }
    return list;
  };

  // 当前缓存下标不在范围内
  if (!(startItem._top > top && startItem._top < bottom)) {
    let scrollSize = catchScrollTop.value - scrollTop.value;
    let func = scrollSize < 0 ? (i, z = 1) => i + z : (i, z = 1) => i - z;

    if (Math.abs(scrollSize) > 3000) {
      startIndex = func(
        startIndex,
        parseInt(Math.abs(scrollSize) / 350) * this.column
      );

      startIndex =
        scrollSize < 0
          ? Math.min(len - 1, startIndex)
          : Math.max(0, startIndex);
    }

    let flag = true;
    let endIndex = startIndex;

    while (flag) {
      --startIndex;
      ++endIndex;

      let img = catchList.value[startIndex];
      let img2 = catchList.value[endIndex];

      if (img && img._top > top && img._top < bottom) {
        flag = false;
      }

      if (img2 && img2._top > top && img2._top < bottom) {
        flag = false;
        startIndex = endIndex;
      }

      if (startIndex <= 0 && endIndex >= len) {
        flag = false;
      }
    }

    // 更新下标
    catchIndex.value = startIndex;
  }

  visibleList.value = Object.freeze(
    find(
      startIndex,
      catchList.value,
      (img) => img._top > top && img._top < bottom
    )
  );
  catchScrollTop.value = scrollTop.value;

  // 过渡动画
  const prevImgs = imgs.value;
  if (prevImgs && isAnimate.value) {
    isAnimate.value = false;
    const prevPositions = getTransforms(prevImgs);

    nextTick(() => {
      const currentPositions = getTransforms(prevImgs);

      prevImgs.forEach((imgRef) => {
        const id = imgRef.id;
        const currentPosition = currentPositions.get(id);
        let prevPosition = prevPositions.get(id);

        if (!prevPosition) {
          prevPosition = `translate(${getRandom(
            0,
            clientWidth.value
          )}px, ${getRandom(top, bottom)}px)`;
        }

        const keyframes = [
          { transform: prevPosition },
          { transform: currentPosition },
        ];

        const options = {
          duration: 600,
          easing: "cubic-bezier(0,0,0.32,1)",
        };

        const animation = imgRef.animate(keyframes, options);
      });
    });
  }
};

// 大小变更 重新布局
const resetLayout = () => {
  sumHeight.value = toTwoDimensionalArray(column.value, 0);

  const { width, gap, sumHeight } = this;
  catchList.value.forEach((img) => {
    let minIndex = minValIndex(sumHeight);

    img._top = sumHeight[minIndex];
    img.style = {
      width: img.thumbs_width + "px",
      height: img.thumbs_height + 40 + "px",
      transform: `translate(${minIndex * (width + gap)}px, ${
        sumHeight[minIndex]
      }px)`,
    };

    sumHeight[minIndex] = sumHeight[minIndex] + img.thumbs_height + gap + 40;
  });

  isAnimate.value = true;
  placeholderHeight.value = maxVal(sumHeight);
};

// 添加数据
const add = (imgs, reset = false) => {
  if (reset) {
    handleReset(column.value);
  }

  const newImgs = [];

  imgs.forEach((img) => {
    if (!catchKeys.value[img.id]) {
      const minIndex = minValIndex(sumHeight.value);

      img.original = img.thumbs.original;
      img.thumbs_width = width.value;
      img.thumbs_height =
        previewMode.value === "waterfall"
          ? parseInt(Math.max(width.value / img.ratio, 200))
          : 200;
      img.original =
        img.thumbs_height === 200 ? img.thumbs.small : img.thumbs.original;
      img._top = sumHeight.value[minIndex];
      // TODO:收藏信息
      // img._collection = this.$store.collections.has(img.id);
      img.style = {
        width: img.thumbs_width + "px",
        height: img.thumbs_height + 40 + "px",
        transform: `translate(${minIndex * (width.value + gap.value)}px, ${
          sumHeight.value[minIndex]
        }px)`,
      };

      sumHeight.value[minIndex] =
        sumHeight.value[minIndex] + img.thumbs_height + gap.value + 40;
      newImgs.push(img);
      catchKeys.value[img.id] = true;
    }
  });

  catchList.value.push(...newImgs);
  placeholderHeight.value = maxVal(sumHeight.value);
};

// 列表滚动
const handlerScroll = (e) => {
  let { scrollHeight, clientHeight, scrollTop } = e.target;
  if (scrollHeight < scrollTop + clientHeight + 1000) {
    emit("loadMore");
  }

  updateScrollTop.value(scrollTop);
};

onMounted(() => {
  init();
  // // 预览模式
  // this.previewMode = this.mode || this.$store.appConfig.get("previewMode");
  // 3
  const updateVisibleContainerInfo = (dom) => {
    clientHeight.value = dom.clientHeight;
    clientWidth.value = dom.clientWidth;
    visibleListStyle.value = {
      transform: `translateX(${
        ((dom.clientWidth + gap.value) % (width.value + gap.value)) / 2
      }px)`,
    };
    return Math.max(
      parseInt((dom.clientWidth + gap.value) / (width.value + gap.value)),
      1
    );
  };
  const observer = debounce((e) => {
    const nowColumn = updateVisibleContainerInfo(visibleContainer.value);
    if (nowColumn !== column.value) {
      column.value = nowColumn;
      resetLayout();
    }
  }, 300);
  const resizeObserver = new ResizeObserver((e) => observer(e));
  column.value = updateVisibleContainerInfo(visibleContainer.value);
  handleReset(column.value);
  visibleContainer.value.addEventListener("scroll", handlerScroll);
  // this.$once("hook:beforeDestroy", () => {
  //   visibleContainer.removeEventListener("scroll", this.handlerScroll);
  //   resizeObserver.disconnect();
  // });
  // this.$on("hook:activated", () => {
  //   resizeObserver.observe(visibleContainer);
  //   this.$refs.visibleContainer.scrollTop = this.scrollTop;
  // });
  // this.$on("hook:deactivated", () => {
  //   resizeObserver.unobserve(visibleContainer);
  // });
});
onUnmounted(() => {
  console.log("onUnmounted");
});

defineExpose({
  add,
  handleReset,
});
</script>

<style lang="scss">
.visible-container {
  height: 100%;
  margin: 10px;
  overflow-y: scroll;
  overflow-x: hidden;

  .visible-list {
    position: relative;
    list-style: none;
    transition: transform 0.2s;
  }

  .visible-list-item {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 8px;
    overflow: hidden;
    transition:
            /* transform .8s ease-in-out, */ box-shadow 0.3s
      ease-in-out;
    z-index: 1;

    &:hover {
      box-shadow: var(--card-box-shadow);
    }

    .img {
      position: relative;
      width: 300px;
      height: 200px;
      overflow: hidden;

      img {
        display: block;
        width: 100%;
        height: 100%;
        transition: transform 0.4s;
      }

      .img-info {
        position: absolute;
        top: 0;
        line-height: 30px;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        transform: translateY(-100%);
        transition: transform 0.4s;
        padding: 0 10px;
        font-weight: 600;
        opacity: 0.8;
        background: var(--card-desc-bg-color);
        color: var(--card-desc-font-color);
        font-family: fantasy;
      }

      &:hover {
        .img-info {
          transform: translateY(0);
        }
      }
    }

    .desc {
      line-height: 40px;
      height: 40px;
      background: var(--card-desc-bg-color);
      color: var(--card-desc-font-color);
      font-size: 12px;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;

      span {
        cursor: pointer;
        font-size: 18px;
      }

      .shoucang {
        color: var(--button-plain-font-color);
      }
    }
  }

  .skeleton-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;

    .skeleton {
      display: inline-block;
      margin: 0 5px 20px;

      .img {
        position: relative;
        width: 300px;
        height: 200px;
        background: linear-gradient(
          60deg,
          #18171717 25%,
          #0c0c0c17 37%,
          #3a3a3a1f 63%
        );
        background-size: 400% 100%;
        animation: skeleton-loading 1.4s ease infinite;
      }

      .desc {
        display: flex;
        justify-content: space-between;
        line-height: 40px;
        height: 40px;

        span {
          display: inline-block;
          flex: 1;
          background: linear-gradient(
            60deg,
            #a0a0a017 25%,
            #e2e2e217 37%,
            #e4e4e41f 63%
          );
          background-size: 400% 100%;
          //animation: skeleton-loading 1.4s ease infinite;
        }

        @keyframes skeleton-loading {
          0% {
            background-position: 100% 50%;
          }

          100% {
            background-position: 0 50%;
          }
        }
      }
    }
  }
}
</style>
