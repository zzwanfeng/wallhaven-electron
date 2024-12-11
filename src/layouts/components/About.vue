<template>
  <Dialog title="关于" width="500px" :visible.sync="show">
    <div class="about">
      《One Wallhaven》是一个由个人开发的桌面壁纸类程序。
      起初是由于站点（wallhaven.cc）经常无法使用以后，
      实在找不到自己喜欢的壁纸类网站和程序，于是决定自己写个，
      另外要申明一下，我并不会生产图片壁纸，
      本程序图片内容都来源于互联网(wallhaven.cc)，
      图片版权为原作者所有，若有侵权联系删除。
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from "./Dialog";

const show = ref(false);

const doToggle = () => {
  show.value = !show.value;
};
</script>

<style lang="scss" scoped>
.about {
  text-indent: 2em;
  padding: 0 1em 2em;
  line-height: 1.6;
  font-size: 14px;
  opacity: 0.7;
}
</style>
