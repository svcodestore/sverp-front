<!--
 * @Author: yanbuw1911
 * @Date: 2020-12-09 15:07:26
 * @LastEditTime: 2020-12-16 15:06:24
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\views\SYS\PrivilegeManagement\setting\index.vue
-->
<template>
  <div>
    <a-tabs defaultActiveKey="5" tabPosition="right">
      <a-tab-pane key="5" tab="用户权限">
        <usr-privilege></usr-privilege>
      </a-tab-pane>
      <a-tab-pane key="1" tab="操作 -> 菜单">
        <opet-menu></opet-menu>
      </a-tab-pane>
      <a-tab-pane key="2" tab="角色 -> 操作">
        <role-opet></role-opet>
      </a-tab-pane>
      <a-tab-pane key="3" tab="分组 -> 操作">
        <group-opet></group-opet>
      </a-tab-pane>
      <a-tab-pane key="4" tab="接口黑名单">
        <black-api></black-api>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import BlackApi from './blackApi.vue'
import GroupOpet from './groupOpet.vue'
import opetMenu from './opetMenu.vue'
import RoleOpet from './roleOpet.vue'
import UsrPrivilege from './usrPrivilege.vue'
export default {
  components: { opetMenu, RoleOpet, GroupOpet, BlackApi, UsrPrivilege }
}
</script>
