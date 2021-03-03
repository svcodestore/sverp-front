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
    <a-tabs defaultActiveKey="materialUsed" @change="refreshContent">
      <a-tab-pane key="materialUsed" tab="用料管理">
        <material-used ref="materialUsed"></material-used>
      </a-tab-pane>
      <a-tab-pane key="stock" tab="库存查询">
        <stock ref="stock"></stock>
      </a-tab-pane>
      <a-tab-pane key="storehouse" tab="出库/入库">
        <storehouse ref="storehouse"></storehouse>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import materialUsed from './materialUsed/index'
import stock from './stock/index'
import storehouse from './storehouse/index'
export default {
  methods: {
    async refreshContent (activeKey) {
      const ref = this.$refs[activeKey]
      ref && (await ref.getData())
    }
  },
  components: {
    materialUsed,
    stock,
    storehouse
  }
}
</script>
