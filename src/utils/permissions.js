/*
 * @Date: 2021-05-08 16:53:20
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-05-10 15:11:06
 * @FilePath: \sverp-front\src\utils\permissions.js
 */
import store from '@/store'

export function actionToObject (json) {
  try {
    return JSON.parse(json)
  } catch (e) {
    console.log('err', e.message)
  }
  return []
}

/**
 * 判断用户是否有某个角色权限
 * @param {string | Array} roleName
 * @returns boolean
 */
export const hasRole = (roleName) => {
  if (store.getters.roles.length > 0) {
    for (const role of store.getters.roles) {
      if (role.role === roleName || roleName.indexOf(role.role)) {
        return true
      }
    }
  }
  return false
}

/**
 * 判断用户是否在某个权限组
 * @param {String|Array} groupCode
 * @returns boolean
 */
export const isInGroup = (groupCode) => {
  if (store.getters.roles.length > 0) {
    for (const role of store.getters.roles) {
      if (role.group_code === groupCode || groupCode.indexOf(role.group_code)) {
        return true
      }
    }
  }
  return false
}
