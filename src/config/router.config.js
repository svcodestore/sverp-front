/*
 * @Author: yanbuw1911
 * @Date: 2020-10-27 17:02:14
 * @LastEditTime: 2021-04-29 09:35:54
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: /sverp-front/src/config/router.config.js
 */
import { UserLayout, BasicLayout } from '@/layouts'
import { i18nRender } from '@/locales'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
export const dynamicRoutesGenerator = (list, tree, pid) => {
  // list在用户普通用户的时候，会有出现为object的现象，
  // 可能为后台程序输出数组非连续下标， 需判断list类型做转换
  if (typeof list === typeof {}) {
    const listarr = []
    for (const item of Object.entries(list)) {
      listarr.push(item[1])
    }
    list = listarr
  }

  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.pid === pid) {
      const childRoute = {
        seq: item.mnu_seq,
        path: item.mnu_path,
        name: item.mnu_path && i18nRender(item.mnu_code),
        component: item.mnu_component
          ? () => import(/* webpackChunkName: "[request]" */ `@/views/${item.mnu_component}`)
          : RouteView,
        // component: item.mnu_component ? resolve => require([`@/views/${item.mnu_component}`], resolve) : RouteView,
        meta: { title: item.mnu_code, keepAlive: true, icon: item.mnu_icon || null, id: item.id },
        children: []
      }

      if (pid === 0 && childRoute.children.length < 1 && item.mnu_code !== 'HOME') {
        childRoute.component = BasicLayout
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      dynamicRoutesGenerator(list, childRoute.children, item.id)
      // 删掉不存在 children 值的属性
      if (childRoute.children.length < 1) {
        delete childRoute.children
      }
      // 加入到树中
      tree.push(childRoute)
    }
  })
}

export const sortRoutes = routes => {
  routes.sort((a, b) => a.seq - b.seq)

  routes.forEach(item => {
    if (item.children && item.children.length > 1) {
      sortRoutes(item.children)
    }
  })
}

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      }
    ],
    meta: { title: 'login' }
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },
  {
    path: '/account',
    component: BasicLayout,
    redirect: '/account/center',
    name: 'account',
    meta: { title: 'PERSONAL_CENTER', icon: 'user', keepAlive: true },
    children: [
      {
        path: '/account/center',
        name: 'center',
        component: () => import('@/views/home/account/center'),
        meta: { title: 'PERSONAL_CENTER', keepAlive: true }
      },
      {
        path: '/account/settings',
        name: 'settings',
        component: () => import('@/views/home/account/settings/Index'),
        meta: { title: 'PERSONAL_SETTING', hideHeader: true },
        redirect: '/account/settings/base',
        hideChildrenInMenu: true,
        children: [
          {
            path: '/account/settings/base',
            name: 'BaseSettings',
            component: () => import('@/views/home/account/settings/BaseSetting'),
            meta: { title: 'PERSONAL_SETTING', hidden: true }
          }
          // {
          //   path: '/account/settings/security',
          //   name: 'SecuritySettings',
          //   component: () => import('@/views/home/account/settings/Security'),
          //   meta: { title: '安全设置', hidden: true, keepAlive: true }
          // },
          // {
          //   path: '/account/settings/custom',
          //   name: 'CustomSettings',
          //   component: () => import('@/views/home/account/settings/Custom'),
          //   meta: { title: '个性化设置', hidden: true, keepAlive: true }
          // },
          // {
          //   path: '/account/settings/binding',
          //   name: 'BindingSettings',
          //   component: () => import('@/views/home/account/settings/Binding'),
          //   meta: { title: '账户绑定', hidden: true, keepAlive: true }
          // },
          // {
          //   path: '/account/settings/notification',
          //   name: 'NotificationSettings',
          //   component: () => import('@/views/home/account/settings/Notification'),
          //   meta: { title: '新消息通知', hidden: true, keepAlive: true }
          // }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  },
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    redirect: '/home',
    meta: { title: 'menu.home' }
  }
]
