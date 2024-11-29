<template>
  <div class="update-log-card">
    <div class="version-box">
      <el-timeline>
        <el-timeline-item
          v-for="(versionItem, i) in updateLog"
          class="custom-item"
          :timestamp="versionItem.releaseTime"
          placement="top"
        >
          <el-card class="update-log-item-card">
            <h3 class="custom-card-title">Version {{ versionItem.version }}</h3>
            <ul class="fun-list">
              <li v-for="(noteItem, x) in versionItem.notes">
                {{ noteItem }}
              </li>
            </ul>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { updateLog } from "./Enum";

export default {
  name: "AboutPage",
  data() {
    return {
      updateLog,
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.update-log-card {
  margin-top: 20px;
  padding-top: 20px;
  height: 90%;
  overflow: hidden;
  background-color: rgba(175, 174, 174, 0.2);
  font-size: 16px;
  border: none;
  color: #fff;

  .version-box {
    margin-top: 20px;
    padding: 0 80px;
    overflow: auto;
    height: calc(100% - 100px);

    .custom-item {
      div {
        color: #fff !important;
      }

      .update-log-item-card {
        border: none;
        background-color: #2d4060c7;

        .fun-list {
          li {
            font-size: 16px;
            margin-left: 20px;
            list-style-type: disc;
            line-height: 25px !important;
          }
        }
      }
    }
  }
}
</style>
