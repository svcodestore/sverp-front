/*
 * @Author: yanbuw1911
 * @Date: 2020-10-27 17:02:14
 * @LastEditTime: 2021-05-10 09:45:48
 * @LastEditors: Mok.CH
 * @Description:
 * @FilePath: \sverp-front\src\store\modules\user.js
 */
import storage from 'store'
import { login } from '@/api/login'
import { getUserInfo, getUserAuthAllInfo } from '@/api/user'
import { ACCESS_TOKEN, LOGIN_ID, LOGIN_USER, BLACK_API_LIST } from '@/store/mutation-types'
// import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    dept: '',
    title: '',
    roles: [],
    info: {},
    menus: [],
    favPages: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_DEPT: (state, dept) => {
      state.dept = dept
    },
    SET_TITLE: (state, title) => {
      state.title = title
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_FAV_PAGES: (state, pages) => {
      state.favPages = pages
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise(async (resolve, reject) => {
        await login(userInfo)
          .then(response => {
            if (response.result) {
              const data = response.data

              storage.set(ACCESS_TOKEN, data.token, 24 * 60 * 60 * 1000)
              storage.set(LOGIN_ID, data.userinfo.id, 24 * 60 * 60 * 1000)
              storage.set(LOGIN_USER, data.userinfo.con_name, 24 * 60 * 60 * 1000)
              storage.set(BLACK_API_LIST, data.userinfo.black_api, 24 * 60 * 60 * 1000)

              commit('SET_TOKEN', data.token)
              commit('SET_NAME', { name: data.userinfo.con_name })
              commit('SET_DEPT', data.userinfo.con_dept)
              commit('SET_TITLE', data.userinfo.con_title)
              commit('SET_INFO', data.userinfo)
              commit('SET_AVATAR', 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png')

              // 获取权限
              getUserAuthAllInfo(data.userinfo.id).then(res => {
                commit('SET_ROLES', res.data)
              })

              resolve(data)
            } else {
              reject(response.result)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 登出
    Logout ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_DEPT', '')
        commit('SET_TITLE', '')
        commit('SET_ROUTERS', [])
        commit('SET_ROUTER_TREE', [])
        commit('SET_FAV_PAGES', [])
        commit('SET_AVATAR', '')
        commit('SET_ROLES', [])
        storage.remove(ACCESS_TOKEN)
        storage.remove(LOGIN_ID)
        storage.remove(LOGIN_USER)
        storage.remove(BLACK_API_LIST)
        resolve()
      })
    },
    // 添加常用界面
    AddFavPage ({ commit }, pages) {
      return new Promise(resolve => {
        commit('SET_FAV_PAGES', pages)
        resolve()
      })
    },
    SetProfile ({ commit }, id) {
      return new Promise(async (resolve, reject) => {
        await getUserInfo(id)
          .then(response => {
            const { result, data } = response
            if (result) {
              commit('SET_NAME', { name: data[0].con_name })
              commit('SET_DEPT', data[0].con_dept)
              commit('SET_TITLE', data[0].con_title)
              commit('SET_INFO', data[0])
              commit('SET_AVATAR', 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png')

              resolve(data[0])
            } else {
              reject(result)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default user
