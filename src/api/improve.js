/*
 * @Author: yanbuw1911
 * @Date: 2020-12-09 19:48:29
 * @LastEditTime: 2020-12-30 10:28:37
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\api\improve.js
 */
import request from '@/utils/request'
import { stringify } from 'qs'

const improveApi = {
  getSoftRequire: '/improve/getSoftRequire',
  getSoftRequireInitData: '/improve/getSoftRequireInitData',
  getUserFavoritePages: '/improve/getUserFavoritePages',
  setUserFavirotePage: '/improve/setUserFavirotePage',
  rmUserFavirotePage: '/improve/rmUserFavirotePage'
}

export const getSoftRequire = () => {
  return request({
    url: improveApi.getSoftRequire,
    method: 'post'
  })
}

export const getSoftRequireInitData = () => {
  return request({
    url: improveApi.getSoftRequireInitData,
    method: 'post'
  })
}

export const getUserFavoritePages = id =>
  request({
    url: improveApi.getUserFavoritePages,
    method: 'post',
    data: stringify({ id })
  })

export const setUserFavirotePage = (menuid, usrid) =>
  request({
    url: improveApi.setUserFavirotePage,
    method: 'post',
    data: stringify({ menuid, usrid })
  })

export const rmUserFavirotePage = (menuid, usrid) =>
  request({
    url: improveApi.rmUserFavirotePage,
    method: 'post',
    data: stringify({ menuid, usrid })
  })
