<!--
 * @Author: yanbuw1911
 * @Date: 2021-05-13 09:51:42
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-05-18 16:00:41
 * @Description: Do not edit
 * @FilePath: /sverp-front/src/views/HRD/KPI/setting/kpi/kpiSetting.vue
-->
<template>
  <div>
    <vxe-table align="center" border>
      <vxe-table-column field="a1" title="KPI 项目"></vxe-table-column>
      <vxe-table-column field="a2" title="KPI 名称"></vxe-table-column>
      <vxe-table-colgroup field="a3" title="使用单位">
        <vxe-table-column field="a4" title="部门"></vxe-table-column>
        <vxe-table-column field="a5" title="小组"></vxe-table-column>
        <vxe-table-column field="a6" title="二级小组"></vxe-table-column>
        <vxe-table-column field="a7" title="三级小组"></vxe-table-column>
      </vxe-table-colgroup>
    </vxe-table>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>
