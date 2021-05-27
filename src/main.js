/*
 * @Author: yanbuw1911
 * @Date: 2020-10-27 17:02:14
 * @LastEditTime: 2021-05-27 09:03:10
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: /sverp-front/src/main.js
 */
// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // permission control
import './utils/filter' // global filter
import './global.less'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
// 自定义 vxetable 渲染器
// import VXETableEditExtend from './components/VxeTableExtend/autocomplete'
// VXETableEditExtend(VXETable)

VXETable.interceptor.add('event.clearActived', ({ $event }) => {
  // 比如点击了某个组件的弹出层面板之后，此时被激活单元格不应该被自动关闭，通过返回 false 可以阻止默认的行为。
  if ($event.target.className.indexOf('ant-select-dropdown-menu-item') > -1) {
    return false
  }
})
Vue.use(VXETable)
Vue.use(ElementUI)
// eslint-disable-next-line import/first
import SvComponents from '@/components/SV'
Vue.use(SvComponents)

Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
Vue.component('pro-layout', ProLayout)
Vue.component('page-header-wrapper', PageHeaderWrapper)

window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
