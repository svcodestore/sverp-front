<!--
 * @Author: yanbuw1911
 * @Date: 2021-05-12 11:00:12
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-05-12 11:05:44
 * @Description: 职务信息
 * @FilePath: /sverp-front/src/views/HRD/KPI/setting/postion/index.vue
-->
<template>
  <div>
    <a-tabs defaultActiveKey="1" tabPosition="right">
      <a-tab-pane key="1" tab="职位 KPI">
        <post-kpi></post-kpi>
      </a-tab-pane>
      <a-tab-pane key="2" tab="职位设置">
        <post-setting></post-setting>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import PostKpi from './postKpi'
import PostSetting from './postSetting'
export default {
  components: {
    PostKpi,
    PostSetting
  }
}
</script>
