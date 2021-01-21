<!--
 * @Author: yanbuw1911
 * @Date: 2020-12-09 19:48:29
 * @LastEditTime: 2021-01-20 08:06:28
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\views\dashboard\SoftwareRequirement\index.vue
-->
<template>
  <div>
    <a-tabs defaultActiveKey="1" type="card">
      <a-tab-pane key="1" tab="提案">
        <data-show></data-show>
      </a-tab-pane>
      <!-- <a-tab-pane key="2" tab="图表">
        <visual-show></visual-show>
      </a-tab-pane> -->
    </a-tabs>
  </div>
</template>

<script>
import dataShow from './data'
// import visualShow from './visual'

export default {
  components: {
    'data-show': dataShow
    // 'visual-show': visualShow
  }
}
</script>
