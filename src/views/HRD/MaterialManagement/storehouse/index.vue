<!--
 * @Author: yanbuw1911
 * @Date: 2021-01-07 16:41:45
 * @LastEditTime: 2021-01-20 10:38:25
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\views\HRD\MaterialManagement\storehouse\index.vue
-->
<template>
  <div>
    <a-tabs defaultActiveKey="1" tabPosition="right" type="card">
      <a-tab-pane key="1" tab="入库管理">
        <inbound></inbound>
      </a-tab-pane>
      <a-tab-pane key="2" tab="出库管理">
        <outbound></outbound>
      </a-tab-pane>
      <a-tab-pane key="3" tab="领料申请">
        <apply></apply>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Apply from './apply.vue'
import Inbound from './inbound.vue'
import Outbound from './outbound'
export default {
  components: {
    Outbound,
    Inbound,
    Apply
  }
}
</script>
