/*
 * @Date: 2021-01-13 17:05:11
 * @LastEditors: yu chen
 * @LastEditTime: 2021-01-29 15:52:51
 * @FilePath: \sverp-front\src\api\chat.js
 */
import request from '@/utils/request'
import { stringify } from 'qs'
const chatApi = {
  apiChat: '/Chat/apiChat',
  apiChatRecord: '/Chat/apiChatRecord'
}
export function apiSendMsg (param) {
  return request({
    url: chatApi.apiChat,
    method: 'post',
    data: stringify(param)
  })
}
export function apiChatRecord (param) {
  return request({
    url: chatApi.apiChatRecord,
    method: 'post',
    data: stringify(param)
  })
}
