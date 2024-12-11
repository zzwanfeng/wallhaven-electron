import axios from 'axios'


const request = axios.create({
  baseURL: 'https://wallhaven.cc/api/v1/',
  timeout: 60 * 1000,
  // transformResponse 允许自定义原始的响应数据（字符串）
  // transformResponse: [function (data) {
  //   try {
  //     // 如果转换成功则返回转换的数据结果
  //     // const json = jsonBig({ storeAsString: true })
  //     // return json.parse(data)

  //     return parse({
  //       storeAsString: true
  //     })(data, undefined)
  //   } catch (err) {
  //     // 如果转换失败，则包装为统一数据格式并返回
  //     return JSON.parse(data)
  //   }
  // }]
})



window.axiosPromiseArr = [] // axios中设置放置要取消的对象


// request interceptor
request.interceptors.request.use(config => {
  if (config.method === 'get') {
  }
  config.params = {
    t: Date.parse(new Date()) / 1000,
    ...config.params
  }

  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json'
  }

  if (config.url[0] !== '/') {
    config.url = '/' + config.url
  }

  config.cancelToken = new axios.CancelToken(cancel => {
    window.axiosPromiseArr.push({ cancel })
  })

  return config
}, error => {
  return Promise.reject(error)
})

// response interceptor
request.interceptors.response.use((response) => {
  if (Object.prototype.toString.call(response.data) === '[object Blob]') {
    return response
  } else {
    if (response.data && response.data.code) {
      response.data.code = +response.data.code
    }
    return response.data
  }
}, error => {
  if (error && error.response) {
    const { data: errorResponse } = error.response || {}
    const { code, msg, data } = errorResponse || {}
  } else if (error.code === 'ECONNABORTED') {
    // Message.error('请求超时,请稍后重试')
  }
  return Promise.reject(error.response)
})


export default request
