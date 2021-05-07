/*
 * @Date: 2021-04-29 16:28:38
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-04-29 16:35:37
 * @FilePath: \sverp-front\src\api\pd.js
 */
import request from '@/utils/request'
import { stringify } from 'qs'

const pdApi = {
  getOrders: '/pd/getOrders',
  getCruInfo: '/pd/getCruInfo'
}

export function getOrders (params) {
  return request({
    url: pdApi.getOrders,
    method: 'post',
    data: stringify(params)
  })
}

export function getCruInfo () {
  return request({
    url: pdApi.getCruInfo,
    method: 'post'
  })
}
