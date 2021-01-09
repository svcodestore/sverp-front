<!--
 * @Author: yanbuw1911
 * @Date: 2021-01-07 10:27:28
 * @LastEditTime: 2021-01-07 16:47:51
 * @LastEditors: yanbuw1911
 * @Description: 前台物料管理
 * @FilePath: \client\src\views\HRD\MaterialManagement\index.vue
-->
<template>
  <div>
    <a-tabs defaultActiveKey="1">
      <a-tab-pane key="1" tab="商品管理">
        <material-used></material-used>
      </a-tab-pane>
      <a-tab-pane key="2" tab="庫存管理">
        <stock></stock>
      </a-tab-pane>
      <a-tab-pane key="3" tab="出庫/入庫">
        <storehouse></storehouse>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import materialUsed from './materialUsed/index'
import stock from './stock/index'
import storehouse from './storehouse/index'
export default {
  components: {
    materialUsed,
    stock,
    storehouse
  }
}
</script>
