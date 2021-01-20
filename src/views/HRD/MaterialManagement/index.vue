<!--
 * @Author: yanbuw1911
 * @Date: 2021-01-07 10:27:28
 * @LastEditTime: 2021-01-20 08:12:37
 * @LastEditors: yanbuw1911
 * @Description: 前台物料管理
 * @FilePath: \client\src\views\HRD\MaterialManagement\index.vue
-->
<template>
  <div>
    <a-tabs defaultActiveKey="1">
      <a-tab-pane key="1" tab="用料管理">
        <material-used></material-used>
      </a-tab-pane>
      <a-tab-pane key="2" tab="库存查询">
        <stock></stock>
      </a-tab-pane>
      <a-tab-pane key="3" tab="出库/入库">
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
