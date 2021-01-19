/*
 * @Author: yu chen
 * @Date: 2020-12-07 14:44:49
 * @LastEditTime: 2021-01-18 14:21:21
 * @LastEditors: yu chen
 * @Description: In User Settings Edit
 * @FilePath: \sverp-front\src\api\records.js
 */
import request from '@/utils/request'
import { stringify } from 'qs'
const recordsApi = {
  apiRepairList: '/record/apiRepair',
  apiSaveRepair: '/record/apiSaveRepair',
  apiMecheInfo: '/record/apiMecheInfo',
  apiSaveMecheInfo: '/record/apiSaveMecheInfo',
  apiSendMsg: '/record/apiSendMsg',
  apiNotify: '/record/apiNotify',
  apiSaveNotify: '/record/apiSaveNotify',
  apiCheckCode: '/record/apiCheckCode',
  apiFitting: '/record/apiFitting',
  apiSaveFitting: '/record/apiSaveFitting'
}
export function apiRepairList (paramter = '') {
  return request({
    url: recordsApi.apiRepairList,
    method: 'post',
    data: stringify(paramter)
  })
}

export function apiSaveRepair (saveRepair) {
  return request({
    url: recordsApi.apiSaveRepair,
    method: 'post',
    data: stringify({ saveRepair })
  })
}
export function apiMecheInfo (parameter = '') {
  return request({
    url: recordsApi.apiMecheInfo,
    method: 'post',
    data: stringify(parameter)
  })
}
export function apiSaveMecheInfo (mecheParam) {
  return request({
    url: recordsApi.apiSaveMecheInfo,
    method: 'post',
    data: stringify({ mecheParam })
  })
}
export function apiCountError (parameter) {
  return request({
    url: recordsApi.apiCountError,
    method: 'post',
    data: stringify(parameter)
  })
}
export function apiSendMsg (param) {
  return request({
    url: recordsApi.apiSendMsg,
    method: 'post',
    data: stringify({ param })
  })
}
export function apiNotify (paramter = '') {
  return request({
    url: recordsApi.apiNotify,
    method: 'post',
    data: stringify(paramter)
  })
}
export function apiSaveNotify (saveNoticStaff) {
  return request({
    url: recordsApi.apiSaveNotify,
    method: 'post',
    data: stringify({ saveNoticStaff })
  })
}
export function apiCheckCode (paramter) {
  return request({
    url: recordsApi.apiCheckCode,
    method: 'post',
    data: stringify(paramter)
  })
}
export function apiFitting (paramter = '') {
  return request({
    url: recordsApi.apiFitting,
    method: 'post',
    data: stringify(paramter)
  })
}
export function apiSaveFitting (saveFittingList) {
  return request({
    url: recordsApi.apiSaveFitting,
    method: 'post',
    data: stringify({ saveFittingList })
  })
}
