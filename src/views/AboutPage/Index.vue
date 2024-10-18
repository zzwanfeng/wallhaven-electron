<template>
  <!-- <pageHeader :title="title"></pageHeader> -->

  <div class="info-box">
    <el-card class="box-card">
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
          data-herf="https://github.com/zzwanfeng/wallhaven-electron"
          @click="openLink"
          >Wallhaven</span
        >
      </p>
    </el-card>

    <el-card class="box-card qr-card">
      <h3>Good Job! 如果您觉得该软件不错，可以给作者一点小小的鼓励。</h3>

      <div style="line-height: 40px">
        所有赞赏者将会永久展示在致谢名单中，为了保证您的昵称出现在在致谢名单上，赞赏时请备注上您的昵称。
      </div>

      <div class="qr-code-content">
        <div class="qr-card-item">
          <img class="qrcode" src="../../assets/about/wx.png" alt="" />
          <h3>赞赏二维码</h3>
        </div>
      </div>
    </el-card>

    <el-card class="box-card qr-card" v-if="acknowledgementList.length > 0">
      <h3 style="font-size: larger">致谢名单</h3>
      <div class="user-center">
        <div class="user-item item-center" v-for="user in acknowledgementList">
          <img
            :src="
              user.avatar !== undefined && user.avatar !== ''
                ? user.avatar
                : defaultAvatar
            "
            class="rounded-full user-avatar"
            loading="lazy"
          />
          {{ user.name }}
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { openLink } from "@/utils/ipcRenderer";
import { acknowledgementList, updateLog } from "./Enum";

export default {
  name: "AboutPage",
  data() {
    return {
      acknowledgementList,
      updateLog,
    };
  },
  mounted() {},
  methods: {
    openLink(event) {
      openLink(event.target.dataset.herf);
    },
  },
};
</script>

<style lang="scss" scoped>
.info-box {
  margin-top: 30px;
  padding: 10px 80px;

  .box-card {
    padding-top: 5px;
    font-size: 16px;
    user-select: text;
    background-color: rgba(175, 174, 174, 0.5);
    border: none;
    color: #fff;

    > div {
      padding: 10px !important;
    }

    h3 {
      padding: 0px !important;
      margin: 0px !important;
    }

    p {
      line-height: 25px !important;
      user-select: text;
    }

    .project-link:hover {
      color: #60f5d2;
    }
  }

  .qr-card {
    margin-top: 20px;
    text-align: center;

    .qr-code-content {
      margin-top: 20px;
      text-align: center;

      .qr-card-item {
        display: inline-block;
        text-align: center;
        margin: 0 10px 0 20px;

        .qrcode {
          width: 120px;
          height: 120px;
        }
      }
    }
  }
}

.user-center {
  padding: 20px 30px;
  line-height: 1.4;
  font-size: 16px;
  font-weight: 400;
}

.item-center {
  display: inline-flex;
  align-items: center;
  margin: 0 10px;
}

.rounded-full {
  border-radius: 9999px;
  width: 2rem;
  height: 2rem;
}

.user-avatar {
  margin-right: 3px;
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

.version-box {
  margin-top: 20px;
  padding: 0 80px;
}
</style>
