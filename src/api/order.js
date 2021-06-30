/*
 * @Date: 2021-05-25 08:06:52
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-06-30 13:02:37
 * @FilePath: /sverp-front/src/api/order.js
 */
import request from '@/utils/request'
import { stringify } from 'qs'

const OrderApi = {
  getOrders: '/order/index',
  getOrders2: '/order/getOrders'
}

export const getOrders = data => {
  return request({
    url: OrderApi.getOrders,
    method: 'post',
    data: stringify(data)
  })
}

export const getOrders2 = params =>
  request({
    url: OrderApi.getOrders2,
    method: 'post',
    data: stringify(params)
  })
