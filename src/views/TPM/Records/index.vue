<template>
  <div>
    <div style="padding:10px 0;">
      <vxe-input style="margin-right:10px" placeholder="请输入报修原因" v-model.trim="repaircontents"></vxe-input>
      <vxe-input style="margin-right:10px" placeholder="请输入设备编号" v-model.trim="mechenum"></vxe-input>
      <a-month-picker
        placeholder="维修开始时间"
        style="width: 160px"
        :disabled-date="disabledDate"
        v-model="date.left"
      />
      <span>--</span>
      <a-month-picker
        placeholder="维修结束时间"
        style="width: 160px"
        :disabled-date="disabledDate"
        v-model="date.right"
      />
      <vxe-button style="margin-right:10px" @click="getDate((err = 0))">查询</vxe-button>
      <vxe-button style="margin:0;margin-right:10px" @click="getDate((err = 1))">故障统计</vxe-button>
    </div>
    <sv-grid ref="svGrid" v-bind="svGridOptions" v-on="svGridEvents"> </sv-grid>
    <div style="display:block;color:red">{{ count }}</div>
  </div>
</template>
<script>
import { apiRepairList, apiSaveRepair } from '@/api/records'
import XEUtils from 'xe-utils'
import dayjs from 'dayjs'

export default {
  data () {
    return {
      count: null,
      mechenum: null,
      repaircontents: null,
      date: {
        right: null,
        left: null
      },
      svGridOptions: {
        loading: false,
        data: [],
        params: {
          originData: []
        },
        addItem: {
          defaultValue: {
            dell_repair: 0
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
        handleSaveOpt: apiSaveRepair,
        columns: [
          {
            field: 'id',
            title: 'ID',
            width: 80,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'mechenum',
            title: '设备编号',
            editRender: { name: 'input' },
            width: 110,
            fixed: 'left'
          },
          {
            field: 'mache_name',
            title: '设备名称',
            width: 130,
            fixed: 'left',
            editRender: {
              name: '$select',
              options: [
                {
                  value: '压花机',
                  label: '压花机'
                },
                {
                  value: '摇臂机',
                  label: '摇臂机'
                },
                {
                  value: '压光机',
                  label: '压光机'
                },
                {
                  value: '捅皮机',
                  label: '捅皮机'
                },
                {
                  value: '分条机',
                  label: '分条机'
                },
                {
                  value: '削边机',
                  label: '削边机'
                }
              ]
            }
          },
          {
            field: 'repairtime',
            title: '维修/保养/调试时间',
            editRender: {
              name: 'input'
            },
            width: 170,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'alarmtime',
            title: '警示时间',
            editRender: {
              name: 'input'
            },
            width: 140,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'reachtime',
            title: '到场时间',
            editRender: { name: 'input' },
            width: 140,
            sortable: true
          },
          {
            field: 'repaircontents',
            title: '维修原因/保养内容',
            width: 180,
            editRender: { name: 'input' }
          },
          {
            field: 'repairmethod',
            title: '处理方法/配件',
            width: 170,
            editRender: { name: 'input' }
          },
          {
            field: 'repairAttr',
            title: '分类',
            width: 100,
            editRender: {
              name: '$select',
              options: [
                {
                  value: '维修',
                  label: '维修'
                },
                {
                  value: '保养',
                  label: '保养'
                },
                {
                  value: '调试',
                  label: '调试'
                }
              ]
            }
          },
          {
            field: 'expendtime',
            title: '耗时(分)',
            editRender: { name: 'input' },
            width: 140
          },
          {
            field: 'repairman',
            title: '维护员',
            editRender: { name: 'input' },
            width: 90
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
      this.count = null
      this.svGridOptions.columns = [
        {
          field: 'id',
          title: 'ID',
          width: 80,
          sortable: true,
          fixed: 'left'
        },
        {
          field: 'mechenum',
          title: '设备编号',
          editRender: { name: 'input' },
          width: 110,
          fixed: 'left'
        },
        {
          field: 'mache_name',
          title: '设备名称',
          width: 100,
          fixed: 'left',
          editRender: {
            name: '$select',
            options: [
              {
                value: '压花机',
                label: '压花机'
              },
              {
                value: '摇臂机',
                label: '摇臂机'
              },
              {
                value: '压光机',
                label: '压光机'
              },
              {
                value: '捅皮机',
                label: '捅皮机'
              },
              {
                value: '分条机',
                label: '分条机'
              },
              {
                value: '削边机',
                label: '削边机'
              }
            ]
          }
        },
        {
          field: 'repairtime',
          title: '完成处理时间',
          editRender: {
            name: 'input'
          },
          width: 170,
          sortable: true,
          fixed: 'left'
        },
        {
          field: 'alarmtime',
          title: '警示时间',
          editRender: {
            name: 'input'
          },
          width: 140,
          sortable: true,
          fixed: 'left'
        },
        {
          field: 'reachtime',
          title: '到场时间',
          editRender: { name: 'input' },
          width: 140,
          sortable: true
        },
        {
          field: 'repaircontents',
          title: '维修原因/保养内容',
          width: 180,
          editRender: { name: 'input' }
        },
        {
          field: 'repairmethod',
          title: '处理方法/配件',
          width: 170,
          editRender: { name: 'input' }
        },
        {
          field: 'repairAttr',
          title: '分类',
          width: 80,
          editRender: {
            name: '$select',
            options: [
              {
                value: '维修',
                label: '维修'
              },
              {
                value: '保养',
                label: '保养'
              },
              {
                value: '调试',
                label: '调试'
              }
            ]
          }
        },
        {
          field: 'expendtime',
          title: '耗时(分)',
          editRender: { name: 'input' },
          width: 100
        },
        {
          field: 'repairman',
          title: '维护员',
          editRender: { name: 'input' },
          width: 90
        },
        {
          field: 'repairstatus',
          title: '是否处理',
          editRender: {
            name: '$select',
            options: [
              {
                value: 'true',
                label: '已处理'
              },
              {
                value: 'false',
                label: '未处理'
              }
            ]
          },
          width: 90
        }
      ]
      await apiRepairList()
        .then(result => {
          if (result.code === 0) {
            this.svGridOptions.data = result.data.map(e => {
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
        if (key === 'mache_name') {
          key = ''
        }
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
    disabledDate (current) {
      // 只能选择今年的过去现在月份
      return (
        current &&
        (current <
          dayjs()
            .add(-2, 'years')
            .endOf('year') ||
          current > dayjs().endOf('month'))
      )
    },
    async getDate (err) {
      const error = err
      if (error === 1) {
        this.svGridOptions.columns = [
          {
            field: 'id',
            title: 'ID',
            width: 80,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'mache_num',
            title: '设备编号',
            editRender: { name: 'input' },
            width: 120,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'mache_name',
            title: '设备名称',
            width: 120,
            fixed: 'left',
            sortable: true
          },
          {
            field: 'line_num',
            title: '线号',
            width: 120,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'produc_num',
            title: '工程号',
            width: 120,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'errCount',
            title: '维修次数',
            width: 170,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'create_time',
            title: '添加时间',
            editRender: {
              name: 'input'
            },
            width: 120,
            sortable: true,
            fixed: 'left'
          }
        ]
      } else {
        this.count = null
        this.svGridOptions.columns = [
          {
            field: 'id',
            title: 'ID',
            width: 80,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'mechenum',
            title: '设备编号',
            editRender: { name: 'input' },
            width: 110,
            fixed: 'left'
          },
          {
            field: 'mache_name',
            title: '设备名称',
            width: 100,
            fixed: 'left',
            editRender: {
              name: '$select',
              options: [
                {
                  value: '压花机',
                  label: '压花机'
                },
                {
                  value: '摇臂机',
                  label: '摇臂机'
                },
                {
                  value: '压光机',
                  label: '压光机'
                },
                {
                  value: '捅皮机',
                  label: '捅皮机'
                },
                {
                  value: '分条机',
                  label: '分条机'
                },
                {
                  value: '削边机',
                  label: '削边机'
                }
              ]
            }
          },
          {
            field: 'repairtime',
            title: '维修/保养/调试时间',
            editRender: {
              name: 'input'
            },
            width: 170,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'alarmtime',
            title: '警示时间',
            editRender: {
              name: 'input'
            },
            width: 140,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'reachtime',
            title: '到场时间',
            editRender: { name: 'input' },
            width: 140,
            sortable: true
          },
          {
            field: 'repaircontents',
            title: '维修原因/保养内容',
            width: 180,
            editRender: { name: 'input' }
          },
          {
            field: 'repairmethod',
            title: '处理方法/配件',
            width: 170,
            editRender: { name: 'input' }
          },
          {
            field: 'repairAttr',
            title: '分类',
            width: 80,
            editRender: {
              name: '$select',
              options: [
                {
                  value: '维修',
                  label: '维修'
                },
                {
                  value: '保养',
                  label: '保养'
                },
                {
                  value: '调试',
                  label: '调试'
                }
              ]
            }
          },
          {
            field: 'expendtime',
            title: '耗时(分)',
            editRender: { name: 'input' },
            width: 100
          },
          {
            field: 'repairman',
            title: '维护员',
            editRender: { name: 'input' },
            width: 90
          }
        ]
      }
      const leftTime = dayjs(this.date.left).format('YYYY-MM')
      const rightTime = dayjs(this.date.right).format('YYYY-MM')
      const repaircontents = this.repaircontents
      const mechenum = this.mechenum
      this.svGridOptions.loading = true
      await apiRepairList({ leftTime, rightTime, error, mechenum, repaircontents })
        .then(result => {
          if (result.code === 0) {
            if (result.count) {
              this.count = '总计维修次数：' + result.count
            }
            this.svGridOptions.data = result.data.map(e => {
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
