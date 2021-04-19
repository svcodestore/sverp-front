/*
 * @Author: yanbuw1911
 * @Date: 2020-12-07 14:17:31
 * @LastEditTime: 2020-12-07 15:03:20
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\components\SV\index.js
 */
import SvGrid from './SvGrid/grid.vue'

export default {
  install: Vue => {
    Vue.component('sv-grid', SvGrid)
  }
}
