<!--
 * @Author: yanbuw1911
 * @Date: 2021-01-07 16:41:45
 * @LastEditTime: 2021-01-08 11:09:55
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\views\HRD\MaterialManagement\storehouse\index.vue
-->
<template>
  <div>
    <a-tabs defaultActiveKey="1" tabPosition="right">
      <a-tab-pane key="1" tab="入库"></a-tab-pane>
      <a-tab-pane key="2" tab="出库">
        <outbound></outbound>
      </a-tab-pane>
      <a-tab-pane key="3" tab="领料申请"></a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import outbound from './outbound'
export default {
  components: {
    outbound
  }
}
</script>
