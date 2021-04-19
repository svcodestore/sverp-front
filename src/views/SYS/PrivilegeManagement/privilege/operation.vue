<!--
 * @Author: yanbuw1911
 * @Date: 2020-12-07 13:52:23
 * @LastEditTime: 2020-12-15 13:39:31
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\views\SYS\PrivilegeManagement\privilege\operation.vue
-->
<template>
  <div>
    <sv-grid v-bind="operateGridOptions" v-on="operateGridEvents"></sv-grid>
  </div>
</template>

<script>
import { getOperations, saveOperationOpt } from '@/api/privilege'
export default {
  data () {
    return {
      operateGridEvents: {
        refresh: this.getData
      },
      operateGridOptions: {
        loading: false,
        addItem: { defaultValue: { opet_status: 0 }, focusField: 'opet_code' },
        editConfig: { activeMethod: this.activeCellMethod },
        handleSaveOpt: saveOperationOpt,
        columns: [
          {
            field: 'opet_code',
            title: '代码',
            editRender: { name: 'input' }
          },
          {
            field: 'opet_name',
            title: '名称',
            editRender: { name: 'input' }
          },
          {
            field: 'opet_status',
            title: '状态',
            editRender: {
              name: '$select',
              options: [
                { value: 0, label: '停用' },
                { value: 1, label: '在用' }
              ]
            }
          },
          {
            field: 'opet_desc',
            title: '描述',
            editRender: { name: 'input' }
          },
          {
            field: 'opet_ramark',
            title: '备注',
            editRender: { name: 'input' }
          }
        ]
      }
    }
  },
  methods: {
    async getData () {
      this.operateGridOptions.loading = true
      await getOperations()
        .then(res => {
          const { result, data } = res
          result && (this.operateGridOptions.data = data)
        })
        .catch(() => {})
      this.operateGridOptions.loading = false
    },
    activeCellMethod ({ row, rowIndex, column }) {
      if (row.opet_code && column.property === 'opet_code' && !/^row_/.test(row.id)) {
        return false
      }
      return true
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
