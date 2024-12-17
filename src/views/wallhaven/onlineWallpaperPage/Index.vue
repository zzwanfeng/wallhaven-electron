<template>
  <div class="page-component">
    <search-area ref="searchAreaRef" @handleSearch="handleSearch"></search-area>

    <img-list ref="imglist" :skeleton="skeleton" @loadMore="next"> </img-list>

    <div class="search-result">
      §(*￣▽￣*)§ 为您筛选出<span>{{ total }}</span
      >张壁纸
    </div>
  </div>
</template>

<script setup>
import SearchArea from "./compontens/SearchArea.vue";

import { wallhavenSearch } from "@/apis/wallhaven";
import { objToUrl } from "@/utils/util";

// 骨架屏
const skeleton = ref(true);
// 搜索区域
const searchAreaRef = ref("searchAreaRef");
// 图片列表
const imglist = ref("imglist");
// 页码
const page = ref(1);
// 总数
const total = ref(0);
// loading
const isLoading = ref(false);

// 刷新
const onRefresh = () => {
  searchArea.value.handleReset();
};

// 下一页
const next = async () => {
  if (!isLoading.value) {
    isLoading.value = true;
    await getlist().then(() => {
      isLoading.value = false;
    });
  }
};

// 搜索
const handleSearch = () => {
  page.value = 1;
  getlist(true);
};

// 列表
const getlist = (reset = false) => {
  return new Promise((resolve, reject) => {
    let search = searchAreaRef.value.getSearch();

    const params = {
      // ...objToUrl(search),
      ...search,
      page: page.value++,
    };

    // let apikey = this.$store.appConfig.get("apiKey");
    // if (apikey) {
    //   params.apikey = apikey;
    // }

    skeleton.value = true;
    imglist.value.handleReset(3);

    wallhavenSearch(params)
      .then((res) => {
        if (page.value === 2) {
          getlist();
        }

        let { data, meta } = res;
        imglist.value.add(data, reset);
        total.value = meta.total;
        skeleton.value = false;

        resolve();
      })
      .catch((err) => {
        console.log("err", err);
        skeleton.value = false;
        reject(err);
      });
  });
};

onMounted(() => {
  getlist();
});
</script>

<style lang="scss" scoped>
.page-component {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .search-result {
    text-align: center;
    margin-bottom: 10px;

    span {
      margin: 0 5px;
      color: var(--primary);
    }
  }
}
</style>
