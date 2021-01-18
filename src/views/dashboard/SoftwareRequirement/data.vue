<template>
  <div>
    <sv-grid ref="svGrid" v-bind="gridOptions" v-on="svGridEvents">
      <template #svgridToolbar>
        <div style="display: flex;" v-if="currRow && typeof currRow.id === 'number'">
          <a-button-group style="margin: 0 12px;" :size="gridOptions.btnSize">
            <a-button title="项目详情" :disabled="!currRow" v-if="currRow" @click="handleShowItemDetail">
              <a-icon type="profile" />
            </a-button>
            <a-button title="开发日志" :disabled="!currRow" v-if="currRow" @click="getDevLog">
              <a-icon type="file-done" />
            </a-button>
          </a-button-group>
          <a-button-group :size="gridOptions.btnSize">
            <a-button
              title="项目验收"
              v-if="currRow && currRow.isr_leader === userInfo.con_id && !currRow.isr_approver"
              @click="auditedItem"
            >
              <a-icon type="smile" />
            </a-button>
            <a-button title="日工作确认" v-if="checkOrDetail === 'check'" @click="dailyCheck">
              <a-icon type="check" />
            </a-button>
            <a-button title="工作确认详情" v-if="checkOrDetail === 'detail'" @click="getCheckList">
              <a-icon type="eye" />
            </a-button>
          </a-button-group>
        </div>
      </template>
      <template #dailyCheck="{row, column}">
        {{ row[column.property] && '已确认' }}
      </template>
    </sv-grid>

    <a-modal
      :title="itemDetailTitle"
      v-model="itemDetailVisible"
      :width="600"
      :destroyOnClose="true"
      @ok="itemDetailVisible = false"
      @cancel="itemDetailVisible = false"
    >
      <template #footer>
        <a-button v-if="isDev" @click="handleSaveItemDetail">
          保存备注
        </a-button>
        <a-button type="primary" @click="printItemDetail">
          打印
        </a-button>
      </template>
      <div id="itemDetail">
        <a-row>
          <a-col :span="24">
            <span class="item-detail-label">项目名称：</span>
            <span class="item-detail-value">{{ currRow && currRow.isr_name }}</span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <span class="item-detail-label">需求单位：</span>
            <span class="item-detail-value">{{ (currRow && currRow.isr_requr_dept) | prjDemandersFilter }}</span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <span class="item-detail-label">项目负责人：</span>
            <span class="item-detail-value">
              {{ currRow && getName(currRow.isr_leader) }}
            </span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <span class="item-detail-label">项目状态：</span>
            <span class="item-detail-value">
              {{ (currRow && currRow.isr_proj_status) | prjStatusFilter }}
            </span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <span class="item-detail-label">提案日期：</span>
            <span class="item-detail-value">{{ (currRow && currRow.isr_join_date) | prjJoinDateFilter }}</span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <span class="item-detail-label">预计完成日期：</span>
            <span class="item-detail-value">{{ (currRow && currRow.isr_target_date) | prjJoinDateFilter }}</span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <span class="item-detail-label">当前进度：</span>
            <span class="item-detail-value">{{ currRow && currRow.isr_curr_phase }}</span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <span class="item-detail-label">项目开发者：</span>
            <span class="item-detail-value">
              {{ currRow && changeDevArrtoDevStr(currRow.isr_dev) }}
            </span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <span class="item-detail-label">项目验收：</span>
            <span class="item-detail-value">
              {{ currRow && currRow.approver }}
            </span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" v-if="isDev">
            <span class="item-detail-label">备注：</span>
            <a-textarea v-model="itemRemark"></a-textarea>
          </a-col>
          <a-col :span="24" v-else>
            <span class="item-detail-label">备注：</span>
            <div v-html="itemRemark"></div>
          </a-col>
        </a-row>
      </div>
    </a-modal>

    <a-modal
      :title="devLogTitle"
      v-model="devLogVisible"
      :width="800"
      :destroyOnClose="true"
      @ok="devLogVisible = false"
      @cancel="devLogVisible = false"
    >
      <template #footer>
        <a-button
          v-if="currRow && currRow.isr_dev && currRow.isr_dev.includes(userInfo.con_id)"
          @click="handleSaveDevLog"
        >
          保存
        </a-button>
        <a-button type="primary" @click="printItemDevLog">
          打印
        </a-button>
      </template>
      <div>
        <div v-if="currRow && currRow.isr_dev && currRow.isr_dev.includes(userInfo.con_id)">
          <a-textarea v-model="devLog" :rows="20"></a-textarea>
          <div id="itemDevLog" style="width: 100%; height: 0;overflow: hidden;">
            {{ devLog }}
          </div>
        </div>
        <div id="itemDevLog" class="item-dev-log" v-else>
          {{ devLog }}
        </div>
      </div>
    </a-modal>

    <a-modal v-model="dayCheckVisible" title="日工作确认列表" @ok="dayCheckVisible = false" :footer="null">
      <ul>
        <li class="daily-check-item" v-for="(item, idx) in dailyCheckList" :key="idx">
          {{ `${item.con_name} ${item.isd_chk_time}` }}
        </li>
      </ul>
    </a-modal>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import printjs from 'print-js'
