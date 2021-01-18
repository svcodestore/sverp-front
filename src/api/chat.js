/*
 * @Date: 2021-01-13 17:05:11
 * @LastEditors: yu chen
 * @LastEditTime: 2021-01-14 09:46:16
 * @FilePath: \webapp\src\api\chat.js
 */
import request from '@/utils/request'
import { stringify } from 'qs'
const chatApi = {
  apiChat: '/Chat/apiChat'
}
export function apiSendMsg (param) {
  return request({
    url: chatApi.apiChat,
    method: 'post',
    data: stringify(param)
  })
}
