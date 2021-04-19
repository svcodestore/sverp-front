<!--
 * @Date: 2021-04-15 07:53:23
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-04-19 15:41:41
 * @FilePath: \sverp-front\src\views\TPM\Fittings\index.vue
-->
<template>
  <div>
    <sv-grid ref="svGrid" v-bind="svGridOptions" v-on="svGridEvents" height="800" :row-style="rowStyle">
      <template #showStatus="column">
        <span v-html="column"></span>
      </template>
    </sv-grid>
  </div>
</template>

<script>
import { apiFitting, apiSaveFitting } from '@/api/records'
import XEUtils from 'xe-utils'
export default {
  data () {
    return {
      tableData1: [],
      svGridOptions: {
        title: '配件管理',
        loading: false,
        data: [],
        params: {
          originData: []
        },
        addItem: {
          defaultValue: {
            fitting_consume_num: 0
          },
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
        handleSaveOpt: apiSaveFitting,
        columns: [
          {
            field: 'id',
            title: 'ID',
            width: 80,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'fitting_name',
            title: '配件名称',
            editRender: { name: 'input' },
            fixed: 'left'
          },
          {
            field: 'fitting_num',
            title: '库存数量',
            width: 130,
            fixed: 'left',
            editRender: { name: 'input' }
          },
          {
            field: 'fitting_msg_number',
            title: '警示阈值',
            editRender: {
              name: 'input'
            },
            width: 170,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'fitting_msg_status',
            title: '警示状态',
            width: 140,
            sortable: true,
            slots: {
              default: ({ row }) => {
                if (row.fitting_msg_status === -1) {
                  return [
                    <span style="color:red">少于阈值</span>
                  ]
                } else {
                  return [
                    <span>正常</span>
                  ]
                }
              }
            },
            fixed: 'left'
          }
        ]
      },
      svGridEvents: {
        refresh: this.refreshTable
      }
    }
  },
  methods: {
    async refreshTable () {
      this.svGridOptions.loading = true
      await apiFitting()
        .then(result => {
          if (result.code === 0) {
            this.tableData1 = result.result
            this.svGridOptions.data = result.result.map(e => {
              const row = XEUtils.clone(e, true)
              // if (row.fitting_msg_status === 1) {
              //   row.fitting_msg_status = '正常'
              // } else {
              //   row.fitting_msg_status = '少于阈值'
              // }
              return row
            })
            this.svGridOptions.params.originData = this.svGridOptions.data.map(e => XEUtils.clone(e))
          }
        })
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
      return o
    },
    rowStyle: function (row) {
      console.log(row)
    }
  },
  mounted () {
    this.refreshTable()
  }
}
</script>
