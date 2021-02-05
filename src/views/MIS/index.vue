<!--
 * @Author: yanbuw1911
 * @Date: 2020-12-09 19:48:29
 * @LastEditTime: 2021-02-05 08:56:03
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: /sverp-front/src/views/MIS/index.vue
-->
<template>
  <div>
    <a-tabs defaultActiveKey="1">
      <a-tab-pane key="1" tab="主页">
        <index></index>
      </a-tab-pane>
      <a-tab-pane key="2" tab="工具">
        <tools></tools>
      </a-tab-pane>
      <a-tab-pane key="3" tab="客户端下载">
        <client-download></client-download>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Index from './Index/'
import ClientDownload from './ClientDownload/'
import Tools from './Tools/'

export default {
  components: {
    ClientDownload,
    Tools,
    Index
  }
}
</script>
