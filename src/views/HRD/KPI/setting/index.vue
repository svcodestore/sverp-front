<!--
 * @Author: yanbuw1911
 * @Date: 2021-04-29 08:33:54
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-05-14 15:32:15
 * @Description: Do not edit
 * @FilePath: /sverp-front/src/views/HRD/KPI/setting/index.vue
-->
<template>
  <div>
    <a-tabs defaultActiveKey="1">
      <a-tab-pane key="1" tab="KPI 信息">
        <kpi></kpi>
      </a-tab-pane>
      <a-tab-pane key="2" tab="职务信息">
        <position></position>
      </a-tab-pane>
      <a-tab-pane key="3" tab="员工信息">
        <employee></employee>
      </a-tab-pane>
      <a-tab-pane key="4" tab="评分规则">
        <score-rule></score-rule>
      </a-tab-pane>
      <a-tab-pane key="5" tab="项目达成采集"></a-tab-pane>
      <a-tab-pane key="6" tab="个人分数采集"></a-tab-pane>
      <a-tab-pane key="7" tab="JSTW 核薪考勤代扣">
        <commute></commute>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import kpi from './kpi/'
import employee from './employee'
import position from './postion/'
import scoreRule from './scoreRule/'
import commute from './JSTW_Commute'
export default {
  components: {
    kpi,
    employee,
    position,
    scoreRule,
    commute
  }
}
</script>
