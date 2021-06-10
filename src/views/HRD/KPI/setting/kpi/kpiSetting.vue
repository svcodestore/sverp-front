<!--
 * @Author: yanbuw1911
 * @Date: 2021-05-13 09:51:42
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-05-31 15:27:24
 * @Description: Do not edit
 * @FilePath: /sverp-front/src/views/HRD/KPI/setting/kpi/kpiSetting.vue
-->
<template>
  <div>
    <sv-grid v-bind="gridOptions" v-on="gridEvts"></sv-grid>
  </div>
</template>

<script>
import { getKpis, getDepts } from '@/api/hrd'

let groups = []

export default {
  data () {
    return {
      gridOptions: {
        loading: false,
        align: 'center',
        columns: []
      },
      gridEvts: {
        refresh: this.getData
      }
    }
  },
  methods: {
    async getData () {
      this.gridOptions.loading = true
      await getKpis().then(res => {
        this.gridOptions.data = res.data
      })
      this.gridOptions.loading = false
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    }
  },
  async beforeCreate () {
    await getDepts().then(({ result, data }) => {
      if (result) {
        groups = data
        console.log(data)
      }
    })
    this.gridOptions.columns = [
      {
        type: 'seq',
        width: 60
      },
      {
        field: 'hkh_kpi_code',
        title: 'KPI 项目',
        editRender: {
          name: '$input'
        }
      },
      {
        field: 'hkh_kpi_name',
        title: 'KPI 名称',
        editRender: {
          name: '$input'
        }
      },
      {
        title: '使用单位',
        children: [
          {
            field: 'hkh_kpi_dept',
            title: '部门',
            editRender: {
              name: '$select',
              options: groups
                .filter(e => e.id === 92 || e.pid === 92)
                .map(e => ({ label: e.cdw_name, value: e.cdw_code }))
            }
          },
          {
            field: 'hkh_kpi_group',
            title: '小组',
            editRender: {
              name: '$select',
              options: groups
                .filter(e => e.id === 92 || e.pid === 92)
                .map(e => ({ label: e.cdw_name, value: e.cdw_code }))
            }
          },
          {
            field: 'hkh_kpi_subgroup',
            title: '二级小组',
            editRender: {
              name: '$select',
              options: groups
                .filter(e => e.id === 92 || e.pid === 92)
                .map(e => ({ label: e.cdw_name, value: e.cdw_code }))
            }
          },
          {
            field: 'hkh_kpi_thirdgroup',
            title: '三级小组',
            editRender: {
              name: '$select',
              options: groups
                .filter(e => e.id === 92 || e.pid === 92)
                .map(e => ({ label: e.cdw_name, value: e.cdw_code }))
            }
          }
        ]
      }
    ]
  }
}
</script>
