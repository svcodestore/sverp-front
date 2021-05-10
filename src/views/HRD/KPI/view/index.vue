<!--
 * @Author: yanbuw1911
 * @Date: 2021-04-29 08:33:06
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-05-08 13:30:16
 * @Description: Do not edit
 * @FilePath: /sverp-front/src/views/HRD/KPI/view/index.vue
-->
<template>
  <div>
    <a-tabs defaultActiveKey="2">
      <!-- <a-tab-pane key="1" tab="KPI 分布及分数"></a-tab-pane> -->
      <a-tab-pane key="2" tab="直接人员绩效">
        <direct-worker></direct-worker>
      </a-tab-pane>
      <a-tab-pane key="3" tab="查询统计分析"></a-tab-pane>
      <a-tab-pane key="4" tab="KPI 报表">
        <report></report>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import DirectWorker from './directWorker.vue'
import Report from './report.vue'

export default {
  components: {
    DirectWorker,
    Report
  }
}
</script>
