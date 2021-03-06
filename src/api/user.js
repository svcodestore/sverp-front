/*
 * @Author: yanbuw1911
 * @Date: 2020-11-09 13:05:23
 * @LastEditTime: 2021-05-11 15:03:22
 * @LastEditors: Mok.CH
 * @Description:
 * @FilePath: \sverp-front\src\api\user.js
 */
import request from '@/utils/request'
import { stringify } from 'qs'

const userApi = {
  getUserInfo: '/user/getUserInfo',
  getUserAuthMenu: '/user/getUserAuthMenu',
  getUserAuthInfo: '/user/getUserAuthInfo',
  getUserAuthAllInfo: '/user/getUserAuthAllInfo',
  saveUserOpt: '/user/saveUserOpt',
  getUsers: '/user/getUsers',
  getGroups: '/user/getGroups',
  saveUserRoleOpt: '/user/saveUserRoleOpt',
  saveUserGroupOpt: '/user/saveUserGroupOpt',
  getUsersByGroupCode: '/user/getUsersByGroupCode',
  getDepartments: '/user/getDepartments'
}

export const getUserInfo = usrid => {
  return request({
    url: userApi.getUserInfo,
    method: 'post',
    data: stringify({ usrid })
  })
}

export const getUserAuthMenu = usrPkid => {
  return request({
    url: userApi.getUserAuthMenu,
    method: 'post',
    data: stringify({ usrPkid })
  })
}

export const getUserAuthInfo = usrPkid => {
  return request({
    url: userApi.getUserAuthInfo,
    method: 'post',
    data: stringify({ usrPkid })
  })
}

export const getUserAuthAllInfo = usrPkid => {
  return request({
    url: userApi.getUserAuthAllInfo,
    method: 'post',
    data: stringify({ usrPkid })
  })
}

export const saveUserOpt = opt => {
  return request({
    url: userApi.saveUserOpt,
    method: 'post',
    data: stringify(opt)
  })
}

export const getUsers = () => {
  return request({
    url: userApi.getUsers,
    method: 'post'
  })
}

export const getGroups = () => {
  return request({
    url: userApi.getGroups,
    method: 'post'
  })
}

export const saveUserRoleOpt = opt =>
  request({
    url: userApi.saveUserRoleOpt,
    method: 'post',
    data: stringify(opt)
  })

export const saveUserGroupOpt = opt =>
  request({
    url: userApi.saveUserGroupOpt,
    method: 'post',
    data: stringify(opt)
  })

  export const getUsersByGroupCode = code => {
    return request({
      url: userApi.getUsersByGroupCode,
      method: 'post',
      data: stringify({ code })
    })
  }

  export const getDepartments = data => {
    return request({
      url: userApi.getDepartments,
      method: 'post',
      data: stringify(data)
    })
  }
