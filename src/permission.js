/*
 * @Author: yanbuw1911
 * @Date: 2020-10-27 17:02:14
 * @LastEditTime: 2021-01-13 16:31:04
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\permission.js
 */
import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN, LOGIN_ID } from '@/store/mutation-types'
import { i18nRender } from '@/locales'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult'] // no redirect whitelist
const loginRoutePath = '/user/login'
const defaultRoutePath = '/dashboard/workplace'

router.beforeEach(async (to, from, next) => {
  NProgress.start() // start progress bar
  to.meta &&
    typeof to.meta.title !== 'undefined' &&
    setDocumentTitle(`${i18nRender(to.meta.title)} - ${i18nRender('SV')}`)

  /* has token */
  if (storage.get(ACCESS_TOKEN)) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      // 没有路由列表就向后台获取，解决界面刷新 vuex 内没有路由列表
      if (store.getters.addRouterTree.length === 0) {
        await store
          .dispatch('GenerateRoutes', storage.get(LOGIN_ID))
          .then(routes => {
            router.addRoutes(routes)

            // 请求带有 redirect 重定向时，登录自动重定向到该地址，如果页面重载则 to.path = '/404'
            const redirect = decodeURIComponent(
              from.query.redirect || (to.name === undefined ? to.redirectedFrom : to.path)
            )
            if (to.path === redirect) {
              // set the replace: true so the navigation will not leave a history record
              next({ ...to, replace: true })
            } else {
              // 跳转到目的路由
              next({ path: redirect })
            }
          })
          .catch(() => {
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            store.dispatch('Logout').then(() => {
              next({ path: loginRoutePath })
            })
          })
      } else {
        next()
      }
    }

    // 重新获取用户信息，处理刷新界面，vuex 中的数据丢失
    if (!store.getters.nickname) {
      store.dispatch('SetProfile', storage.get(LOGIN_ID))
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next(store.getters.addRouters)
    } else {
      notification.error({
        message: '授权失败',
        description: '授权凭证已丢失，请重新登陆'
      })
      store.dispatch('Logout').then(() => {
        next({ path: loginRoutePath })
      })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
