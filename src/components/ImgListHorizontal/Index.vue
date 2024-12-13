<template>
  <div ref="imgListHorizontal" class="img-list-horizontal">
    <div class="img-list-left" @click="handleScroll('left')"></div>

    <template v-if="list.length">
      <ul ref="visibleList" class="visible-list" :style="ulStyle">
        <li
          ref="imgs"
          v-for="item in list"
          :key="item.id"
          class="visible-list-item"
        >
          <div class="img" @click="handleView($event, item)">
            <img-plus :src="item.thumbs.small"></img-plus>

            <div class="img-info">
              <span>{{ byte(item.file_size) }}</span>

              <span>{{ item.file_type }}</span>
            </div>
          </div>

          <div class="desc v-flex aic jsb">
            <el-tooltip effect="light" placement="top">
              <template #content>
                {{ getCollection(item.id) ? "取消收藏" : "收藏" }}
              </template>

              <span
                :key="item.id + 'cxx'"
                v-if="getCollection(item.id)"
                @click="handleSetCollection(item, 'remove')"
                class="iconfont icon-collection-b shoucang"
              ></span>
              <span
                :key="item.id + 'cx'"
                v-else
                @click="handleSetCollection(item, 'add')"
                class="iconfont icon-collection-b"
              ></span>
            </el-tooltip>

            <span class="flex-1 v-flex aic jsc">{{ item.resolution }}</span>

            <el-tooltip effect="light" content="设为壁纸" placement="top">
              <span
                class="iconfont icon-zhuomian"
                @click="handleDownFile(item, true)"
              ></span>
            </el-tooltip>

            <el-tooltip effect="light" content="下载" placement="top">
              <span
                class="iconfont icon-xiazai"
                @click="handleDownFile(item)"
              ></span>
            </el-tooltip>
          </div>
        </li>
      </ul>
    </template>

    <template v-else>
      <div ref="visibleList" class="skeleton-wrapper">
        <li v-for="item in 10" :key="item" class="skeleton">
          <div class="img"></div>
          <div class="desc">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </li>
      </div>
    </template>

    <div class="img-list-right" @click="handleScroll('right')"></div>
  </div>
</template>

<script setup>
import handleWallhaven from "@/hooks/handleWallhaven";

import { byte } from "@/utils/util";
import { SystemStore } from "@/store/modules/System";

const { handleView, getCollection, handleSetCollection, handleDownFile } =
  handleWallhaven();

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});

// 系统设置
const SystemPinia = SystemStore();
// 左右翻页
const scroll = ref(0);
// 显示数据
const list = ref([]);

watch(
  () => props.list,
  (newValue, oldValue) => {
    list.value = newValue;
  }
);

// style
const ulStyle = computed(() => {
  return {
    transform: `translateX(-${scroll.value}px)`,
  };
});

// 左右翻页
const imgListHorizontal = ref("imgListHorizontal");
const visibleList = ref("visibleList");
const handleScroll = (type) => {
  if (type === "left") {
    scroll.value = Math.max(scroll.value - 400, 0);
  } else {
    let cWidth = imgListHorizontal.value.clientWidth;
    let vWidth = visibleList.value.clientWidth;
    scroll.value = Math.min(scroll.value + 400, vWidth - cWidth);
  }
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.img-list-horizontal {
  position: relative;

  .img-list-left,
  .img-list-right {
    position: absolute;
    top: 75px;
    z-index: 5;
    cursor: pointer;
    height: 60px;
    width: 50px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.596);
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.5;
    transition: opacity 0.3s;

    &:hover {
      opacity: 1;
    }
  }

  .img-list-left {
    left: 10px;
    background-image: url(@/assets/left.png);
  }

  .img-list-right {
    right: 10px;
    background-image: url(@/assets/right.png);
  }

  .visible-list {
    display: flex;
    transition: transform 0.3s;
    width: fit-content;

    .visible-list-item {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.8s ease-in-out, box-shadow 0.3s ease-in-out;
      z-index: 1;
      flex-shrink: 0;

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

          img {
            transform: scale(1.2);
          }
        }
      }

      .desc {
        padding: 0 10px;
        height: 40px;
        background: var(--card-desc-bg-color);
        color: var(--card-desc-font-color);
        font-size: 12px;

        span {
          &:last-child {
            margin-left: 20px;
          }
        }

        .shoucang {
          color: var(--button-plain-font-color);
        }
      }

      + .visible-list-item {
        margin-left: 20px;
      }
    }
  }
}

.skeleton-wrapper {
  display: flex;
  transition: transform 0.3s;
  width: fit-content;

  .skeleton {
    list-style: none;

    + .skeleton {
      margin-left: 20px;
    }

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
</style>
