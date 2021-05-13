/*
 * @Author: yanbuw1911
 * @Date: 2020-12-29 11:02:07
 * @LastEditTime: 2021-05-13 08:06:22
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: /sverp-front/src/api/mis.js
 */
import request from '@/utils/request'
import { stringify } from 'qs'

const misApi = {
  downloadClient: '/mis/downloadClient',
  sysUpdate: '/mis/sysUpdate',
  startNodeWeb: '/mis/startNodeWeb',
  stopNodeWeb: '/mis/stopNodeWeb',
  restartNodeWeb: '/mis/restartNodeWeb'
}

export const downloadClient = platform =>
  request({
    url: misApi.downloadClient,
    method: 'post',
    responseType: 'blob',
    data: stringify({ platform })
  })
