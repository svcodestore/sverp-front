/*
 * @Author: yanbuw1911
 * @Date: 2020-12-09 19:48:29
 * @LastEditTime: 2021-01-14 16:04:37
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
  rmUserFavirotePage: '/improve/rmUserFavirotePage',
  saveSoftRequireOpt: '/improve/saveSoftRequireOpt',
  setSoftwareRequireDayCheck: '/improve/setSoftwareRequireDayCheck',
  getDailyCheckList: '/improve/getDailyCheckList',
  auditRequire: '/improve/auditRequire'
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

export const saveSoftRequireOpt = opt =>
  request({
    url: improveApi.saveSoftRequireOpt,
    method: 'post',
    data: stringify(opt)
  })

export const setSoftwareRequireDayCheck = (softid, checker) =>
  request({
    url: improveApi.setSoftwareRequireDayCheck,
    method: 'post',
    data: stringify({ softid, checker })
  })

export const getDailyCheckList = softid =>
  request({
    url: improveApi.getDailyCheckList,
    method: 'post',
    data: stringify({ softid })
  })

export const auditRequire = (softid, usrid) =>
  request({
    url: improveApi.auditRequire,
    method: 'post',
    data: stringify({ softid, usrid })
  })
