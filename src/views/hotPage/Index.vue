<template>
  <!-- <div>
    <search-list
      :total="total"
      @search="handleSearch"
      :purity="search.purity"
      :sorting="search.sorting"
    ></search-list>

    <img-list :skeleton="skeleton" :list="list" @next="next"></img-list>
  </div> -->

  <div class="page-component">
    <div v-for="item in l">
      <one-title :title="item.title"></one-title>
      <img-list-horizontal :list="list[item.type]"></img-list-horizontal>
    </div>
  </div>
</template>

<script setup>
// import ImgList from "@/components/ImgList/Index.vue";
// import SearchList from "@/components/SearchList/Index.vue";
// import useImagePage from "@/hooks/useImagePage";

// let search = {
//   categories: "111",
//   purity: ["SFW"],
//   sorting: "hot",
// };

// const { skeleton, page, isLoading, list, total, next, handleSearch, getlist } =
//   useImagePage();

// getlist(search);

import ajax from "@/utils/request";
import { toRaw } from "vue";

const l = ref([
  {
    title: "最近更新",
    type: "date_added",
  },
  {
    title: "热榜",
    type: "hot",
  },
  {
    title: "收藏榜",
    type: "favorites",
  },
  {
    title: "查看榜",
    type: "views",
  },
]);
const list = ref({
  favorites: [],
  hot: [],
  views: [],
});

const getData = (type) => {
  return ajax(
    `search?sorting=${type}&order=desc&categories=111&purity=110&page=1`
  ).then((res) => {
    let { data, meta } = res;
    list.value[type] = Object.freeze(data);
    console.log("list", toRaw(list.value));
  });
};
const onRefresh = () => {
  l.value.forEach((item) => {
    list.value[item.type] = [];
    getData(item.type);
  });
};

onMounted(() => {
  console.log("111");
  l.value.forEach((item) => getData(item.type));

  // window.addEventListener("scroll", handlerScroll, true);
});
</script>

<style lang="scss" scoped>
.page-component {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 20px 20px;
  box-sizing: border-box;

  > div {
    height: 100%;
    overflow: hidden;
  }
}
</style>
