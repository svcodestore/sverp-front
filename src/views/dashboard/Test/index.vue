<!--
 * @Author: yanbuw1911
 * @Date: 2021-05-11 16:40:03
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-05-11 16:47:57
 * @Description: Do not edit
 * @FilePath: /sverp-front/src/views/dashboard/Test/index.vue
-->
<template>
  <div>
    <a-tabs defaultActiveKey="1">
      <a-tab-pane key="1" tab="测试1">
        <test-1></test-1>
      </a-tab-pane>
      <a-tab-pane key="2" tab="测试2">
        <test-2></test-2>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Test1 from './Test1.vue'
import Test2 from './Test2.vue'
export default {
  components: { Test2, Test1 }
}
</script>
