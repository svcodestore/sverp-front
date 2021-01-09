<template>
  <div>
    <sv-grid ref="svGrid" v-bind="gridOptions" v-on="svGridEvents">
      <template #svgridToolbar>
        <div>
          <a-button-group style="margin: 0 0 0 53px;" :size="gridOptions.btnSize">
            <a-button title="设置参与人员">
              <a-icon type="team" />
            </a-button>
            <a-button title="加入">
              <a-icon type="usergroup-add" />
            </a-button>
            <a-button title="创建进度">
              <a-icon type="file-add" />
            </a-button>
          </a-button-group>
          <a-button-group style="margin: 0 12px;" :size="gridOptions.btnSize">
            <a-button title="项目详情" :disabled="!currRow || currRow.opt">
              <a-icon type="profile" />
            </a-button>
            <a-button title="开发日志" :disabled="!currRow || currRow.opt">
              <a-icon type="file-done" />
            </a-button>
          </a-button-group>
          <a-button-group :size="gridOptions.btnSize">
            <a-button title="项目验收" :disabled="!currRow || currRow.opt">
              <a-icon type="smile" />
            </a-button>
            <a-button title="日工作确认" :disabled="!currRow || currRow.opt">
              <a-icon type="check" />
            </a-button>
          </a-button-group>
        </div>
      </template>
    </sv-grid>
  </div>
</template>

<script>
import { getSoftRequire } from '@/api/improve'
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
  data () {
    return {
      currRow: null,
      depts: [],
      developers: [],
      demanders: [],
      gridOptions: {
        loading: false,
        btnSize: 'large',
        data: [],
        columns: [
          {
            field: 'isr_name',
            title: '项目名称',
            editRender: { name: 'input' }
          },
          {
            field: 'isr_requr_dept',
            title: '需求单位',
            filters: depts,
            editRender: {
              name: '$select',
              options: depts,
              props: { multiple: true }
            }
          },
          {
            field: 'isr_leader',
            title: '项目负责人',
            filters: developers,
            width: 140,
            editRender: {
              name: '$select',
              options: developers
            }
          },
          {
            field: 'isr_proj_status',
            title: '项目状态',
            slots: {
              default: 'status'
            },
            filters: prjStatus,
            width: 120,
            editRender: {
              name: '$select',
              options: prjStatus
            }
          },
          {
            field: 'isr_join_date',
            title: '提案日期',
            sortable: true
          },
          {
            field: 'isr_target_date',
            title: '预计完成日期',
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
              name: '$select',
              options: [
                {
                  value: 'zh_CN',
                  label: '中文'
                },
                {
                  value: 'zh_TW',
                  label: '中文台湾'
                },
                {
                  value: 'zh_HK',
                  label: '中文香港'
                },
                {
                  value: 'en_US',
                  label: '英文'
                }
              ]
            }
          },
          {
            field: 'isr_dev',
            title: '项目开发者',
            width: 140,
            editRender: {
              name: '$select',
              options: developers,
              props: { multiple: true }
            },
            slots: { filter: 'devFilter' }
          },
          {
            field: 'isr_approver',
            title: '项目验收',
            filters: developers,
            width: 100
          },
          {
            field: '',
            title: '日工作确认',
            width: 100
          }
        ]
      },
      svGridEvents: {
        refresh: this.getData,
        'current-change': this.handleCurrentRowChange
      }
    }
  },
  methods: {
    async getData () {
      this.gridOptions.loading = true
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
    }
  },
  updated () {
    getGroups().then(res => {
      res.result &&
        (depts = res.data.filter(d => d.sgd_is_dept === 1).map(d => ({ label: d.sgd_alias, value: d.sgd_alias })))
    })
    getUsers().then(res => {
      res.result &&
        (developers = res.data
          .filter(d => d.con_title === 'software developer')
          .map(d => ({ label: d.con_name, value: d.con_id })))
    })
  },
  mounted () {
    this.getData()
  }
}
</script>

<style scoped>
.table-tips {
  font-size: 16px;
  margin: 12px 14px;
  letter-spacing: 3px;
  margin-left: auto;
}
</style>
