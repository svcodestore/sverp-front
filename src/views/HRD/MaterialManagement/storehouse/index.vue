<!--
 * @Author: yanbuw1911
 * @Date: 2021-01-07 16:41:45
 * @LastEditTime: 2021-03-03 14:28:41
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: /sverp-front/src/views/HRD/MaterialManagement/storehouse/index.vue
-->
<template>
  <div>
    <a-tabs defaultActiveKey="inbound" tabPosition="right" type="card" @change="refreshContent">
      <a-tab-pane key="inbound" tab="入库管理">
        <inbound ref="inbound"></inbound>
      </a-tab-pane>
      <a-tab-pane key="outbound" tab="出库管理">
        <outbound ref="outbound"></outbound>
      </a-tab-pane>
      <a-tab-pane key="apply" tab="领料申请">
        <apply ref="apply"></apply>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Apply from './apply.vue'
import Inbound from './inbound.vue'
import Outbound from './outbound'
export default {
  methods: {
    async getData () {
      await this.refreshContent()
    },
    async refreshContent (activeKey = 'inbound') {
      const ref = this.$refs[activeKey]
      ref && (await ref.getData())
    }
  },
  components: {
    Outbound,
    Inbound,
    Apply
  }
}
</script>
