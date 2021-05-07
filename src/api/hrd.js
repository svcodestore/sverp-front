/*
 * @Author: yanbuw1911
 * @Date: 2021-01-07 14:20:06
 * @LastEditTime: 2021-05-07 14:56:05
 * @LastEditors: Mok.CH
 * @Description:
 * @FilePath: \sverp-front\src\api\hrd.js
 */
import request from '@/utils/request'
import { stringify } from 'qs'

const hrdApi = {
  getMaterialCategory: '/hrd/getMaterialCategory',
  getMaterialList: '/hrd/getMaterialList',
  saveMaterialUsedOpt: '/hrd/saveMaterialUsedOpt',
  getOutboundOrder: '/hrd/getOutboundOrder',
  getIndividualOutboundOrder: '/hrd/getIndividualOutboundOrder',
  undoOutbound: '/hrd/undoOutbound',
  getOutboundMaterialList: '/hrd/getOutboundMaterialList',
  delOutboundMaterial: '/hrd/delOutboundMaterial',
  getMaterialLogListById: '/hrd/getMaterialLogListById',
  getMaterialLogListByUserid: '/hrd/getMaterialLogListByUserid',
  setMaterialStock: '/hrd/setMaterialStock',
  setOutboundMaterialOrder: '/hrd/setOutboundMaterialOrder',
  approveOutbound: '/hrd/approveOutbound',
  materialLogSoftDel: '/hrd/materialLogSoftDel',
  updateKpiInfoWorkers: '/hrd/updateKpiInfoWorkers',
  getKpiInfoWorkers: '/hrd/getKpiInfoWorkers'
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

export const getIndividualOutboundOrder = usrid =>
  request({
    url: hrdApi.getIndividualOutboundOrder,
    method: 'post',
    data: stringify({ usrid })
  })

export const undoOutbound = outboundId =>
  request({
    url: hrdApi.undoOutbound,
    method: 'post',
    data: stringify({ outboundId })
  })

export const getOutboundMaterialList = materialId =>
  request({
    url: hrdApi.getOutboundMaterialList,
    method: 'post',
    data: stringify({ materialId })
  })

export const delOutboundMaterial = id =>
  request({
    url: hrdApi.delOutboundMaterial,
    method: 'post',
    data: stringify({ id })
  })

export const getMaterialLogListById = materialId =>
  request({
    url: hrdApi.getMaterialLogListById,
    method: 'post',
    data: stringify({ materialId })
  })

export const getMaterialLogListByUserid = userid =>
  request({
    url: hrdApi.getMaterialLogListByUserid,
    method: 'post',
    data: stringify({ userid })
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

export const materialLogSoftDel = (id, materialId, oprtQty, usrid) =>
  request({
    url: hrdApi.materialLogSoftDel,
    method: 'post',
    data: stringify({ id, materialId, oprtQty, usrid })
  })

export const updateKpiInfoWorkers = kpiInfoWorkers =>
  request({
    url: hrdApi.updateKpiInfoWorkers,
    method: 'post',
    data: stringify(kpiInfoWorkers)
  })

export const getKpiInfoWorkers = () =>
  request({
    url: hrdApi.getKpiInfoWorkers,
    method: 'post'
  })
