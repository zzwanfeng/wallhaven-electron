<template>
  <div class="checkbox-radio-group" :class="view">
    <div class="checkbox-radio-label" v-if="view === 'view'">
      <slot name="label">{{ label }}</slot>
    </div>

    <div class="checkbox-radio-value" v-if="view === 'view'">
      <div
        class="checkbox-radio-item"
        :class="{ active: isChecked(item) }"
        v-for="(item, index) in list"
        :key="index"
        @click="handleClick(item)"
        :style="{ width }"
      >
        <slot v-bind="{ color: item }">
          {{ item.label || item }}
        </slot>
      </div>
    </div>

    <template v-else>
      <div
        class="checkbox-radio-button"
        :class="{ active: isChecked(item) }"
        v-for="(item, index) in list"
        :key="index"
        @click="handleClick(item)"
      >
        {{ item.label || item }}
      </div>
    </template>
  </div>
</template>

<script setup>
const model = defineModel();

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  checked: {
    type: [Array, String],
    default: () => [],
  },
  view: {
    type: String,
    default: "view",
    validator: (value) => ["view", "button"].includes(value),
  },
  type: {
    type: String,
    default: "checkbox",
    validator: (value) => ["checkbox", "radio"].includes(value),
  },
  list: {
    type: Array,
    default: () => [],
  },
  width: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["update:modelValue"]);

// model: {
//   prop: "checked",
//   event: "change",
// },
watch(
  () => props.type,
  (newValue, oldValue) => {
    if (newValue) {
      if (newValue === "radio") {
        emit("change", "");
      } else {
        emit("change", []);
      }
    }
  }
);

const isChecked = (item) => {
  let val = item.value === undefined ? item : item.value;

  if (props.type === "radio") {
    console.log("model", model);
    return props.checked.toString() === val.toString();
  } else {
    let len = props.checked.length;
    return len === 0
      ? false
      : props.checked.findIndex((item) => item === val) > -1;
  }
};

const handleClick = (item) => {
  let val = item.value === undefined ? item : item.value;

  if (props.type === "radio") {
    console.log("1111");
    // emit("change", val);
    emit("update:modelValue", val);
  } else {
    let vals = props.checked.filter((v) => v !== val);
    if (vals.length === props.checked.length) {
      vals.push(val);
    }
    emit("change", vals);
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
