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
      <a-page-header
        title="维修详情"
        @back="showMain"
      />
      <a-card :bordered="false">
        <a-descriptions title="维修进度详情">
          <a-descriptions-item label="ID">{{ currentRow.id }}</a-descriptions-item>
          <a-descriptions-item label="状态">{{ detailStatus }}</a-descriptions-item>
          <a-descriptions-item label="警示时间">{{ currentRow.alarmtime }}</a-descriptions-item>
          <a-descriptions-item label="维修人">{{ currentRow.repairman }}</a-descriptions-item>
          <a-descriptions-item label="报修内容">{{ currentRow.repaircontents }}</a-descriptions-item>
          <a-descriptions-item label="报修性质">{{ currentRow.repairAttr }}</a-descriptions-item>

        </a-descriptions>
        <a-divider style="margin-bottom: 32px"/>
        <a-descriptions title="设备信息">
          <a-descriptions-item label="设备名称">{{ currentRow.mache_name }}</a-descriptions-item>
          <a-descriptions-item label="设备编号">{{ currentRow.mechenum }}</a-descriptions-item>
          <a-descriptions-item label="设备管理者">{{ currentRow.keeper }}</a-descriptions-item>
          <a-descriptions-item label="设备线号">{{ currentRow.line_num }}</a-descriptions-item>
          <a-descriptions-item label="设备工程号">{{ currentRow.produc_num }}</a-descriptions-item>
          <a-descriptions-item label="设备当前状态">{{ macheStatusComput }}</a-descriptions-item>
        </a-descriptions>
        <a-divider style="margin-bottom: 32px"/>

        <div>
          <div class="title">维修进度</div>
          <div>
            <a-steps :current="repair_steps" :direction="isMobile && directionType.vertical || directionType.horizontal" progressDot>
              <a-step :title="$t('待处理')">
                <span style="font-size: 14px" slot="title">{{ $t('待处理') }}</span>
                <template slot="description">
                  <div style="fontSize: 12px; color: rgba(0, 0, 0, 0.45); position: relative; left: 42px;text-align: left;" slot="description" >
                    <div>{{ currentRow.alarmtime }}</div>
                  </div>
                </template>
              </a-step>
              <a-step :title="$t('处理中')">
                <span style="font-size: 14px" slot="title">{{ $t('处理中') }}</span>
                <template slot="description">
                  <div style="fontSize: 12px; color: rgba(0, 0, 0, 0.45); position: relative; left: 42px;text-align: left;" slot="description" >
                    <div>{{ currentRow.reachtime }}</div>
                  </div>
                </template>
              </a-step>
              <a-step :title="$t('完成处理')" >
                <span style="font-size: 14px" slot="title">{{ $t('完成处理') }}</span>
                <template slot="description">
                  <div style="fontSize: 12px; color: rgba(0, 0, 0, 0.45); position: relative; left: 42px;text-align: left;" slot="description" >
                    <div>{{ currentRow.repairtime }}</div>
                  </div>
                </template>
              </a-step>
            </a-steps>
          </div>
          <div v-show="repair_steps == 0">
            <div style="margin-top: 2rem;">
              <div class="title">确认到场</div>
              <vxe-select v-model="arrivedData.noticeName" class="notice" placeholder="请选择通知人" clearable>
                <vxe-option
                  v-for="(item, index) in notice"
                  :key="index"
                  :value="item.notify_phone"
                  :label="item.notify_name"
                ></vxe-option>
              </vxe-select>
              <vxe-input type="text" v-model="arrivedData.phoneFour" placeholder="请输入到场人手机号后四位"></vxe-input>
              <vxe-button style="margin-right:10px" @click="arrived()">维修人已到场</vxe-button>
              <span v-show="checkMsg" style="color:red;">验证错误</span>
            </div>
          </div>
          <div v-show="repair_steps == 1">
            <div style="margin-top:2rem;">
              <div class="title">维修记录填写</div>
              <vxe-input
                v-model="currentRow.repaircontents"
                class="fitting-public"
                style="width:356px"
                type="text"
                placeholder="请输入维修原因"
              />
            </div>
            <div style="margin-top:1rem;margin-bottom:1rem;">
              <a-textarea v-model="currentRow.repairmethod" style="width:356px"></a-textarea>
            </div>
            <div>
              有无消耗配件：
              <vxe-radio @change="fittingName()" name="isrow" content="有"></vxe-radio>
              <vxe-radio @change="fittingArr = null" name="isrow" content="无"></vxe-radio>
              <br />
              <div v-for="(item, index) in fittingArr" style="display:block;margin:10px 0px;" :key="index">
                <span>{{ item.fitting_name }} :</span>
                <input type="number" v-model="fittingNumber[item.id]" style="border-color:rgb(210,210,210);margin:0px 10px;" />
              </div>
              <vxe-button @click="repairSubmit" style="background:#1890ff;color:white;margin-top:1rem;">维修完成</vxe-button>
            </div>
          </div>
        </div>

        <!-- <div class="title">配件消耗</div>
        <s-table
          style="margin-bottom: 24px"
          row-key="key"
          :columns="scheduleColumns"
          :data="loadScheduleData">

          <template
            slot="status"
            slot-scope="status">
            <a-badge :status="status" :text="status | statusFilter"/>
          </template>

        </s-table> -->
      </a-card>
    </div>
  </div>
