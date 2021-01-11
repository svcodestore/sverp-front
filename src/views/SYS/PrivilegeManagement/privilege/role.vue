<!--
 * @Author: yanbuw1911
 * @Date: 2020-12-07 13:28:33
 * @LastEditTime: 2021-01-11 13:06:25
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\views\SYS\PrivilegeManagement\privilege\role.vue
-->
<template>
  <div>
    <sv-grid v-bind="roleGridOptions" v-on="roleGridEvents"></sv-grid>
  </div>
</template>

<script>
import { getRoles, saveRoleOpt } from '@/api/privilege'
export default {
  data () {
    return {
      roleGridOptions: {
        loading: false,
        data: [],
        addItem: {
          defaultValue: {
            role_status: 0,
            role_is_del: 1
          },
          focusField: 'role_code'
        },
        operatorFields: {
          creator: 'role_creator',
          modifier: 'role_modifier'
        },
        editConfig: {
          activeMethod: this.activeCellMethod
        },
        handleSaveOpt: saveRoleOpt,
        columns: [
          { field: 'id', title: 'ID', width: 50 },
          { field: 'role_code', title: '角色', width: 90, editRender: { name: 'input' }, sortable: true },
          { field: 'role_name', title: '名称', editRender: { name: 'input' }, sortable: true },
          {
            field: 'role_desc',
            title: '描述',
            editRender: { name: 'input' }
          },
          {
            field: 'role_remark',
            title: '备注',
            editRender: { name: 'input' }
          },
          {
            field: 'role_status',
            title: '状态',
            width: 90,
            editRender: {
              name: '$select',
              options: [
                { value: 0, label: '停用' },
                { value: 1, label: '在用' }
              ]
            }
          },
          {
            field: 'role_is_del',
            title: '允许删除',
            width: 115,
            editRender: {
              name: '$select',
              options: [
                { value: 0, label: '禁止' },
                { value: 1, label: '允许' }
              ]
            }
          },
          { field: 'role_creator', title: '创建者', width: 100 },
          { field: 'role_modifier', title: '修改者', width: 100 },
          { field: 'role_join_date', title: '创建时间', width: 160, sortable: true },
          { field: 'role_mod_date', title: '修改时间', width: 160, sortable: true }
        ]
      },
      roleGridEvents: {
        refresh: this.getData
      }
    }
  },
  methods: {
    async getData () {
      this.roleGridOptions.loading = true
      await getRoles()
        .then(res => {
          const { result, data } = res
          result && (this.roleGridOptions.data = data)
        })
        .catch(() => {})
      this.roleGridOptions.loading = false
    },
    activeCellMethod ({ row, rowIndex, column }) {
      if (row.role_code && column.property === 'role_code' && !/^row_/.test(row.id)) {
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
