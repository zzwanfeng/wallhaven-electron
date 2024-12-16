/**
 * 获取时间 yyyy-MM-dd hh:mm:ss
 */
export const getTime = () => {
  let date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}


/**
* 存储单位换算 import { byte } from "@/utils/util";
* @param {*} bytes  
*/
export const byte = (bytes) => {
  if (bytes === 0) return '0 B';
  var k = 1000, // or 1024
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));

  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

/**
 * 获取图片数据
 * @param {*} url 文件地址
 * @param {*} timeout 超时时间
 */
export const getImgBlod = (url, timeout = 60000) => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";

    let timedout = false;
    let timer = setTimeout(function () {
      timedout = true;
      xhr.abort();
      reject('连接超时！！！')
    }, timeout);


    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (timedout) { return; }
      clearTimeout(timer);
      if (xhr.status === 200 || xhr.status === 304) {
        try {
          let blob = this.response;
          resolve(window.URL.createObjectURL(blob));
        }
        catch (error) {
          reject(xhr.responseText);
        }
      } else {
        reject(new Error(xhr.responseText));
      }
    };
    xhr.send();
  })
}


/**
* 防抖
* @param {*} fn 
* @param {*} wait 延迟时间 默认1秒
*/
export const debounce = (fn, wait = 1000) => {
  let timeout = null;
  return function (key, val) {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(key, val);
    }, wait);
  }
}

/**
* 获取 localStorage
* @param {*} key key
* @param {*} val 默认值
*/
export const getData = (key, val = []) => {
  let data = localStorage.getItem(key)
  if (data) {
    return JSON.parse(data)
  }
  return val;
}

/**
* 设置 localStorage
* @param {*} key key
* @param {*} val value
*/
export const setData = (key, val) => localStorage.setItem(key, JSON.stringify(val))


/**
* 获取收藏数据
*/
export const getImgCollection = () => getData('ImgCollection');

/**
* 更新收藏列表
* @param {*} arr 
*/
export const updImgCollection = (arr) => setData('ImgCollection', arr)


/**
* 获取下载数据
*/
export const getDownFiles = () => getData('DownFiles');

/**
* 更新下载列表
* @param {*} arr 
*/
const _updDownFiles = debounce(setData, 1000)
export const updDownFiles = (arr) => {
  _updDownFiles('DownFiles', arr)
}

/**
* 获取下载完成数据
*/
export const getDownDoneFiles = () => getData('DownDoneFiles');

/**
* 更新下载完成列表
* @param {*} arr 
*/
const _updDownDoneFiles = debounce(setData, 1000)
export const updDownDoneFiles = (arr) => _updDownDoneFiles('DownDoneFiles', arr)


/**
* obj 转 url
* @param {*} obj 
*/
export const objToUrl = (obj = {}) => {
  let str = "";
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key === "purity") {
        if (obj[key].length == 2) {
          str += `&${key}=111`;
        } else if (obj[key][0] === 'SFW') {
          str += `&${key}=100`;
        } else {
          str += `&${key}=010`;
        }
      } else if (obj[key] !== "") {
        str += `&${key}=${obj[key]}`;
      }
    }
  }
  return str
}

/**
 * 查找元素最小下标
 * @param {*} arr 
 * @returns 
 */
export const minValIndex = (arr = []) => {
  let val = Math.min(...arr);
  return arr.findIndex(i => i === val)
}

/**
 * 查找最大元素
 * @param {*} arr 
 * @returns 
 */
export const maxVal = (arr = []) => Math.max(...arr)

/**
 * 获取元素 Transform
 * @param {*} doms 
 * @returns 
 */
export const getTransforms = (doms) => {
  let map = new Map()
  doms.forEach((dom) => {
    map.set(dom.id, dom.style.transform)
  })
  return map
}

/**
 * 生成指定范围随机数
 * @param {*} n 
 * @param {*} m 
 * @returns 
 */
export const getRandom = (n, m) => Math.floor(Math.random() * (m - n + 1) + n)


/**
 * 生成空二维数组
 * @param {*} count 
 * @returns 
 */
export const toTwoDimensionalArray = (count, defval) => {
  let list = []
  for (let index = 0; index < count; index++) {
    if (defval === undefined) {
      list.push([])
    } else {
      list.push(defval)
    }
  }
  return list;
}


/**
* 图片宽高比适应
* @param {*} w 容器宽
* @param {*} h 容器高
* @param {*} r 图片宽高比
*/
export const aspectRatioToWH = (width, height, r, iw, ih) => {
  let _r = width / height;
  if (iw < width && ih < height) {
    return { width: iw, height: ih }
  }
  //容器宽度比 大=于 内容 宽高比  以高度为基准
  if (_r > r) {
    return {
      width: height * r, height
    }
  } else if (_r < r) {
    return {
      width, height: width / r
    }
  } else {
    return {
      width, height
    }
  }
}