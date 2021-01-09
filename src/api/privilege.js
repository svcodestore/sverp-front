/*
 * @Author: yanbuw1911
 * @Date: 2020-11-26 15:12:47
 * @LastEditTime: 2020-12-15 15:49:55
 * @LastEditors: yanbuw1911
 * @Description: 权限模块请求接口
 * @FilePath: \client\src\api\privilege.js
 */

import request from '@/utils/request'
import { stringify } from 'qs'

const privilegeApi = {
  getRoles: '/privilege/getRoles',
  saveRoleOpt: '/privilege/saveRoleOpt',
  getGroups: '/privilege/getGroups',
  saveGroupOpt: '/privilege/saveGroupOpt',
  getOperations: '/privilege/getOperations',
  saveOperationOpt: '/privilege/saveOperationOpt',
  getApiList: '/privilege/getApiList',
  getOpetMenuMap: '/privilege/getOpetMenuMap',
  saveOpetMenuMapOpt: '/privilege/saveOpetMenuMapOpt',
  getRoleOpetMap: '/privilege/getRoleOpetMap',
  saveRoleOpetMapOpt: '/privilege/saveRoleOpetMapOpt',
  getGroupOpetMap: '/privilege/getGroupOpetMap',
  saveGroupOpetMapOpt: '/privilege/saveGroupOpetMapOpt',
  getBlackApiList: '/privilege/getBlackApiList',
  saveBlackApiOpt: '/privilege/saveBlackApiOpt'
}

export const getRoles = () => {
  return request({
    url: privilegeApi.getRoles,
    method: 'post'
  })
}

export const saveRoleOpt = opt => {
  return request({
    url: privilegeApi.saveRoleOpt,
    method: 'post',
    data: stringify(opt)
  })
}

export const getGroups = () => {
  return request({
    url: privilegeApi.getGroups,
    method: 'post'
  })
}

export const saveGroupOpt = opt =>
  request({
    url: privilegeApi.saveGroupOpt,
    method: 'post',
    data: stringify(opt)
  })

export const getOperations = () => {
  return request({
    url: privilegeApi.getOperations,
    method: 'post'
  })
}

export const saveOperationOpt = opt =>
  request({
    url: privilegeApi.saveOperationOpt,
    method: 'post',
    data: stringify(opt)
  })

export const getApiList = () => {
  return request({
    url: privilegeApi.getApiList,
    method: 'post'
  })
}

export const getOpetMenuMap = () => {
  return request({
    url: privilegeApi.getOpetMenuMap,
    method: 'post'
  })
}

export const saveOpetMenuMapOpt = opt =>
  request({
    url: privilegeApi.saveOpetMenuMapOpt,
    method: 'post',
    data: stringify(opt)
  })

export const getRoleOpetMap = () => {
  return request({
    url: privilegeApi.getRoleOpetMap,
    method: 'post'
  })
}

export const saveRoleOpetMapOpt = opt =>
  request({
    url: privilegeApi.saveRoleOpetMapOpt,
    method: 'post',
    data: stringify(opt)
  })

export const getGroupOpetMap = () => {
  return request({
    url: privilegeApi.getGroupOpetMap,
    method: 'post'
  })
}

export const saveGroupOpetMapOpt = opt =>
  request({
    url: privilegeApi.saveGroupOpetMapOpt,
    method: 'post',
    data: stringify(opt)
  })

export const getBlackApiList = () => {
  return request({
    url: privilegeApi.getBlackApiList,
    method: 'post'
  })
}

export const saveBlackApiOpt = opt =>
  request({
    url: privilegeApi.saveBlackApiOpt,
    method: 'post',
    data: stringify(opt)
  })
