/*
 * @Author: yanbuw1911
 * @Date: 2020-10-27 17:02:14
 * @LastEditTime: 2020-11-26 15:13:45
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\api\login.js
 */
import request from '@/utils/request'
import { stringify } from 'qs'

const loginApi = {
  Login: '/login/login'
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
export function login (parameter) {
  return request({
    url: loginApi.Login,
    method: 'post',
    data: stringify(parameter)
  })
}
