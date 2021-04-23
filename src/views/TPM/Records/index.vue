<template>
  <div>
    <div v-show="isShowMain">
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
        <vxe-button style="margin:0;margin-right:10px" @click="printRecord">导出CSV</vxe-button>
      </div>
      <sv-grid ref="svGrid" v-bind="svGridOptions" v-on="svGridEvents" height="780">
        <template #show_date_time="{ row, column }">
          <span v-if="row[column.property].startsWith('1970-01')">无</span>
          <span v-else>{{ row[column.property] }}</span>
        </template>
        <template #show_op_btn="{ row }">
          <a-space size="small">
            <a-button size="small" @click="showDetail(row)" title="详情 添加维修进度" type="primary">打开</a-button>
          </a-space>
        </template>
      </sv-grid>
      <div style="display:block;color:red">{{ count }}</div>
    </div>
    <vxe-table
      v-show="csvShow"
      highlight-hover-row
      border="inner"
      ref="xTable1"
      height="300"
      :export-config="{}"
      :data="tableData1"
    >
      <vxe-table-column field="id" title="ID"></vxe-table-column>
      <vxe-table-column field="mechenum" title="设备编号"></vxe-table-column>
      <vxe-table-column field="mache_name" title="设备名称"></vxe-table-column>
      <vxe-table-column field="repairtime" title="维修/保养/调试时间"></vxe-table-column>
      <vxe-table-column field="alarmtime" title="警示时间"></vxe-table-column>
      <vxe-table-column field="reachtime" title="到场时间"></vxe-table-column>
      <vxe-table-column field="repaircontents" title="维修原因/保养内容"></vxe-table-column>
      <vxe-table-column field="repairmethod" title="处理方法/配件"></vxe-table-column>
      <vxe-table-column field="repairAttr" title="分类"></vxe-table-column>
      <vxe-table-column field="expendtime" title="耗时(分)"></vxe-table-column>
      <vxe-table-column field="repairman" title="维护员"></vxe-table-column>
    </vxe-table>

    <div v-show="isShowDetail">
      <RecordDetail :rowId="detailRowId" @show-main="showMain"></RecordDetail>
    </div>
  </div>
</template>
<script>
import { apiRepairList, apiSaveRepair } from '@/api/records'
import XEUtils from 'xe-utils'
import dayjs from 'dayjs'
import RecordDetail from './recordDetail'

export default {
  components: {
    RecordDetail
  },
  data () {
    return {
      isShowMain: true,
      isShowDetail: false,
      detailRowId: null,
      tableData1: null,
      csvShow: false,
      count: null,
      mechenum: null,
      repaircontents: null,
      repairDefineCount: 6,
      originColumns: [
        {
          field: 'id',
          title: 'ID',
          width: 60,
          sortable: true,
          fixed: 'left'
        },
        {
          field: 'mechenum',
          title: '设备编号',
          width: 90,
          fixed: 'left'
        },
        {
          field: 'mache_name',
          title: '设备名称',
          width: 110,
          fixed: 'left'
        },
        // {
        //   field: 'repairtime',
        //   title: '维修/保养/调试时间',
        //   // editRender: { name: 'input' },
        //   width: 170,
        //   sortable: true,
        //   slots: {
        //     default: 'show_date_time'
        //   },
        //   fixed: 'left'
        // },
        // {
        //   field: 'alarmtime',
        //   title: '警示时间',
        //   // editRender: { name: 'input' },
        //   width: 140,
        //   sortable: true,
        //   fixed: 'left'
        // },
        // {
        //   field: 'reachtime',
        //   title: '到场时间',
        //   // editRender: { name: 'input' },
        //   width: 140,
        //   slots: {
        //     default: 'show_date_time'
        //   },
        //   sortable: true
        // },
        {
          field: '',
          title: '最新流程/时间',
          width: 200,
          fixed: 'left',
          slots: {
            default: ({ row }) => {
              const alarmTime = new Date(row.alarmtime)
              const reachTime = new Date(row.reachtime)
              const repairTime = new Date(row.repairtime)
              if (alarmTime > reachTime && alarmTime > repairTime) {
                return [
                  <a-tag color="red">待处理 {row.alarmtime}</a-tag>
                ]
              } else if (reachTime > alarmTime && reachTime > repairTime) {
                return [
                  <a-tag color="orange">维修中 {row.reachtime} </a-tag>
                ]
              } else {
                return [
                  <a-tag color="green">已完成 {row.repairtime} </a-tag>
                ]
              }
            }
          }
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
          width: 70,
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
          title: '耗时',
          width: 138,
          sortable: true,
          slots: {
            default: ({ row }) => {
              if (row.expendtime === 0) {
                return '进行中'
              }
              const expendtime = parseInt(row.expendtime)
              const minDuration = 1
              const hourDuration = 60 * minDuration
              const dayDuration = 24 * hourDuration
              const days = parseInt(expendtime / dayDuration).toString()
              const hours = parseInt((expendtime % dayDuration) / hourDuration).toString()
              const min = parseInt((expendtime % hourDuration) / minDuration).toString()
              let retstr = ''
              if (days > 0) {
                retstr += days + '日' + hours + '小时' + min + '分钟'
              } else if (hours > 0) {
                retstr += hours + '小时' + min + '分钟'
              } else if (min > 0) {
                retstr += min + '分钟'
              } else {
                retstr = '不到一分钟'
              }
              return retstr
            }
          }
        },
        {
          field: 'repairman',
          title: '维护员',
          width: 90
        },
        {
          field: '',
          title: '操作',
          width: 120,
          slots: {
            default: 'show_op_btn'
          }
        }
      ],
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
        columns: []
      },
      svGridEvents: {
        refresh: this.refreshTable
      },
      searchLoading: false,
      showInfoTbl: false
    }
  },
  methods: {
    printRecord () {
      this.$refs.xTable1.exportData({ type: 'csv' })
    },
    async refreshTable () {
      this.svGridOptions.loading = true
      this.count = null
      await apiRepairList()
        .then(result => {
          if (result.code === 0) {
            this.tableData1 = result.data
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
            field: '',
            title: '界定次数',
            width: 90,
            slots: {
              default: ({ row }) => {
                return this.repairDefineCount
              }
            }
          },
          {
            field: '',
            title: '故障率',
            width: 120,
            slots: {
              default: ({ row }) => {
                return (((row.errCount / this.repairDefineCount).toFixed(2)) * 100).toString() + '%'
              }
            }
          }
        ]
      } else {
        this.count = null
        this.svGridOptions.columns = this.originColumns
      }
      const leftTime = dayjs(this.date.left).format('YYYY-MM')
      const rightTime = dayjs(this.date.right).format('YYYY-MM')
      const repaircontents = this.repaircontents
      const mechenum = this.mechenum
      this.svGridOptions.loading = true
      await apiRepairList({ leftTime, rightTime, error, mechenum, repaircontents })
        .then(result => {
          if (result.code === 0) {
            this.tableData1 = result.data
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
    },
    showMain () {
      this.isShowDetail = false
      this.isShowMain = true
      this.detailRowId = null
      this.refreshTable()
    },
    showDetail (row) {
      this.isShowMain = false
      this.isShowDetail = true
      this.detailRowId = row.id
    }
  },
  mounted () {
    this.refreshTable()
  },
  created () {
    this.svGridOptions.columns = this.originColumns
  }
}
</script>
