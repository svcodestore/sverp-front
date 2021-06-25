<!--
 * @Author: yanbuw1911
 * @Date: 2021-05-13 09:12:55
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-05-13 09:44:36
 * @Description: 职级排名设置
 * @FilePath: /sverp-front/src/views/HRD/KPI/setting/postion/rankSetting.vue
-->
<template>
  <div>
    <sv-grid v-bind="gridOptions" v-on="gridEvents"></sv-grid>
  </div>
</template>

<script>
import { getRanks, saveRanksOpt } from '@/api/hrd'

export default {
  data () {
    return {
      gridOptions: {
        title: '职级设置',
        loading: false,
        data: [],
        handleSaveOpt: saveRanksOpt,
        addItem: {
          focusField: 'cpr_rank_code'
        },
        editRules: {
          cpr_rank_code: [
            { required: true, message: '职级代码必须填写' },
            { pattern: /^(J|M)(S|Y|T)[0-9]{1,2}$/, message: '格式不正确' }
          ],
          cpr_rank_name: [{ required: true, message: '职级代码必须填写' }]
        },
        columns: [
          {
            type: 'seq',
            width: 60
          },
          {
            field: 'cpr_rank_code',
            title: '职级代码',
            editRender: { name: 'input' },
            sortable: true
          },
          {
            field: 'cpr_rank_name',
            title: '职级名称',
            editRender: { name: 'input' },
            sortable: true
          }
        ]
      },
      gridEvents: {
        refresh: this.getData
      }
    }
  },
  methods: {
    async getData () {
      this.gridOptions.loading = true
      await getRanks().then(({ result, data }) => {
        result && (this.gridOptions.data = data)
      })
      this.gridOptions.loading = false
    }
  },
  async mounted () {
    await this.getData()
  }
}
</script>
