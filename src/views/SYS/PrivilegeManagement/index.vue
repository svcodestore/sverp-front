<!--
 * @Author: yanbuw1911
 * @Date: 2020-11-16 16:58:35
 * @LastEditTime: 2021-01-20 08:07:04
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\views\SYS\PrivilegeManagement\index.vue
-->
<template>
  <div>
    <a-tabs defaultActiveKey="1" type="card">
      <a-tab-pane key="1" tab="权限集合">
        <privilege></privilege>
      </a-tab-pane>
      <a-tab-pane key="2" tab="权限设置">
        <setting></setting>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import privilege from './privilege/'
import setting from './setting/'

export default {
  components: {
    privilege,
    setting
  }
}
</script>