import { mapGetters } from 'vuex'
import {
  getSoftRequire,
  saveSoftRequireOpt,
  setSoftwareRequireDayCheck,
  getDailyCheckList,
  auditRequire,
  getSoftwareRequireDetail,
  saveSoftwareRequireDetail,
  saveSoftwareRequireDevLog,
  getSoftwareRequireDevLog
} from '@/api/improve'
import { getGroups, getUsers } from '@/api/user'

let depts = []
// let demanders = []
let developers = []

const prjStatus = [
  { label: '等待处理', value: 0 },
  { label: '需求确认中', value: 1 },
  { label: '等待审批', value: 2 },
  { label: '驳回', value: 3 },
  { label: '开发中', value: 4 },
  { label: '完成', value: 5 },
  { label: '停滞', value: 6 },
  { label: '项目维护中', value: 7 }
]

export default {
  filters: {
    prjDemandersFilter (val) {
      return val && val.join('，')
    },
    prjStatusFilter (val) {
      return prjStatus.find(s => s.value === val)?.label
    },
    prjJoinDateFilter (val) {
      return val && val.substr(0, 10)
    }
  },
  data () {
    return {
      itemRemark: '',
      devLog: '',
      itemDetailVisible: false,
      devLogVisible: false,
      dayCheckVisible: false,
      dailyCheckList: [],
      currRow: null,
      depts: [],
      developers: [],
      demanders: [],
      isDev: false,
      gridOptions: {
        loading: false,
        showOverflow: false,
        btnSize: 'large',
        searchBar: true,
        isAllowEdit: false,
        data: [],
        editConfig: {
          activeMethod: this.activeRowMethod
        },
        editActivedEvt: this.editActived,
        addItem: {
          defaultValue: {
            isr_proj_status: 0,
            isr_join_date: dayjs().format('YYYY-MM-DD HH:mm:ss')
          },
          focusField: 'isr_name'
        },
        operatorFields: {
          creator: 'isr_creator',
          modifier: 'isr_modifier'
        },
        handleInsert: this.handleInsert,
        handleUpdate: this.handleUpdate,
        handleSaveOpt: saveSoftRequireOpt,
        columns: [
          {
            type: 'seq',
            width: 50
          },
          {
            field: 'isr_name',
            title: '项目名称',
            editRender: { name: 'input' }
          },
          {
            field: 'isr_requr_dept',
            title: '需求单位',
            editRender: {
              name: '$select',
              options: depts,
              props: { multiple: true }
            }
          },
          {
            field: 'isr_leader',
            title: '项目负责人',
            width: 140,
            editRender: {
              name: '$select',
              options: developers
            }
          },
          {
            field: 'isr_proj_status',
            title: '项目状态',
            width: 120,
            editRender: {
              name: '$select',
              options: prjStatus
            }
          },
          {
            field: 'isr_join_date',
            title: '提案日期',
            width: 150,
            sortable: true
          },
          {
            field: 'isr_target_date',
            title: '预计完成日期',
            width: 150,
            sortable: true,
            editRender: {
              name: '$input',
              props: { type: 'date' }
            }
          },
          {
            field: 'isr_curr_phase',
            title: '当前进度',
            editRender: {
              name: 'input'
            }
          },
          {
            field: 'isr_dev',
            title: '项目开发者',
            width: 140,
            editRender: {
              attrs: { disabled: false },
              name: '$select',
              options: developers,
              props: { multiple: true }
            }
          },
          {
            field: 'approver',
            title: '项目验收',
            filters: developers.map(d => ({ label: d.label, value: d.label })),
            width: 100
          },
          {
            field: 'isd_isok',
            title: '日工作确认',
            width: 100,
            slots: { default: 'dailyCheck' }
          }
        ]
      },
      svGridEvents: {
        refresh: this.getData,
        'current-change': this.handleCurrentRowChange
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    itemDetailTitle () {
      return this.currRow ? `项目详情（${this.currRow.isr_name}）` : '项目详情'
    },
    devLogTitle () {
      return this.currRow ? `开发日志（${this.currRow.isr_name}）` : '开发日志'
    },
    // check 显示日工作确认按钮，detail 显示工作确认详情按钮
    checkOrDetail () {
      const { currRow, userInfo } = this

      if (currRow && currRow.isr_leader === userInfo.con_id && typeof currRow.id === 'number') {
        if (currRow.isd_isok || currRow.approver) {
          return 'detail'
        } else {
          return 'check'
        }
      } else {
        return false
      }
    }
  },
  methods: {
    getName (id) {
      return developers.find(d => d.value === id)?.label
    },
    changeDevArrtoDevStr (arr) {
      return arr?.map(a => developers.find(d => d.value === a)?.label).join('，')
    },
    async getData () {
      this.gridOptions.loading = true
      this.currRow = null

      await getSoftRequire()
        .then(result => {
          if (result.result) {
            this.gridOptions.data = result.data.map(e => {
              const o = Object.assign({}, e)
              o.isr_dev && (o.isr_dev = o.isr_dev.split(','))
              o.isr_requr_dept && (o.isr_requr_dept = o.isr_requr_dept.split(','))

              return o
            })
          }
        })
        .catch(() => {})

      this.gridOptions.loading = false
    },
    handleCurrentRowChange ({ row }) {
      this.currRow = row
    },
    activeRowMethod ({ row, rowIndex, column }) {
      if (this.isDev && !row.approver) {
        return true
      }

      return false
    },
    // 设置列禁止编辑，vxe-table bug,下拉框设置无效
    editActived ({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
      if (row.isr_leader !== this.userInfo.con_id) {
        const devColumn = this.$refs.svGrid.getColumnByField('isr_dev')
        devColumn.editRender.attrs.disabled = true
      }
    },
    handleInsert (insertItem) {
      delete insertItem.approver
      delete insertItem.isd_isok

      return insertItem
    },
    handleUpdate (updateItem, columns, originData) {
      const originRecord = originData.find(e => e.id === updateItem.id)
      const updateFields = {}

      columns.forEach(key => {
        if (Array.isArray(updateItem[key])) {
          if ((updateItem[key] || []).toString() !== (originRecord[key] || []).toString()) {
            updateFields[key] = updateItem[key].join(',')
          }
        } else {
          if (updateItem[key] !== originRecord[key]) {
            updateFields[key] = updateItem[key]
          }
        }
      })

      if (this.currRow.isr_leader !== this.userInfo.con_id) {
        if ('isr_dev' in updateFields) {
          delete updateFields['isr_dev']
        }
        if ('isr_leader' in updateFields) {
          delete updateFields['isr_leader']
        }
        if ('isr_name' in updateFields) {
          delete updateFields['isr_name']
        }
        if ('isr_requr_dept' in updateFields) {
          delete updateFields['isr_requr_dept']
        }
      }

      return updateFields
    },
    printItemDetail () {
      printjs({
        printable: 'itemDetail',
        type: 'html'
      })
    },
    printItemDevLog () {
      printjs('itemDevLog', 'html')
    },
    async dailyCheck () {
      await setSoftwareRequireDayCheck(this.currRow.id, this.userInfo.con_id)
        .then(res => {
          if (res.result) {
            this.$message.success('已审核确认')
            this.getData()
          }
        })
        .catch(() => {})
    },
    async getCheckList () {
      await getDailyCheckList(this.currRow.id).then(res => {
        res.result && (this.dailyCheckList = res.data)
      })
      this.dayCheckVisible = true
    },
    async auditedItem () {
      await auditRequire(this.currRow.id, this.userInfo.con_id)
        .then(res => {
          if (res.result) {
            this.$message.success('已验收')
            this.getData()
          }
        })
        .catch(() => {})
    },
    async handleShowItemDetail () {
      this.itemRemark = ''
      await getSoftwareRequireDetail(this.currRow.id).then(res => {
        if (res.result && res.data.length) {
          this.itemRemark = res.data[0].isrd_detail
        }
      })
      this.itemDetailVisible = true
    },
    handleSaveItemDetail () {
      saveSoftwareRequireDetail(this.currRow.id, this.itemRemark).then(res => {
        this.$notification[res.result ? 'success' : 'error']({
          message: res.result ? '保存成功' : '保存失败'
        })
      })
    },
    async getDevLog () {
      this.devLog = ''
      await getSoftwareRequireDevLog(this.currRow.id).then(res => {
        if (res.result && res.data.length) {
          this.devLog = res.data[0].isdl_log
        }
      })
      this.devLogVisible = true
    },
    handleSaveDevLog () {
      saveSoftwareRequireDevLog(this.currRow.id, this.devLog).then(res => {
        this.$notification[res.result ? 'success' : 'error']({
          message: res.result ? '保存成功' : '保存失败'
        })
      })
    }
  },
  async beforeCreate () {
    await getGroups().then(res => {
      res.result &&
        (depts = res.data.filter(d => d.sgd_is_dept === 1).map(d => ({ label: d.sgd_alias, value: d.sgd_alias })))
    })

    await getUsers().then(res => {
      if (res.result) {
        const dev = res.data.filter(d => d.con_title === 'software developer')
        developers = dev.map(d => ({ label: d.con_name, value: d.con_id }))

        this.isDev = !!dev.find(d => d.con_id === this.userInfo.con_id)
        this.gridOptions.isAllowEdit = this.isDev
      }
    })
  },
  async created () {
    await this.getData()
  }
}
</script>

<style lang="less" scoped>
.table-tips {
  font-size: 16px;
  margin: 12px 14px;
  letter-spacing: 3px;
  margin-left: auto;
}

.item-detail-label {
  font-weight: bolder;
}

.item-detail-value {
  text-decoration: underline;
}

.item-dev-log {
  height: 600px;
  overflow: auto;
}

.daily-check-item {
  list-style: none;
  counter-increment: number;
}

.daily-check-item::before {
  content: counter(number) ' ';
  font-weight: bold;
  color: green;
}
</style>
