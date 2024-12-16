import { SystemStore } from "@/store/modules/System";
import { getTime } from "@/utils/util";
// import { setWallpaper } from "@/libs/send";


export default function () {
  const SystemPinia = SystemStore();

  //查看
  const handleView = async (e, item) => {
    let { x, y } = e.target.getClientRects()[0]
    await SystemPinia.setNowImgView({ ...item, rect: { x, y } })
  }

  // 添加/移除 收藏状态
  const handleSetCollection = async (item, type) => {
    let message = "收藏成功";
    if (type === "add") {
      await SystemPinia.setCollectFiles(item, "add");
      message = "收藏成功";
    } else if (type === "remove") {
      await SystemPinia.setCollectFiles(item, "remove");
      message = "取消收藏";
    }

    ElMessage({
      message,
      type: "success",
      duration: 2000,
    });
  };

  // 获取收藏状态
  const getCollection = (id) => {
    let collections = SystemPinia?.getAllCollectFiles ?? [];
    const isShow =
      collections.length > 0 &&
      collections.findIndex((item) => id == item.id) !== -1;
    return isShow;
  }

  // 下载、设置壁纸
  const handleDownFile = async (data, isSetWallpaper = false) => {
    const item = JSON.parse(JSON.stringify(data)) || {}
    let { id, path: url, file_size: size, resolution, thumbs: { small } } = item;

    if (/^blob:/.test(url)) {
      const downPath = this.$store.appConfig.get('downloadPath');
      const name = `wallhaven-${id}${url.substr(url.lastIndexOf('.'))}`;
      const a = document.createElement("a")
      a.href = this.path
      a.download = name
      a.click()
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 3000)
      const path = downPath + '\\' + name
      this.$store.downDoneFiles.set(id, {
        id, resolution, size, small, url, downloadtime: getTime(), path
      })
      if (isSetWallpaper) {
        this.$message.success("壁纸设置中...");
        // setWallpaper(path).then(() => {
        //   this.$message.success("壁纸设置成功！");
        // })
      } else {
        this.$message.success("下载成功！");
      }
    } else {
      await SystemPinia.setDownFiles({ id, url, size, resolution, small, _img: item, isSetWallpaper });

      ElMessage({
        message: "已加入下载",
        type: "success",
        duration: 2000,
      });
    }
  }


  return {
    handleView,
    handleSetCollection,
    getCollection,
    handleDownFile,
  };
}
