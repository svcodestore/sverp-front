/*
 * @Date: 2021-05-06 14:14:27
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-05-14 08:47:32
 * @FilePath: \sverp-front\src\api\dcs.js
 */
import request from '@/utils/request'
import { stringify } from 'qs'

const DcsApi = {
  getPlan: '/dcs/getPlan',
  countPlan: '/dcs/countPlan',
  getUserPlan: '/dcs/getUserPlan',
  getDir: '/dcs/getDir',
  getFinishedPlan: '/dcs/getFinishedPlan',
  verify: '/dcs/verify',
  addPlan: '/dcs/addPlan',
  delPlan: '/dcs/delPlan',
  updatePlan: '/dcs/updatePlan',
  updatePlanAuth: '/dcs/updatePlanAuth',
  updatePlanCheck: '/dcs/updatePlanCheck',
  addPlanCheck: '/dcs/addPlanCheck',
  checkPass: '/dcs/checkPass',
  addPlanAuth: '/dcs/addPlanAuth',
  getFiles: '/dcs/getFiles',
  uploadFile: '/dcs/uploadFile',
  downloadFile: '/dcs/downloadFile',
  addRecord: '/dcs/addRecord',
  updateVersion: '/dcs/updateVersion',
  getFilesVersion: '/dcs/getFilesVersion',
  recordPDFShow: '/dcs/recordPDFShow'
}

export const getPlan = dirId => {
  return request({
    url: DcsApi.getPlan,
    method: 'post',
    data: stringify({ dirId: dirId })
  })
}

export const countPlan = dirId => {
  return request({
    url: DcsApi.countPlan,
    method: 'post',
    data: stringify({ dirId: dirId })
  })
}

export const getUserPlan = userId => {
  return request({
    url: DcsApi.getUserPlan,
    method: 'post',
    data: stringify({ userId: userId })
  })
}

export const getDir = () => {
  return request({
    url: DcsApi.getDir,
    method: 'post'
  })
}

export const getFinishedPlan = () => {
  return request({
    url: DcsApi.getFinishedPlan,
    method: 'post'
  })
}

export const verify = (planId, userId, index) => {
  return request({
    url: DcsApi.verify,
    method: 'post',
    data: stringify({ planId, userId, index })
  })
}

export const addPlan = data => {
  return request({
    url: DcsApi.addPlan,
    method: 'post',
    data: stringify(data)
  })
}

export const checkPass = data => {
  return request({
    url: DcsApi.checkPass,
    method: 'post',
    data: stringify(data)
  })
}

export const delPlan = id => {
  return request({
    url: DcsApi.delPlan,
    method: 'post',
    data: stringify({ id })
  })
}

export const updatePlan = data => {
  return request({
    url: DcsApi.updatePlan,
    method: 'post',
    data: stringify(data)
  })
}

export const updatePlanAuth = data => {
  return request({
    url: DcsApi.updatePlanAuth,
    method: 'post',
    data: stringify(data)
  })
}

export const updatePlanCheck = data => {
  return request({
    url: DcsApi.updatePlanCheck,
    method: 'post',
    data: stringify(data)
  })
}

export const addPlanCheck = data => {
  return request({
    url: DcsApi.addPlanCheck,
    method: 'post',
    data: stringify(data)
  })
}

export const addPlanAuth = data => {
  return request({
    url: DcsApi.addPlanAuth,
    method: 'post',
    data: stringify(data)
  })
}

export const getFiles = data => {
  return request({
    url: DcsApi.getFiles,
    method: 'post',
    data: stringify(data)
  })
}

export const uploadFile = data => {
  return request({
    url: DcsApi.uploadFile,
    method: 'post',
    data: data
  })
}

export const downloadFile = data => {
  return request({
    url: DcsApi.downloadFile,
    method: 'post',
    data: stringify(data),
    responseType: 'blob'
  })
}

export const addRecord = data => {
  return request({
    url: DcsApi.addRecord,
    method: 'post',
    data: stringify(data)
  })
}

export const updateVersion = data => {
  return request({
    url: DcsApi.updateVersion,
    method: 'post',
    data: data
  })
}

export const getFilesVersion = data => {
  return request({
    url: DcsApi.getFilesVersion,
    method: 'post',
    data: stringify(data)
  })
}

export const recordPDFShow = data => {
  return request({
    url: DcsApi.recordPDFShow,
    method: 'post',
    data: stringify(data)
  })
}

export default {
  getPlan,
  countPlan,
  getUserPlan,
  getDir,
  getFinishedPlan,
  verify,
  checkPass,
  delPlan,
  addPlan,
  updatePlan,
  updatePlanAuth,
  updatePlanCheck,
  addPlanCheck,
  addPlanAuth,
  getFiles,
  addRecord,
  updateVersion,
  downloadFile,
  getFilesVersion,
  uploadFile,
  recordPDFShow
}
