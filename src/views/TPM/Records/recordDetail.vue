<!--
 * @Date: 2021-04-23 08:54:11
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-05-21 09:50:43
 * @FilePath: \sverp-front\src\views\TPM\Records\recordDetail.vue
-->
<template>
  <div>
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
        <!-- <a-descriptions-item label="设备当前状态">{{ macheStatusComput }}</a-descriptions-item> -->
      </a-descriptions>
      <a-divider style="margin-bottom: 32px"/>

      <div>
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
            <a-textarea v-model="currentRow.repairmethod" style="width:356px" placeholder="请填写维修跟进、维修方法.."></a-textarea>
          </div>
          <div>
            有无消耗配件/人工费用：
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
        <a-divider style="margin-bottom: 32px"/>
        <div class="title">维修进度</div>
        <div>
          <a-steps :current="repair_steps" direction="horizontal" progressDot>
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
          <a-divider style="margin-bottom: 32px"/>
          <div style="margin-top:2rem;">
            <div class="title">配件消耗</div>
            <div>
              <fittingTable :recordId="currentRow.id"></fittingTable>
            </div>
          </div>
        </div>

      </div>
    </a-card>
  </div>
</template>
<script>
import fittingTable from './fettingUsed'
import { apiFitting, apiRepairComp, apiNotify, apiCheckCode, apiRepairDetail } from '@/api/records'
export default {
  components: {
    fittingTable
  },
  props: {
    rowId: {
      type: Number,
      default: function () {
        return 0
      }
    }
  },
  data () {
    return {
      isMobile: false,
      directionType: {
        horizontal: 'horizontal',
        vertical: 'vertical'
      },
      arrivedData: {
        noticeName: null,
        phoneFour: null
      },
      notice: [],
      checkMsg: false,
      fittingArr: {},
      fittingNumber: [],
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
      currentRow: null
    }
  },
  methods: {
    async arrived () {
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
            this.showMain()
          } else {
            console.log(result.msg)
          }
        })
        .catch(() => {})
    },
    showMain () {
      this.resetCurrentRow()
      this.arrivedData = {
        noticeName: null,
        phoneFour: null
      }
      this.$emit('show-main')
    },
    showDetail () {
      const recordId = this.rowId
      if (recordId === null) return
      apiRepairDetail({ recordId }).then(result => {
        if (result.code === 0) {
          this.currentRow = result.data
        } else {
          this.$message.error('未能获取到数据')
        }
      })
    },
    resetCurrentRow () {
      this.currentRow = this.originRow
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
    this.noticePeople()
  },
  created () {
    this.resetCurrentRow()
  },
  watch: {
    rowId: function (n, o) {
      if (n !== 0 || n !== null) {
        this.showDetail()
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .title {
    color: rgba(0,0,0,.85);
    font-size: 16px;
    font-weight: bolder;
    margin-bottom: 16px;
    line-height: 250%;
  }
</style>
