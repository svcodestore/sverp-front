<!--
 * @Author: yanbuw1911
 * @Date: 2021-06-02 09:33:45
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-06-03 11:16:59
 * @Description: Do not edit
 * @FilePath: /sverp-front/src/views/HRD/KPI/setting/JSTW_Commute/index.vue
-->
<template>
  <div>
    <a-tabs defaultActiveKey="1" tabPosition="right" type="card">
      <a-tab-pane key="1" tab="考勤代扣">
        <commute></commute>
      </a-tab-pane>
      <a-tab-pane key="2" tab="劳保设置">
        <insurance-setting></insurance-setting>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import commute from './commute.vue'
import InsuranceSetting from './insuranceSetting.vue'

export default {
  components: {
    commute,
    InsuranceSetting
  }
}
</script>
