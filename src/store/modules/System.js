import { defineStore } from 'pinia'
import { downFile } from '@/libs/send'
import { getTime } from '@/utils/util'

export const SystemStore = defineStore('systemStore', {
  state () {
    return {
      systemConfig: {
        theme: 'light',//主题色
      },

      downFiles: [],//下载文件列表
      downDoneFiles: [],//已下载文件列表
      nowImgView: {},//当前展示图片
      collectFiles: []//收藏
    }
  },
  getters: {
    getSystemTheme (state) {
      return state.systemConfig.theme
    },

    getAllCollectFiles (state) {
      this.restCollectFiles()
      return state.collectFiles
    },
    getAllDownFiles (state) {
      this.restDownFiles()
      return state.downFiles
    },
    getAllDownDoneFiles (state) {
      this.restDownDoneFiles()
      return state.downDoneFiles
    }
  },
  actions: {
    // 设置主题
    setSystemTheme (value) {
      this.systemConfig.theme = value
    },

    // 增加 下载文件
    async setDownFiles (value) {
      let index = this.downFiles.findIndex(item => item.id === value.id);
      if (index === -1) {
        value.progress = 0;
        value.speedBytes = 0;
        value.state = 'wait';
        value.done = "downing";
        this.downFiles.splice(0, 0, value)
        downFile(value)
      }
      // todo  开发阶段先用缓存   后续修改
      window.localStorage.setItem('downFiles', JSON.stringify(this.downFiles))
    },
    // 删除 下载文件/任务
    async deleteDownFiles (value) {
      let index = this.downFiles.findIndex(item => item.id === value.id);
      if (index > -1) {
        this.downFiles.splice(index, 1)
      }
      // todo  开发阶段先用缓存   后续修改
      window.localStorage.setItem('downFiles', JSON.stringify(this.downFiles))
    },
    // 更新 下载 状态
    setDownState (data) {
      let { id, done, progress } = data;
      let index = this.downFiles.findIndex(item => item.id === id)
      if (done === 'end') {
        if (progress === 100) {
          console.log('progress', progress)
          let { id, path, resolution, size, small, url } = data
          this.downDoneFiles.splice(0, 0, { id, path, resolution, size, small, url, downloadtime: getTime() })
          if (index > -1) this.downFiles.splice(index, 1)
        }
      } else {
        if (index > -1) {
          this.downFiles[index] = data
        }
      }
      // todo  开发阶段先用缓存   后续修改
      window.localStorage.setItem('downFiles', JSON.stringify(this.downFiles))
      window.localStorage.setItem('downDoneFiles', JSON.stringify(this.downDoneFiles))
    },
    restDownFiles () {
      const getDownFiles = window.localStorage.getItem('downFiles')
      if (getDownFiles) {
        this.downFiles = JSON.parse(getDownFiles)
      }
    },
    // 设置已下载完成的列表
    async setDownDoneFiles (value, type) {
      if (type === 'add') {
        this.downDoneFiles.splice(0, 0, value)
      } else {
        let index = this.downDoneFiles.findIndex(item => item.id === value.id);
        if (index > -1) {
          this.downDoneFiles.splice(index, 1)
        }
      }

      // todo  开发阶段先用缓存   后续修改
      window.localStorage.setItem('downDoneFiles', JSON.stringify(this.downDoneFiles))
    },
    // pinia 刷新 已下载完成 列表
    restDownDoneFiles () {
      const getDownDoneFiles = window.localStorage.getItem('downDoneFiles')
      if (getDownDoneFiles) {
        this.downDoneFiles = JSON.parse(getDownDoneFiles)
      }
    },
    async setNowImgView (value) {
      this.nowImgView = value
    },
    restCollectFiles () {
      const getCollectFiles = window.localStorage.getItem('collectFiles')
      if (getCollectFiles) {
        this.collectFiles = JSON.parse(getCollectFiles)
      }
    },

    // 设置收藏数据
    async setCollectFiles (value, type) {
      if (type === 'add') {
        this.collectFiles.splice(0, 0, value)
      } else {
        let index = this.collectFiles.findIndex(item => item.id === value.id);
        if (index > -1) {
          this.collectFiles.splice(index, 1)
        }
      }
      // todo  开发阶段先用缓存   后续修改
      window.localStorage.setItem('collectFiles', JSON.stringify(this.collectFiles))
    },
  },
})
