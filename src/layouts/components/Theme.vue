<template>
  <OneDialog title="皮肤" width="400px" v-model:visible="show">
    <div class="theme-wrapper">
      <div v-for="(item, index) in themes" :key="index">
        <div
          @click="change(item)"
          :class="{ [item.type]: true, acitve: theme === item.type }"
        ></div>

        <div>{{ item.text }}</div>
      </div>
    </div>
  </OneDialog>
</template>

<script setup>
import OneDialog from "./Dialog";

import { SystemStore } from "@/store/modules/System";
import { toRaw } from "vue";

const SystemPinia = SystemStore();

const show = ref(false);
const theme = ref("");
const themes = ref([
  {
    type: "light",
    text: "经典白",
  },
  {
    type: "dark",
    text: "炫酷黑",
  },
]);

// 窗口操作
const doToggle = () => {
  show.value = !show.value;
};
// 改变主题
const change = async (item) => {
  if (theme.value !== item.type) {
    theme.value = item.type;
    await SystemPinia.setSystemTheme(item.type);
    document.documentElement.classList.toggle("dark");
  }
};

onMounted(() => {
  theme.value = toRaw(SystemPinia).getSystemTheme.value;
});

defineExpose({
  doToggle,
});
</script>

<style lang="scss" scoped>
.theme-wrapper {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 160px;
  text-align: center;
  line-height: 40px;

  .light {
    background-image: url(@/assets/layout/theme/light.png);
  }

  .dark {
    background-image: url(@/assets/layout/theme/dark.png);
  }

  .light,
  .dark {
    position: relative;
    width: 132px;
    height: 74px;
    border: 2px solid transparent;
    border-radius: 16px;
    cursor: pointer;
    overflow: hidden;

    &.acitve {
      border-color: #3da7fe;

      &::before {
        content: "";
        background-image: url(@/assets/layout/theme/check.png);
        width: 32px;
        height: 32px;
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
  }
}
</style>
