/*
 * @Author: yanbuw1911
 * @Date: 2020-12-29 11:02:07
 * @LastEditTime: 2021-02-05 08:51:48
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: /sverp-front/src/api/mis.js
 */
import request from '@/utils/request'
import { stringify } from 'qs'

const misApi = {
  downloadClient: '/mis/downloadClient',
  sysUpdate: '/mis/sysUpdate'
}

export const downloadClient = platform =>
  request({
    url: misApi.downloadClient,
    method: 'post',
    responseType: 'blob',
    data: stringify({ platform })
  })

export const sysUpdate = () =>
  request({
    url: misApi.sysUpdate,
    method: 'post'
  })
