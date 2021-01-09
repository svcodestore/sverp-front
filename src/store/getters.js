/*
 * @Author: yanbuw1911
 * @Date: 2020-12-09 19:48:29
 * @LastEditTime: 2020-12-30 11:10:26
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\store\getters.js
 */
const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  addRouterTree: state => state.permission.addRouterTree,
  multiTab: state => state.app.multiTab,
  menus: state => state.user.menus,
  favPages: state => state.user.favPages
}

export default getters
