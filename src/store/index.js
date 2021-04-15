/*
 * @Date: 2021-01-18 09:16:25
 * @LastEditors: yu chen
 * @LastEditTime: 2021-02-04 09:20:58
 * @FilePath: \sverp-front\src\store\index.js
 */
import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

// default router permission control
import permission from './modules/permission'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },
  state: {
    userLists: '',
    userCounts: 0,
    responMsg: '',
    unReadCount: 0
  },
  mutations: {},
  actions: {},
  getters
})
