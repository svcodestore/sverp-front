/*
 * @Date: 2021-05-25 08:06:52
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-05-25 08:53:03
 * @FilePath: \sverp-front\src\api\order.js
 */
import request from '@/utils/request'
import { stringify } from 'qs'

const OrderApi = {
  getOrders: '/order/index'
}

export const getOrders = (data) => {
  return request({
    url: OrderApi.getOrders,
    method: 'post',
    data: stringify(data)
  })
}
