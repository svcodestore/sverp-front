/*
 * @Author: yanbuw1911
 * @Date: 2020-10-27 17:02:14
 * @LastEditTime: 2020-11-23 10:59:13
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\utils\axios.js
 */
import qs from 'qs'

const VueAxios = {
  vm: {},
  // eslint-disable-next-line no-unused-vars
  install (Vue, instance) {
    if (this.installed) {
      return
    }
    this.installed = true

    if (!instance) {
      // eslint-disable-next-line no-console
      console.error('You have to install axios')
      return
    }

    Vue.axios = instance

    Object.defineProperties(Vue.prototype, {
      $axios: {
        get: function get () {
          return instance
        }
      },
      $http: {
        get: function get () {
          return instance
        }
      },
      $qs: {
        get: function get () {
          return qs
        }
      }
    })
  }
}

export { VueAxios }