</template>
<script>
import { apiRepairList, apiSaveRepair, apiFitting, apiRepairComp, apiRepairDetail, apiNotify, apiCheckCode } from '@/api/records'
import XEUtils from 'xe-utils'
import dayjs from 'dayjs'

export default {
  data () {
    return {
      isShowMain: true,
      isShowDetail: false,
      isMobile: false,
      fittingArr: {},
      fittingNumber: [],
      notice: [],
      checkMsg: false,
      arrivedData: {
        noticeName: null,
        phoneFour: null
      },
      directionType: {
        horizontal: 'horizontal',
        vertical: 'vertical'
      },
      originRow: {
        alarmtime: null,
        create_time: null,
        dell_repair: null,
        id: null,
        keeper: null,
        line_num: null,
        mache_id: null,
        mache_name: null,
        mache_num: null,
        mechenum: null,
        produc_num: null,
        reachtime: null,
        repairAttr: null,
        repaircontents: null,
        repairman: null,
        repairman_con_id: null,
        repairmethod: null,
        repairstatus: null,
        repairtime: null,
        reporter_con_id: null,
        reporter_name: null,
        status: null
      },
      currentRow: null,
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
          title: '耗时(分)',
          width: 80,
          slots: {
            default: ({ row }) => {
              return row.expendtime.toFixed(2)
            }
          }
        },
        {
          field: 'repairman',
          title: '维护员',
          // editRender: { name: 'input' },
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
    async arrived () {
      this.showPeople = false
      this.checkMsg = false
      const phone = this.arrivedData.noticeName
      const phoneFour = this.arrivedData.phoneFour
      const newPhone = phone.substring(7, 11)
      const id = this.currentRow.id
      this.loading = true
      if (phoneFour !== newPhone) {
        this.checkMsg = true
      } else {
        // clearInterval(timerSendMsg)
        await apiCheckCode({ id, phone, phoneFour })
          .then(result => {
            if (result.code === 0) {
              // this.isShowMainList = true
              // this.refreshTable()
              this.showDetail(this.currentRow)
            }
          })
        this.loading = false
      }
    },
    async noticePeople () {
      await apiNotify()
        .then(result => {
          if (result.code === 0) {
            this.notice = result.result
          }
        })
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
    resetCurrentRow () {
      this.currentRow = this.originRow
    },
    showMain () {
      this.isShowDetail = false
      this.isShowMain = true
    },
    showDetail (row) {
      this.isShowMain = false
      this.isShowDetail = true
      const recordId = row.id
      apiRepairDetail({ recordId }).then(result => {
        if (result.code === 0) {
          this.currentRow = result.data
        } else {
          this.$message.error('未能获取到数据')
        }
      })
    },
    async fittingName () {
      await apiFitting()
        .then(result => {
          if (result.code === 0) {
            this.fittingArr = result.result
          }
        })
        .catch(() => {})
    },
    async repairSubmit () {
      const content = this.currentRow.repaircontents
      const action = this.currentRow.repairmethod
      const number = this.fittingNumber
      const id = this.currentRow.id
      await apiRepairComp({ id, content, action, number })
        .then(result => {
          if (result.code === 0) {
            this.isShowDetail = false
            this.resetCurrentRow()
            this.isShowMain = true
          } else {
            console.log(result.msg)
          }
        })
        .catch(() => {})
    }
  },
  computed: {
    detailStatus () {
      if (this.currentRow === null || this.currentRow.id === null) return ''

      switch (true) {
        case this.currentRow.reachtime.startsWith('1970-01'):
          return '待处理'
        case this.currentRow.repairtime.startsWith('1970-01'):
          return '处理中'
        case this.currentRow.repairstatus === 'true':
          return '已完成'
        default:
          return '待处理'
      }
    },
    macheStatusComput () {
      switch (this.currentRow.status) {
        case 1:
          return '正常'
        case 2:
          return '维修'
        case 3:
          return '保养'
        case 4:
          return '调试'
        case 5:
          return '停用'
        default:
          return '正常'
      }
    },
    repair_steps () {
      if (this.currentRow.reachtime === null) {
        return 0
      }
      if (this.currentRow.reachtime.startsWith('1970-01')) {
        return 0
      } else if (this.currentRow.repairtime.startsWith('1970-01')) {
        return 1
      } else {
        return 2
      }
    }
  },
  mounted () {
    this.refreshTable()
    this.noticePeople()
  },
  created () {
    this.svGridOptions.columns = this.originColumns
    this.resetCurrentRow()
  }
}
</script>
<style lang="less" scoped>
  .title {
    color: rgba(0,0,0,.85);
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }
</style>
