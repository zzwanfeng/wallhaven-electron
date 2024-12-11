<template>
  <div class="one-dialog-wrapper" v-if="visible" @click="close('mask')">
    <div @click.stop class="one-dialog one-border bottom" :style="{ width }">
      <div class="one-dialog-header">
        <div>
          <slot name="title">{{ title }}</slot>
        </div>
        <span class="one-btn iconfont icon-guanbi" @click="close"></span>
      </div>
      <div class="one-dialog-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import hotkeys from "hotkeys-js";

const props = defineProps({
  width: {
    type: String,
    default: 0,
  },
  title: {
    type: String,
    default: "",
  },
  visible: {
    type: Boolean,
    default: false,
  },
  appendToBody: {
    type: Boolean,
    default: false,
  },
  closeOnClickModal: {
    type: Boolean,
    default: true,
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["update:visible"]);

watch(
  () => props.visible,
  (newValue, oldValue) => {
    if (newValue) {
      if (props.closeOnPressEscape) {
        hotkeys("esc", close);
      }
      if (props.appendToBody) {
        document.body.appendChild(this.$el);
      }
    } else {
      hotkeys.unbind("esc", close);
    }
  }
);

const close = (type) => {
  if (type === "mask" && !props.closeOnClickModal) return;
  emit("update:visible", false);
};

onMounted(() => {
  if (this.visible) {
    if (this.closeOnPressEscape) hotkeys("esc", this.close);
    if (this.appendToBody) document.body.appendChild(this.$el);
  }
});

onDestroyed(() => {
  if (this.appendToBody && this.$el && this.$el.parentNode) {
    this.$el.parentNode.removeChild(this.$el);
  }
});
</script>

<style lang="scss" scoped>
.one-dialog-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  background: var(--mask-bg-color);
  z-index: 2000;

  .one-dialog {
    position: absolute;
    background-color: var(--dialog-bg-color);
    color: var(--dialog-font-color);
    min-width: 350px;
    left: 50%;
    top: 25%;
    transform: translate(-50%);
    box-shadow: var(--dialog-box-shadow);

    .one-dialog-header {
      font-size: 16px;
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .one-btn {
      cursor: pointer;

      &:hover {
        color: #38acfa;
      }
    }
  }
}
</style>
