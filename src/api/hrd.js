/*
 * @Author: yanbuw1911
 * @Date: 2021-01-07 14:20:06
 * @LastEditTime: 2021-01-21 14:25:40
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\api\hrd.js
 */
import request from '@/utils/request'
import { stringify } from 'qs'

const hrdApi = {
  getMaterialCategory: '/hrd/getMaterialCategory',
  getMaterialList: '/hrd/getMaterialList',
  saveMaterialUsedOpt: '/hrd/saveMaterialUsedOpt',
  getOutboundOrder: '/hrd/getOutboundOrder',
  getOutboundMaterialList: '/hrd/getOutboundMaterialList',
  getMaterialLogList: '/hrd/getMaterialLogList',
  setMaterialStock: '/hrd/setMaterialStock',
  setOutboundMaterialOrder: '/hrd/setOutboundMaterialOrder',
  approveOutbound: '/hrd/approveOutbound'
}

export const getMaterialCategory = () =>
  request({
    url: hrdApi.getMaterialCategory,
    method: 'post'
  })

export const getMaterialList = (categoryId = '') =>
  request({
    url: hrdApi.getMaterialList,
    method: 'post',
    data: stringify({ categoryId })
  })

export const saveMaterialUsedOpt = opt =>
  request({
    url: hrdApi.saveMaterialUsedOpt,
    method: 'post',
    data: stringify(opt)
  })

export const getOutboundOrder = () =>
  request({
    url: hrdApi.getOutboundOrder,
    method: 'post'
  })

export const getOutboundMaterialList = materialId =>
  request({
    url: hrdApi.getOutboundMaterialList,
    method: 'post',
    data: stringify({ materialId })
  })

export const getMaterialLogList = materialId =>
  request({
    url: hrdApi.getMaterialLogList,
    method: 'post',
    data: stringify({ materialId })
  })

export const setMaterialStock = (data, usr) =>
  request({
    url: hrdApi.setMaterialStock,
    method: 'post',
    data: stringify({ data, usr })
  })

export const setOutboundMaterialOrder = (data, usr) =>
  request({
    url: hrdApi.setOutboundMaterialOrder,
    method: 'post',
    data: stringify({ data, usr })
  })

export const approveOutbound = data =>
  request({
    url: hrdApi.approveOutbound,
    method: 'post',
    data: stringify(data)
  })
