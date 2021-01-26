<!--
 * @Author: yanbuw1911
 * @Date: 2020-11-16 16:51:26
 * @LastEditTime: 2021-01-22 09:57:47
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
        月看板
      </a-tab-pane>
      <a-tab-pane key="4" tab="日看板">
        日看板
      </a-tab-pane>
      <!-- <a-tab-pane key="5" tab="参数设置">
        <param-setting></param-setting>
      </a-tab-pane> -->
    </a-tabs>
  </div>
</template>

<script>
import prodSchd from './prodSchd'
import calendar from './calendar'
import paramSetting from './paramSetting'

export default {
  components: {
    'prod-schd': prodSchd,
    calendar: calendar,
    'param-setting': paramSetting
  }
}
</script>
