/*
 * @Date: 2021-05-08 16:53:20
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-05-10 09:39:05
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
