<!--
 * @Author: yanbuw1911
 * @Date: 2020-11-26 14:55:28
 * @LastEditTime: 2020-12-09 15:02:41
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\views\SYS\PrivilegeManagement\privilege\index.vue
-->
<template>
  <div>
    <a-tabs defaultActiveKey="1" tabPosition="right">
      <a-tab-pane key="1" tab="角色">
        <role></role>
      </a-tab-pane>
      <a-tab-pane key="2" tab="分组">
        <group></group>
      </a-tab-pane>
      <a-tab-pane key="3" tab="操作">
        <operation></operation>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import role from './role'
import group from './group'
import operation from './operation'
export default {
  components: {
    role,
    group,
    operation
  }
}
</script>
