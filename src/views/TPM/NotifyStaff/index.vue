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
    },
    editMethod ({ row, column }) {
      this.$refs.svGrid.setActiveCell(row, column.property)
      return false
    },
    activeCellMethod ({ row, rowIndex, column, columnIndex }) {
      if (row.id && column.property === 'id' && !/^row_/.test(row.id)) {
        return false
      }
      return true
    },
    handleUpdate: function (updateItem, columns, originData) {
      const originRecord = originData.find(e => e.id === updateItem.id)
      const updateFields = {}
      columns.forEach(key => {
        if (Array.isArray(updateItem[key])) {
          if (updateItem[key].toString() !== originRecord[key].toString()) {
            updateFields[key] = updateItem[key].join(',')
          }
        } else {
          if (updateItem[key] !== originRecord[key]) {
            updateFields[key] = updateItem[key]
          }
        }
      })
      return updateFields
    },
    handleInsert: function (insertItem) {
      const o = {}
      for (const key in insertItem) {
        if (Array.isArray(insertItem[key])) {
          o[key] = insertItem[key].join(',')
        } else {
          o[key] = insertItem[key]
        }
      }
      delete o.id
      return o
    }
  },
  mounted () {
    this.refreshTable()
  }
}
</script>
