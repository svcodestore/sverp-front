/*
 * @Author: yanbuw1911
 * @Date: 2020-10-27 17:02:14
 * @LastEditTime: 2020-12-31 09:54:38
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\store\modules\permission.js
 */
import { dynamicRoutesGenerator, sortRoutes, constantRouterMap } from '@/config/router.config'
import { getUserAuthMenu } from '@/api/user'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouterTree: [],
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_ROUTER_TREE: (state, routers) => {
      state.addRouterTree = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, usrPkid) {
      return new Promise(async (resolve, reject) => {
        await getUserAuthMenu(usrPkid)
          .then(result => {
            if (result.result) {
              commit('SET_ROUTERS', [])
              commit('SET_ROUTER_TREE', [])
              const menu = result.data
              commit('SET_ROUTERS', menu)
              const routes = []
              dynamicRoutesGenerator(menu, routes, 0)
              sortRoutes(routes)
              commit('SET_ROUTER_TREE', routes)

              resolve(routes)
            } else {
              reject(result.result)
            }
          })
          .catch(err => reject(err))
      })
    }
  }
}

export default permission
