/*
 * @Date: 2021-05-06 14:14:27
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-05-07 16:17:40
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
  addPlan: '/dcs/addPlan'
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

export default {
  getPlan,
  countPlan,
  getUserPlan,
  getDir,
  getFinishedPlan,
  verify,
  addPlan
}
