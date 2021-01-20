/*
 * @Author: yanbuw1911
 * @Date: 2020-10-27 17:02:14
 * @LastEditTime: 2021-01-20 10:40:49
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\utils\request.js
 */
import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const options = {
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 15000
}

const contentType = 'application/x-www-form-urlencoded'

// 创建 axios 实例
const request = axios.create(options)

request.defaults.headers.post['Content-Type'] = contentType

// 异常拦截处理器
const errorHandler = error => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    } else if (error.response.status === 401 && !data.result) {
      notification.error({
        message: '授权失败',
        description: (token && '登录已过期，请重新登陆') || '授权凭证已丢失，请重新登陆'
      })
      store.dispatch('Logout').then(() => {
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      })
    } else if (error.response.status === 500) {
      notification.error({
        message: error.response.status,
        description: error.response.statusText
      })
    }
  } else if (error.isAxiosError && error.response === void 0) {
    notification.error({
      message: '错误',
      description: '连接不上服务'
    })
  }

  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers.common['Access-Token'] = token
  }

  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use(response => {
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export { installer as VueAxios, request as axios }
