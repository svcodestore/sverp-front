<!--
 * @Author: yanbuw1911
 * @Date: 2020-12-09 19:48:29
 * @LastEditTime: 2021-01-28 14:47:09
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\views\dashboard\SoftwareRequirement\index.vue
-->
<template>
  <div>
    <a-tabs defaultActiveKey="1">
      <a-tab-pane key="1" tab="提案">
        <proposal></proposal>
      </a-tab-pane>
      <a-tab-pane key="2" tab="图表">
        <visual></visual>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Proposal from './proposal'
import Visual from './visual'

export default {
  components: {
    Proposal,
    Visual
  }
}
</script>
