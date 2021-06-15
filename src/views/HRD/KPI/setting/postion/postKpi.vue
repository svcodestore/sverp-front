<!--
 * @Author: yanbuw1911
 * @Date: 2021-05-12 11:02:12
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-05-14 15:32:54
 * @Description: 职务 KPI
 * @FilePath: /sverp-front/src/views/HRD/KPI/setting/postion/postKpi.vue
-->
<template>
  <div>
    <sv-grid v-bind="gridOptions" v-on="gridEvents"></sv-grid>
  </div>
</template>

<script>
export default {
  data () {
    return {
      gridOptions: {
        loading: false,
        desc: '职位 KPI 表格',
        data: [],
        columns: [
          {
            field: '',
            title: '部门'
          },
          {
            field: '',
            title: '小组'
          },
          {
            field: '',
            title: '二级小组'
          },
          {
            field: '',
            title: '三级小组'
          },
          {
            field: '',
            title: '头衔'
          },
          {
            field: '',
            title: '头衔 KPI'
          },
          {
            field: '',
            title: '类别'
          },
          {
            field: '',
            title: '分数占比'
          }
        ]
      },
      gridEvents: {}
    }
  }
}
</script>
