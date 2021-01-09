<template>
  <div>
    <a-tabs>
      <a-tab-pane key="1" tab="数据">
        <data-show></data-show>
      </a-tab-pane>
      <a-tab-pane key="2" tab="图表">
        <visual-show></visual-show>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import dataShow from './data'
import visualShow from './visual'

export default {
  components: {
    'data-show': dataShow,
    'visual-show': visualShow
  }
}
</script>
