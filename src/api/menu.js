import request from '@/utils/request'
import { stringify } from 'qs'

const menuApi = {
  getAllMenuList: '/menu/getAllMenuList',
  saveMenuOpt: '/menu/saveMenuOpt'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function getAllMenuList () {
  return request({
    url: menuApi.getAllMenuList,
    method: 'post'
  })
}

export function saveMenuOpt (menuOpt) {
  return request({
    url: menuApi.saveMenuOpt,
    method: 'post',
    data: stringify({ menuOpt })
  })
}
