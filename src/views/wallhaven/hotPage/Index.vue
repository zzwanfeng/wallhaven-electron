<template>
  <div class="page-component">
    <div v-for="item in l">
      <one-title :title="item.title"></one-title>
      <img-list-horizontal :list="list[item.type]"></img-list-horizontal>
    </div>
  </div>
</template>

<script setup>
import { wallhavenSearch } from "@/apis/wallhaven";
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
  const params = {
    sorting: type,
    order: "desc",
    categories: 111,
    purity: 110,
    page: 1,
  };
  wallhavenSearch(params).then((res) => {
    let { data, meta } = res;
    list.value[type] = Object.freeze(data);
  });
};
const onRefresh = () => {
  l.value.forEach((item) => {
    list.value[item.type] = [];
    getData(item.type);
  });
};

onMounted(() => {
  l.value.forEach((item) => getData(item.type));
});
</script>

<style lang="scss" scoped>
.page-component {
  padding: 0 20px 20px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;

  > div {
    padding: 10px 0;
    overflow: hidden;
  }
}
</style>
