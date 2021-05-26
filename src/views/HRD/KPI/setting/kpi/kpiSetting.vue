<!--
 * @Author: yanbuw1911
 * @Date: 2021-05-13 09:51:42
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-05-26 09:28:01
 * @Description: Do not edit
 * @FilePath: /sverp-front/src/views/HRD/KPI/setting/kpi/kpiSetting.vue
-->
<template>
  <div>
    <sv-grid v-bind="gridOptions"></sv-grid>
  </div>
</template>

<script>
export default {
  data () {
    return {
      gridOptions: {
        align: 'center',
        columns: [
          {
            field: 'a1',
            title: 'KPI 项目'
          },
          {
            field: 'a2',
            title: 'KPI 名称'
          },
          {
            title: '使用单位',
            children: [
              {
                field: 'a4',
                title: '部门'
              },
              {
                field: 'a5',
                title: '小组'
              },
              {
                field: 'a6',
                title: '二级小组'
              },
              {
                field: 'a7',
                title: '三级小组'
              }
            ]
          }
        ]
      }
    }
  }
}
</script>
