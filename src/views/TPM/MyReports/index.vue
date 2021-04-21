<!--
 * @Date: 2021-04-19 16:25:18
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-04-21 10:23:16
 * @FilePath: \sverp-front\src\views\TPM\MyReports\index.vue
-->
<template>
  <div>
    <div v-show="isShowMainList">
      <sv-grid ref="svGrid" v-bind="tableOptions" v-on="svGridEvents" height="800">
        <template #op="{ row }">
          <a-button v-show="row.reachtime.startsWith('1970-01')" type="primary" size="small" @click="showArrivedConfirm(row)">到场认证</a-button>
          <a-button size="small" @click="showDetail(row)">详细</a-button>
        </template>
      </sv-grid>
    </div>

    <div v-show="isShowArrivedConfirm">
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
      <vxe-button @click="showMainList" type="danger">返回</vxe-button>
      <span v-show="checkMsg" style="color:red;">验证错误</span>
      <!-- <span id="timeOutId" style="color:red;display:none">{{ timeOutMsg }}</span> -->
    </div>

    <div v-show="isShowDetail">

      <a-page-header
        title="维修详情"
        @back="showMainList"
      />
      <a-card :bordered="false">
        <a-descriptions title="维修进度详情">
          <a-descriptions-item label="ID">{{ detailRow.id }}</a-descriptions-item>
          <a-descriptions-item label="状态">{{ detailStatus }}</a-descriptions-item>
          <a-descriptions-item label="警示时间">{{ detailRow.alarmtime }}</a-descriptions-item>
          <a-descriptions-item label="维修人">{{ detailRow.repairman }}</a-descriptions-item>
          <a-descriptions-item label="报修内容">{{ detailRow.repaircontents }}</a-descriptions-item>
          <a-descriptions-item label="报修性质">{{ detailRow.repairAttr }}</a-descriptions-item>

        </a-descriptions>
        <a-divider style="margin-bottom: 32px"/>
        <a-descriptions title="设备信息">
          <a-descriptions-item label="设备名称">{{ detailRow.mache_name }}</a-descriptions-item>
          <a-descriptions-item label="设备编号">{{ detailRow.mechenum }}</a-descriptions-item>
          <a-descriptions-item label="设备管理者">{{ detailRow.keeper }}</a-descriptions-item>
          <a-descriptions-item label="设备线号">{{ detailRow.line_num }}</a-descriptions-item>
          <a-descriptions-item label="设备工程号">{{ detailRow.produc_num }}</a-descriptions-item>
          <a-descriptions-item label="设备当前状态">{{ macheStatusComput }}</a-descriptions-item>
        </a-descriptions>
        <a-divider style="margin-bottom: 32px"/>

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
import { apiRepairList, apiNotify, apiCheckCode, apiRepairDetail } from '@/api/records'
// import { apiMecheInfo, apiSendMsg, apiCheckCode, apiFitting, apiRepairComp, apiNotify } from '@/api/records'
import XEUtils from 'xe-utils'
// let timerSendMsg = null
export default {
  data () {
    return {
      isShowMainList: true,
      isShowArrivedConfirm: false,
      isShowDetail: false,
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
      detailRow: null,
      currentRow: null,
      timeOutMsg: '',
      checkMsg: false,
      arrivedData: {
        noticeName: null,
        phoneFour: null
      },
      notice: [],
      tableOptions: {
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
        // handleSaveOpt: apiSaveRepair,
        columns: [
          {
            field: 'id',
            title: 'ID',
            width: 70,
            fixed: 'left'
          },
          {
            field: 'mechenum',
            title: '设备编号'
          },
          {
            field: 'mache_name',
            title: '设备名称'
          },
          {
            field: 'alarmtime',
            title: '报修时间'
          },
          {
            field: '',
            title: '最新进度',
            slots: {
              default: ({ row }) => {
                if (row.reachtime.startsWith('1970-01')) {
                  return [
                    <span style="color:red">待处理</span>
                  ]
                } else if (row.repairtime.startsWith('1970-01')) {
                  return [
                    <span style="color:orange">处理中</span>
                  ]
                }

                if (row.repairstatus === 'true') {
                  return [
                    <span style="color:green">已处理</span>
                  ]
                }
              }
            }
          },
          {
            field: '',
            title: '操作',
            slots: {
              default: 'op'
            }
          }
        ]
      },
      svGridEvents: {
        refresh: this.refreshTable
      }
    }
  },
  methods: {
    async getData () {
      const reporterConId = this.$store.state.user.info.con_id
      await apiRepairList({ reporterConId }).then(result => {
        this.tableOptions.data = result.data.map(e => {
          const row = XEUtils.clone(e, true)
          return row
        })
        this.tableOptions.params.originData = this.tableOptions.data.map(e => XEUtils.clone(e))
        // this.tableOptions.data = result.data
        console.log(this.tableOptions.data)
      })
    },
    async getRepairDetail () {
      const recordId = this.detailRow.id
      await apiRepairDetail({ recordId }).then(result => {
        if (result.code === 0) {
          this.detailRow = result.data
        } else {
          this.$message.error('未能获取到数据')
        }
      })
    },
    showArrivedConfirm (row) {
      this.isShowMainList = false
      this.isShowDetail = false
      this.isShowArrivedConfirm = true
      this.currentRow = row
    },
    showDetail (row) {
      this.isShowArrivedConfirm = false
      this.isShowMainList = false
      this.isShowDetail = true
      this.detailRow = row
      console.log(this.detailRow)
      this.getRepairDetail()
    },
    showMainList () {
      this.isShowArrivedConfirm = false
      this.isShowMainList = true
      this.isShowDetail = false
      this.resetRows()
    },
    resetRows () {
      this.currentRow = this.originRow
      this.detailRow = this.originRow
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
              this.isShowMainList = true
              this.refreshTable()
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
    refreshTable () {
      this.getData()
    }
  },
  computed: {
    detailStatus () {
      if (this.detailRow === null || this.detailRow.id === null) return ''

      switch (true) {
        case this.detailRow.reachtime.startsWith('1970-01'):
          return '待处理'
        case this.detailRow.repairtime.startsWith('1970-01'):
          return '处理中'
        case this.detailRow.repairstatus === 'true':
          return '已完成'
        default:
          return '待处理'
      }
    },
    macheStatusComput () {
      switch (this.detailRow.status) {
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
    }
  },
  mounted () {
    this.getData()
    this.noticePeople()
    this.resetRows()
  },
  created () {
    this.resetRows()
  }
}
</script>
