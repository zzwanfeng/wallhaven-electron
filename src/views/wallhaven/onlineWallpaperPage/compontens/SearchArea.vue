<template>
  <div class="search-wrapper-placeholder">
    <div class="search-wrapper" :class="{ hide: !more }">
      <div class="search-more-wrapper">
        <div class="search-input">
          <FormInput type="text" placeholder="搜索..." v-model="search.q">
            <template v-slot:append>
              <div @click="handleSearch" class="search-btn pl10 pr10">
                <i class="iconfont icon-mohuchaxun"></i>
              </div>
            </template>
          </FormInput>
        </div>

        <div class="more-icon" @click="more = !more">
          <i class="iconfont icon-shouqi" v-if="more"></i>
          <i class="iconfont icon-shaixuan-zhankai" v-else></i>
        </div>
      </div>

      <FormCheckboxRadio
        label="分类"
        v-model="search.categories"
        :list="categoriesList"
        type="radio"
        width="60px"
      >
      </FormCheckboxRadio>

      <div v-show="more">
        <FormCheckboxRadio
          label="场景"
          v-model="search.purity"
          :list="purityList"
          width="60px"
        >
        </FormCheckboxRadio>

        <FormCheckboxRadio
          label="分辨率"
          v-model="resolution.type"
          :list="stypeList"
          type="radio"
          width="60px"
        >
        </FormCheckboxRadio>

        <FormCheckboxRadio
          label=""
          v-for="item in resolutionList"
          v-model="resolution.value"
          :list="item"
          :type="resolution.type === 'atleast' ? 'radio' : 'checkbox'"
          width="60px"
        ></FormCheckboxRadio>

        <FormCheckboxRadio
          :label="index === 0 ? '比例' : ''"
          v-for="(item, index) in ratiosList"
          v-model="search.ratios"
          :list="item"
          width="60px"
        >
        </FormCheckboxRadio>

        <FormCheckboxRadio
          label="颜色"
          v-model="search.colors"
          :list="colorsList"
          type="radio"
        >
          <template #default="{ color }">
            <template v-if="color === ''">
              <div class="color-item transparent"></div>
            </template>

            <template v-else>
              <div
                class="color-item"
                :class="{ active: color === search.colors }"
                :style="{ backgroundColor: '#' + color }"
              ></div>
            </template>
          </template>
        </FormCheckboxRadio>

        <FormCheckboxRadio
          label="排序"
          v-model="search.order"
          :list="orderList"
          type="radio"
          width="60px"
        >
        </FormCheckboxRadio>

        <FormCheckboxRadio
          label=""
          v-model="search.sorting"
          :list="sortList"
          type="radio"
          width="60px"
        >
        </FormCheckboxRadio>

        <FormCheckboxRadio
          label="时间"
          v-model="search.topRange"
          :list="topRangeList"
          v-show="search.sorting === 'toplist'"
          type="radio"
          width="60px"
        >
        </FormCheckboxRadio>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  purityList,
  stypeList,
  resolutionList,
  ratiosList,
  colorsList,
  sortList,
  orderList,
  topRangeList,
  categoriesList,
  defSearch,
} from "./data";

const emit = defineEmits(["handleSearch"]);

// 更多
const more = ref(false);
// 搜索
const search = ref({ ...defSearch });
// 分辨率
const resolution = ref({
  value: [],
  type: "atleast",
  custom: {
    width: "",
    height: "",
  },
});

// 重置
const handleReset = () => {
  search.value = { ...defSearch };
  resolution.value.value = [];
};
// 搜索
const handleSearch = () => {
  emit("handleSearch");
  more.value = false;
};
// 搜索筛选数据
const getSearch = () => {
  const returnSearch = JSON.parse(JSON.stringify(search.value));
  if (returnSearch.purity.length === 0) {
    returnSearch.purity = ["SFW"];
  } else {
    returnSearch.purity = returnSearch.purity.join(",");
  }

  let {
    value,
    type,
    custom: { width, height },
  } = resolution.value;

  if (type === "atleast") {
    returnSearch.atleast = value;
    if (/^[0-9]{1,}$/.test(width) && /^[0-9]{1,}$/.test(height)) {
      returnSearch.atleast = `${width}x${height}`;
    }
  } else if (type === "resolutions") {
    returnSearch.resolutions = "";
    if (/^[0-9]{1,}$/.test(width) && /^[0-9]{1,}$/.test(height)) {
      returnSearch.resolutions = `${width}x${height},`;
    }
    returnSearch.resolutions += value.join(",");
  }

  if (Array.isArray(search.value.ratios)) {
    returnSearch.ratios = returnSearch.ratios.join(",");
  }

  return { ...returnSearch };
};

defineExpose({
  getSearch,
});
</script>

<style lang="scss" scoped>
.search-wrapper-placeholder {
  margin: 10px 20px 0;
  height: 80px;
  position: relative;

  .search-wrapper {
    background-color: var(--searh-bg-color);
    width: calc(100% - 40px);
    padding: 14px;
    border-radius: 10px;
    position: absolute;
    z-index: 1;
    box-shadow: 5px 7px 7px 0px #00000047;

    .more-icon {
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
      margin-left: 10px;
      opacity: 0.6;

      i {
        font-size: 22px;
      }

      &:hover {
        color: var(--hover-font-color);
      }
    }

    &.hide {
      box-shadow: none;

      .search-more-wrapper {
        margin-bottom: 0;
      }

      :deep(.checkbox-radio-group.view .checkbox-radio-item) {
        margin-bottom: 0;
      }
    }

    .search-more-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      margin-left: 20px;
      position: absolute;
      right: 20px;
      top: 14px;
    }
  }

  .color-item {
    width: 60px;
    height: 30px;
    border-radius: 4px;

    &.active {
      background-image: url(@/assets/wallhaven/check.png);
      background-repeat: no-repeat;
      background-position: bottom right;
    }

    &.transparent {
      background: linear-gradient(
        18deg,
        rgba(255, 255, 255, 1) 42%,
        rgba(255, 0, 0, 1) 45%,
        rgba(255, 0, 0, 1) 55%,
        rgba(255, 255, 255, 1) 58%
      );
    }
  }
}
</style>
