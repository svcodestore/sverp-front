/*
 * @Author: yanbuw1911
 * @Date: 2020-12-29 11:02:07
 * @LastEditTime: 2020-12-29 11:15:30
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\api\mis.js
 */
import request from '@/utils/request'
import { stringify } from 'qs'

const misApi = {
  downloadClient: '/mis/downloadClient'
}

export const downloadClient = platform =>
  request({
    url: misApi.downloadClient,
    method: 'post',
    responseType: 'blob',
    data: stringify({ platform })
  })
