/*
 * @Author: yanbuw1911
 * @Date: 2020-12-29 11:02:07
 * @LastEditTime: 2021-02-27 10:36:16
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

export const sysUpdate = () =>
  request({
    url: misApi.sysUpdate,
    method: 'post'
  })

export const startNodeWeb = () =>
  request({
    url: misApi.startNodeWeb,
    method: 'post'
  })

export const stopNodeWeb = () =>
  request({
    url: misApi.stopNodeWeb,
    method: 'post'
  })

export const restartNodeWeb = () =>
  request({
    url: misApi.restartNodeWeb,
    method: 'post'
  })
