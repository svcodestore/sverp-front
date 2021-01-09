<!--
 * @Author: yanbuw1911
 * @Date: 2020-12-09 19:48:29
 * @LastEditTime: 2020-12-31 13:39:20
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\views\MIS\index.vue
-->
<template>
  <div>
    <a-tabs defaultActiveKey="1">
      <a-tab-pane key="1" tab="主页"></a-tab-pane>
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
import ClientDownload from './ClientDownload/'
import Tools from './Tools/'

export default {
  components: {
    'client-download': ClientDownload,
    tools: Tools
  }
}
</script>
