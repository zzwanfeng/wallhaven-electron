import request from "@/utils/request";

/**
 * 搜索列表
 * @param {String} 
 * @returns
 */
export function wallhavenSearch (params) {
  return request({
    url: 'search',
    method: 'get',
    params: params
  })
}