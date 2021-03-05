/*
 * @Author: yanbuw1911
 * @Date: 2020-11-18 14:53:12
 * @LastEditTime: 2021-03-05 14:57:09
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: /sverp-front/src/api/prod.js
 */

import request from '@/utils/request'
import { stringify } from 'qs'

const prodApi = {
  getCalenderData: '/prod/getCalenderData',
  getProdSchdData: '/prod/getProdSchdData',
  syncProdSchdParam: '/prod/syncProdSchdParam',
  autoSchedule: '/prod/autoSchedule',
  getPrdSchdReport: '/prod/getPrdSchdReport',
  getPrdSchdParam: '/prod/getPrdSchdParam',
  saveCalenderOpt: '/prod/saveCalenderOpt',
  setWorktime: '/prod/setWorktime',
  getAutoSchdParam: '/prod/getAutoSchdParam',
  getProdItemSubphases: '/prod/getProdItemSubphases',
  inspectSchedule: '/prod/inspectSchedule'
}

/**
 * @description: 获取月行事历
 * @param {*} date 月份
 * @return {*}
 */
export const getCalenderData = date => {
  return request({
    url: prodApi.getCalenderData,
    method: 'post',
    data: stringify({ date })
  })
}

/**
 * @description: 获取生产排程数据
 * @param {*} prodLine 生产线
 * @param {*} date 生产日期 月份
 * @param {*} isScheduled 是否已排程
 * @return {*}
 */
export const getProdSchdData = (prodLine, date) => {
  return request({
    url: prodApi.getProdSchdData,
    method: 'post',
    data: stringify({
      prodLine,
      date
    })
  })
}

/**
 * @description: 从其它 ERP 系统数据库同步【生产排程】数据参数
 * @param {*} prodLine
 * @param {*} date
 * @return {*}
 */
export const syncProdSchdParam = (prodLine, date) => {
  return request({
    url: prodApi.syncProdSchdParam,
    method: 'post',
    data: stringify({
      prodLine,
      date
    })
  })
}

/**
 * @description: 执行自动排程
 * @param {*}
 * @return {*}
 */
export const autoSchedule = (prodLine, date, schdMode) => {
  return request({
    url: prodApi.autoSchedule,
    method: 'post',
    data: stringify({
      prodLine,
      date,
      schdMode
    })
  })
}

/**
 * @description: 获取自动排程所需要的数据：生产单，行事历，生产工序信息（耗时）
 * @param string prodLine 生产线
 * @param string date 日期
 * @return Promise
 */
export const getAutoSchdParam = (prodLine, date) => {
  return request({
    url: prodApi.getAutoSchdParam,
    method: 'post',
    data: stringify({
      prodLine,
      date
    })
  })
}

export const getPrdSchdReport = data => {
  return request({
    url: prodApi.getPrdSchdReport,
    method: 'post',
    responseType: 'blob',
    data: stringify(data)
  })
}

export const getPrdSchdParam = () => {
  return request({
    url: prodApi.getPrdSchdParam,
    method: 'post'
  })
}

export const saveCalenderOpt = opt => {
  return request({
    url: prodApi.saveCalenderOpt,
    method: 'post',
    data: stringify({ opt })
  })
}

export const setWorktime = timestr => {
  return request({
    url: prodApi.setWorktime,
    method: 'post',
    data: stringify({ timestr })
  })
}

export const inspectSchedule = param =>
  request({
    url: prodApi.inspectSchedule,
    method: 'post',
    data: stringify(param)
  })

export const getProdItemSubphases = (prdItem, phsid) =>
  request({
    url: prodApi.getProdItemSubphases,
    method: 'post',
    data: stringify({ prdItem, phsid })
  })
