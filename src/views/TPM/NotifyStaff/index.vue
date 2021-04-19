<!--
 * @Date: 2021-01-18 09:16:25
 * @LastEditors: yu chen
 * @LastEditTime: 2021-01-21 15:38:42
 * @FilePath: \sverp-front\src\views\TPM\NotifyStaff\index.vue
-->
<template>
  <div>
    <sv-grid ref="svGrid" v-bind="svGridOptions" v-on="svGridEvents"> </sv-grid>
  </div>
</template>
<script>
import { apiNotify, apiSaveNotify } from '@/api/records'
import XEUtils from 'xe-utils'
export default {
  data () {
    return {
      svGridOptions: {
        loading: false,
        data: [],
        params: {
          originData: []
        },
        addItem: {
          defaultValue: {},
          focusField: 'id'
        },
        handleInsert: this.handleInsert,
        handleUpdate: this.handleUpdate,
        editConfig: {
          activeMethod: this.activeCellMethod
        },
        keyboardConfig: {
          editMethod: this.editMethod
        },
        handleSaveOpt: apiSaveNotify,
        columns: [
          {
            field: 'id',
            title: 'ID',
            width: 80,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'notify_name',
            title: '姓名',
            editRender: { name: 'input' },
            width: 110,
            fixed: 'left'
          },
          {
            field: 'notify_phone',
            title: '手机号',
            editRender: { name: 'input' },
            width: 110,
            fixed: 'left'
          },
          {
            field: 'notify_create_time',
            title: '时间',
            editRender: { name: 'input' },
            width: 110,
            fixed: 'left'
          },
          {
            field: 'notify_people',
            title: '是否通知',
            editRender: {
              name: '$select',
              options: [
                {
                  value: 1,
                  label: '否'
                },
                {
                  value: 2,
                  label: '是'
                }
              ]
            },
            width: 140,
            fixed: 'left'
          }
        ]
      },
      svGridEvents: {
        refresh: this.refreshTable
      },
      searchLoading: false,
      showInfoTbl: false
    }
  },
  methods: {
    async refreshTable () {
      this.svGridOptions.loading = true
      await apiNotify()
        .then(result => {
          if (result.code === 0) {
            this.svGridOptions.data = result.result.map(e => {
              const row = XEUtils.clone(e, true)
              return row
            })
            this.svGridOptions.params.originData = this.svGridOptions.data.map(e => XEUtils.clone(e))
          }
        })
        .catch(() => {})
      this.svGridOptions.loading = false
    }
  },
  mounted () {
    this.refreshTable()
  }
}
</script>
