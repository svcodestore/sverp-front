<!--
 * @Author: yanbuw1911
 * @Date: 2020-11-16 16:51:26
 * @LastEditTime: 2021-01-27 10:55:41
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\views\PROD\AutoSchedule\index.vue
-->
<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="生产排程">
        <prod-schd></prod-schd>
      </a-tab-pane>
      <a-tab-pane key="2" tab="行事历">
        <calendar></calendar>
      </a-tab-pane>
      <a-tab-pane key="3" tab="月看板">
        <month-panel></month-panel>
      </a-tab-pane>
      <a-tab-pane key="4" tab="日看板">
        <day-panel></day-panel>
      </a-tab-pane>
      <!-- <a-tab-pane key="5" tab="参数设置">
        <param-setting></param-setting>
      </a-tab-pane> -->
    </a-tabs>
  </div>
</template>

<script>
import ProdSchd from './prodSchd'
import Calendar from './calendar'
import ParamSetting from './paramSetting'
import MonthPanel from './monthPanel.vue'
import DayPanel from './dayPanel.vue'

export default {
  components: {
    ProdSchd,
    Calendar,
    ParamSetting,
    MonthPanel,
    DayPanel
  }
}
</script>
