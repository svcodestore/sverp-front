<!--
 * @Author: yanbuw1911
 * @Date: 2020-12-07 13:50:25
 * @LastEditTime: 2021-01-07 16:08:09
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\views\SYS\PrivilegeManagement\privilege\group.vue
-->
<template>
  <div>
    <sv-grid v-bind="groupGridOptions" v-on="groupGridEvents"></sv-grid>
  </div>
</template>

<script>
import { getGroups, saveGroupOpt } from '@/api/privilege'
export default {
  data () {
    return {
      groupGridOptions: {
        loading: false,
        data: [],
        addItem: { defaultValue: { sgd_is_dept: 0 }, focusField: 'sgd_code' },
        editConfig: { activeMethod: this.activeCellMethod },
        handleSaveOpt: saveGroupOpt,
        columns: [
          {
            field: 'sgd_code',
            title: '组代码',
            editRender: { name: 'input' }
          },
          {
            field: 'sgd_name',
            title: '名称',
            editRender: { name: 'input' }
          },
          {
            field: 'sgd_alias',
            title: '别名',
            editRender: { name: 'input' }
          },
          {
            field: 'sgd_desc',
            title: '描述',
            editRender: { name: 'input' }
          },
          {
            field: 'sgd_is_dept',
            title: '部门',
            editRender: {
              name: '$select',
              options: [
                { value: 0, label: '否' },
                { value: 1, label: '是' }
              ]
            }
          },
          {
            field: 'sgd_status',
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
            field: 'sgd_remark',
            title: '备注',
            editRender: { name: 'input' }
          }
        ]
      },
      groupGridEvents: { refresh: this.getData }
    }
  },
  methods: {
    async getData () {
      this.groupGridOptions.loading = true
      await getGroups()
        .then(res => {
          const { result, data } = res
          result && (this.groupGridOptions.data = data)
        })
        .catch(() => {})
      this.groupGridOptions.loading = false
    },
    activeCellMethod ({ row, rowIndex, column }) {
      if (row.sgd_code && column.property === 'sgd_code' && !/^row_/.test(row.id)) {
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
