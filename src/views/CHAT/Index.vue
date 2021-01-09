<!--
 * @Date: 2020-12-30 15:04:17
 * @LastEditors: yu chen
 * @LastEditTime: 2020-12-30 15:51:39
 * @FilePath: \webapp\src\views\CHAT\index.vue
-->
<template>
  <div>
    <a-tabs defaultActiveKey="1">
      <a-tab-pane key="1" tab="主页"></a-tab-pane>
      <a-tab-pane key="2" tab="聊天">
        <chat-index></chat-index>
      </a-tab-pane>
      <a-tab-pane key="3" tab="群聊">
        <group-chat></group-chat>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import chat from './Index/'
import GroupChat from './GroupChat/'
export default {
  components: {
    'chat-index': chat,
    'group-chat': GroupChat
  }
}
</script>
