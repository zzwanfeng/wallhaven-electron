<template>
  <pageHeader :title="title"></pageHeader>

  <main id="main">
    <div class="info-box">
      <el-card class="info-card custom-card">
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;该软件开源免费，由个人开发，开发目的是因为觉得每次下载壁纸再手动去换太麻烦了，所以动手写了这个程序。
          该软件所有数据均来自网站（wallhaven.cc）的 api
          提供，如有侵权，请联系开发者删除。
        </p>
        <br />
        <p>
          开源地址：
          <span
            class="project-link"
            data-herf="https://github.com/chen/wallhaven-electron/tree/master-v2"
            @click="openLink"
            >Wallhaven</span
          >
        </p>
      </el-card>

      <el-card class="info-card custom-card qr-card">
        <h3>Good Job! 如果您觉得该软件不错，可以给作者一点小小的鼓励。</h3>

        <div class="qr-code-content">
          <div class="qr-card-item">
            <img class="qrcode" src="@/statics/img/wx.png" alt="" />
            <h3>赞赏二维码</h3>
          </div>
        </div>
      </el-card>

      <el-card class="update-log-card">
        <h3 style="text-align: center; font-size: larger">更新日志</h3>
        <div class="version-box">
          <el-timeline>
            <el-timeline-item
              v-for="(versionItem, i) in versions"
              class="custom-item"
              :timestamp="versionItem.releaseTime"
              placement="top"
            >
              <el-card class="update-log-item-card">
                <h3 class="custom-card-title">
                  Version {{ versionItem.version }}
                </h3>
                <ul class="fun-list">
                  <li v-for="(noteItem, x) in versionItem.notes">
                    {{ noteItem }}
                  </li>
                </ul>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-card>
    </div>
  </main>
</template>

<script>
import { ElTimeline, ElCard, ElTimelineItem } from "element-plus";
import { openLink } from "../statics/js/ipcRenderer";
import pageHeader from "../components/page-header.vue";
import axios from "axios";

export default {
  name: "setting",
  data() {
    return {
      title: "关于",
      versions: [
        {
          version: "2.0.0",
          releaseTime: "2024-11-28",
          notes: [
            "条件筛选壁纸",
            "在线查看壁纸",
            "一键设置壁纸",
            "下载任务列表",
            "在线定时切换壁纸",
            "本地文件夹切换壁纸",
            "多种壁纸自适应模式",
            "开机自启",
            "增加设置网络代理功能",
            "增加关键词搜索功能",
            "修复下载任务列表显示问题",
          ],
        },
        {
          version: "1.0.0",
          releaseTime: "2022-12-31",
          notes: ["条件筛选壁纸", "自动下载壁纸", "定时切换壁纸"],
        },
      ],
    };
  },
  components: {
    ElTimeline,
    ElCard,
    ElTimelineItem,
    pageHeader,
  },
  props: [],
  created() {},
  mounted() {},
  unmounted() {},
  methods: {
    openLink(event) {
      openLink(event.target.dataset.herf);
    },
  },
  watch: {},
};
</script>

<style>
#main {
  padding: 40px 10px 10px 10px;
}

.project-link:hover {
  color: #60f5d2;
}

.qr-card {
  margin-top: 20px;
  text-align: center;
}

.qr-code-content {
  margin-top: 20px;
  text-align: center;
}

.qr-card-item {
  display: inline-block;
  text-align: center;
  margin: 0 10px 0 20px;
}

.qrcode {
  width: 120px;
  height: 120px;
}

.fun-list li {
  font-size: 16px;
  margin-left: 20px;
  list-style-type: disc;
  line-height: 25px !important;
}

.custom-item div {
  color: #fff !important;
}

.custom-card {
  background-color: rgba(175, 174, 174, 0.5);
  border: none;
  color: #fff;
}

.update-log-card {
  background-color: rgba(175, 174, 174, 0.5);
  font-size: 16px;
  border: none;
  color: #fff;
  margin-top: 20px;
}

.update-log-item-card {
  border: none;
  background-color: #2d4060c7;
}

.custom-card h3 {
  padding: 0px !important;
  margin: 0px !important;
}

.custom-card > div {
  padding: 10px !important;
}

.info-box {
  margin-top: 30px;
  padding: 10px 80px;
}

.info-card {
  padding-top: 5px;
  font-size: 16px;
  user-select: text;
}

.info-card p {
  line-height: 25px !important;
  user-select: text;
}

.version-box {
  margin-top: 20px;
  padding: 0 80px;
}
</style>
