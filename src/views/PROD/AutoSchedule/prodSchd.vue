<template>
  <div>
    <a-select placeholder="请选择生产线" style="width: 140px" v-model="prodLine" @change="initData">
      <a-select-option v-for="item in prodLines" :key="item.value" :value="item.value" :disabled="item.disabled">
        {{ item.label }}
      </a-select-option>
    </a-select>
    <a-month-picker
      placeholder="请选择月份"
      style="width: 120px"
      :disabled-date="disabledDate"
      v-model="prodDate"
      @change="initData"
    />
    <a-button
      title="查询"
      style="margin: 0 15px 0 8px;"
      shape="circle"
      type="primary"
      :loading="schdSearchLoading"
      :disabled="!prodLine || !prodDate"
      @click="handleSchdSearch"
    >
      <a-icon type="search" />
    </a-button>
    <a-select v-model="schdMode">
      <a-select-option key="1" value="MAX_COST">最大耗时</a-select-option>
      <a-select-option key="2" value="SELF_COST">自身耗时</a-select-option>
    </a-select>
    <a-button :loading="autoSchdLoading" :disabled="!prodLine || !prodDate" @click="handleAutoSchd">
      自动排程
    </a-button>
    <!-- <a-button v-if="true" style="margin: 0 8px;" :disabled="!prodLine || !prodDate" @click="handleSyncSchdParam">
      同步排程参数
    </a-button> -->
    <a-select
      title="数据呈现的样式"
      style="width: 90px; margin: 1px 2px 0 10px;"
      v-if="!!prodLine && !!prodDate && !!gridPrdSchdOptions.data.length"
      v-model="dataShowStyle"
    >
      <a-select-option value="1">样式一</a-select-option>
      <a-select-option value="2">样式二</a-select-option>
    </a-select>
    <a-button
      :loading="genReportLoading"
      v-if="!!prodLine && !!prodDate && !!gridPrdSchdOptions.data.length"
      @click="handleGenReport"
    >
      生成报表
    </a-button>
    <a-switch
      title="局部数据测试"
      v-show="!!prodLine && !!prodDate && gridPrdSchdOptions.data.length"
      style="margin-left: 10px;"
      checked-children="开启调试"
      un-checked-children="关闭调试"
      :checked="isInspection"
      @change="showInspection"
    />
    <div v-if="isInspection" style="margin-top: 5px;">
      <div>
        生产单：
        <a-select
          placeholder="请选择调试的生产单"
          mode="multiple"
          v-model="inspectParam.prodList"
          style="width: 400px; margin-right: 5px;"
        >
          <a-select-option v-for="item in gridPrdSchdOptions.data" :key="item.prdoid" :value="item.prdoid">
            {{ `${item.ppi_customer_no} - ${item.ppi_customer_pono} - ${item.ppi_prd_item}` }}
          </a-select-option>
        </a-select>
        <a-button @click="handleInspect" :loading="schdInspectLoading" :disabled="!inspectParam.prodList.length">
          调试
        </a-button>
        <div style="margin: 2px 0;">
          开始于：
          <a-date-picker show-time v-model="inspectParam.startAt" />
          等分生产数：
          <a-input-number v-model="inspectParam.splitCnt" :min="1" :max="99" />
        </div>
      </div>
      <div v-if="inspectParam.prodList.length === 1">
        工序：
        <a-select v-model="inspectParam.phase" placeholder="选择工序" style="width: 100px;margin-left: 14px;">
          <a-select-option v-for="item in phases" :key="item.map_ppi_phsid" :value="item.map_ppi_phsid">
            {{ `${item.map_ppi_phs}` }}
          </a-select-option>
        </a-select>
        耗时：
        <a-input-number placeholder="单位（s）" v-model="inspectParam.costTime" :min="0" :max="3600" />
        停滞：
        <a-input-number placeholder="单位（s）" v-model="inspectParam.deadTime" :min="0" :max="8640000" />
        前置：
        <a-input-number placeholder="单位（s）" v-model="inspectParam.aheadTime" :min="0" :max="8640000" />
        外发：
        <a-input-number placeholder="单位（s）" v-model="inspectParam.outTime" :min="0" :max="8640000" />
      </div>
    </div>

    <vxe-grid ref="xGridPrd" v-bind="gridPrdOptions" v-if="!!prodLine && !!prodDate && gridPrdOptions.data.length">
      <template v-slot:toolbar>
        <div style="display: flex;">
          <div style="font-size: 16px;margin: 5px 14px; letter-spacing: 3px;">
            【生产订单表】
            <a-button title="图表" shape="circle" @click="handleSetChartData([gridPrdOptions.data])">
              <a-icon type="bar-chart" />
            </a-button>
          </div>
          <div style="font-size: 16px;margin: 5px 14px; letter-spacing: 3px; margin-left: auto;">
            {{ `${gridPrdOptions.data.length}条记录` }}
          </div>
        </div>
      </template>
    </vxe-grid>

    <div v-show="dataShowStyle === '1'">
      <a-row :gutter="10">
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="11">
          <a-modal
            centered
            title="生产单图表"
            :width="modalWidth"
            :footer="null"
            v-model="prdSchdVisible"
            @cancel="handleModalOncancel"
          >
          </a-modal>

          <vxe-grid
            ref="xGridPrdSchd"
            v-bind="gridPrdSchdOptions"
            v-if="!!prodLine && !!prodDate && gridPrdSchdOptions.data.length"
            @current-change="currPrdSchdRowChg"
          >
            <template v-slot:toolbar>
              <div style="display: flex;">
                <div style="font-size: 16px;margin: 5px 14px; letter-spacing: 3px;">
                  【生产排程表】
                  <a-button title="图表" shape="circle" @click="handleSetChartData([gridPrdSchdOptions.data])">
                    <a-icon type="bar-chart" />
                  </a-button>
                </div>
                <div style="font-size: 16px;margin: 5px 14px; letter-spacing: 3px; margin-left: auto;">
                  {{ `${gridPrdSchdOptions.data.length}条记录` }}
                </div>
              </div>
            </template>
          </vxe-grid>
        </a-col>
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="13">
          <vxe-grid
            ref="xGridPrdPhs"
            v-bind="gridPrdPhsOptions"
            v-if="!!prodLine && !!prodDate && gridPrdSchdOptions.data.length"
          >
            <template v-slot:toolbar>
              <div style="display: flex;">
                <div style="font-size: 16px;margin: 5px 14px; letter-spacing: 3px;">
                  【排程工序表】
                </div>
                <div style="font-size: 16px;margin: 5px 14px; letter-spacing: 3px; margin-left: auto;">
                  {{ `${gridPrdPhsOptions.data.length}条记录` }}
                </div>
              </div>
            </template>
            <template v-slot:ismaster="{ row, column }">
              {{ row[column.property] === 1 ? '主流程' : '辅流程' }}
            </template>
          </vxe-grid>
        </a-col>
      </a-row>
    </div>
    <div id="dataShowStyle2" v-show="dataShowStyle === '2'">
      <table v-for="(t, i) in tblData" :key="i">
        <tr>
          <td v-for="(v, idx) in t" :key="idx" v-html="v"></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import printjs from 'print-js'
import {
  getProdSchdData,
  syncProdSchdParam,
  autoSchedule,
  getPrdSchdReport,
  getAutoSchdParam,
  inspectSchedule
} from '@/api/prod'

import { Chart } from '@antv/g2'
import DataSet from '@antv/data-set'

const cnf = {
  rowId: 'prdoid',
  round: true,
  stripe: true,
  highlightHoverRow: true,
  highlightCurrentRow: true,
  scrollY: { gt: -1 },
  loading: false,
  border: 'none',
  resizable: true,
  syncResize: true,
  autoResize: true,
  keepSource: true,
  data: [],
  mouseConfig: { selected: true },
  keyboardConfig: {
    isArrow: true,
    isDel: true,
    isEnter: true,
    isTab: true,
    isEdit: true
  }
}

export default {
  data () {
    return {
      prodLine: void 0,
      prodDate: null,
      schdMode: 'MAX_COST',
      phases: [],
      inspectParam: {
        prodList: [],
        phase: null,
        costTime: null,
        deadTime: null,
        aheadTime: null,
        outTime: null,
        startAt: null,
        splitCnt: 18
      },
      isInspection: false,
      schdInspectLoading: false,
      dataShowStyle: '1',
      modalWidth: 900,
      schdSearchLoading: false,
      autoSchdLoading: false,
      genReportLoading: false,
      prdSchdVisible: false,
      currPrdSchdRow: null,
      prodLines: [
        {
          label: '制八线皮带',
          value: 'N'
        },
        {
          label: '制九线皮夹',
          value: 'V'
        }
      ],
      tblData: [],
      gridPrdOptions: {
        ...cnf,
        id: 'full_edit_1',
        height: 300,
        columns: [
          {
            field: 'ppi_customer_no',
            title: '客户代号',
            sortable: true
          },
          {
            field: 'ppi_customer_pono',
            title: '客户订单号',
            align: 'right',
            sortable: true
          },
          {
            field: 'ppi_prd_item',
            title: '工厂品号',
            sortable: true
          },
          {
            field: 'ppi_po_qty',
            title: '订单数量',
            align: 'right',
            sortable: true
          },
          {
            field: 'ppi_expected_qty',
            title: '计划数量',
            align: 'right',
            sortable: true
          },
          {
            field: 'ppi_workshop_name',
            title: '生产单位',
            sortable: true
          }
        ]
      },
      gridPrdSchdOptions: {
        ...cnf,
        id: 'full_edit_3',
        height: 440,
        columns: [
          {
            field: 'ppi_customer_no',
            title: '客户代号',
            sortable: true
          },
          {
            field: 'ppi_customer_pono',
            title: '客户订单号',
            align: 'right',
            sortable: true
          },
          {
            field: 'ppi_prd_item',
            title: '工厂品号',
            sortable: true
          },
          {
            field: 'ppi_po_qty',
            title: '订单数量',
            align: 'right',
            sortable: true
          },
          {
            field: 'ppi_expected_qty',
            title: '计划数量',
            align: 'right',
            sortable: true
          },
          {
            field: 'ppi_workshop_name',
            title: '生产单位',
            sortable: true
          }
        ]
      },
      gridPrdPhsOptions: {
        ...cnf,
        id: 'full_edit_2',
        height: 440,
        mouseConfig: { selected: true },
        keyboardConfig: {
          isArrow: true,
          isDel: true,
          isEnter: true,
          isTab: true,
          isEdit: true
        },
        columns: [
          { type: 'seq', width: 50 },
          {
            field: 'map_ppi_phs',
            title: '工站',
            sortable: true
          },
          {
            field: 'map_ppi_phs_desc',
            title: '描述',
            width: 180,
            sortable: true
          },
          {
            field: 'map_ppi_ismaster',
            title: '流程',
            slots: {
              default: 'ismaster'
            },
            sortable: true
          },
          { field: 'map_ppi_cost_time', title: '耗时（s）', width: 100, align: 'right', sortable: true },
          {
            field: 'ppi_phs_start',
            title: '开始于',
            width: 160,
            sortable: true
          },
          {
            field: 'ppi_phs_complete',
            title: '完成于',
            width: 160,
            sortable: true
          }
        ]
      }
    }
  },
  watch: {
    'inspectParam.phase' (val, oval) {
      if (val) {
        const phaseInfo = this.gridPrdSchdOptions.data
          .find(item => item.prdoid === this.inspectParam.prodList[0])
          .phases.find(p => p.map_ppi_phsid === val)
        this.inspectParam.costTime = phaseInfo.map_ppi_cost_time || 0
        this.inspectParam.deadTime = phaseInfo.map_ppi_deadtime || 0
        this.inspectParam.aheadTime = phaseInfo.map_ppi_aheadtime || 0
        this.inspectParam.outTime = phaseInfo.map_ppi_outime || 0
      }
    },
    'inspectParam.prodList' () {
      this.inspectParam.costTime = 0
      this.inspectParam.deadTime = 0
      this.inspectParam.aheadTime = 0
      this.inspectParam.outTime = 0
      this.inspectParam.splitCnt = 18
      this.inspectParam.startAt = null
      this.inspectParam.phase = null
      if (this.inspectParam.prodList.length === 1) {
        this.phases = this.gridPrdSchdOptions.data.find(item => item.prdoid === this.inspectParam.prodList[0])['phases']
      } else {
        this.phases = []
      }
    }
  },
  methods: {
    /**
     * @description: 禁止选择的日期
     * @param moment current
     * @return moment
     */
    disabledDate (current) {
      // 只能选择 ± 1
      return (
        current &&
        (current <
          dayjs()
            .add(-2, 'years')
            .endOf('year') ||
          current >
            dayjs()
              .add(1, 'years')
              .endOf('year'))
      )
    },
    /**
     * @description: 初始化数据
     * @return void
     */
    initData () {
      this.gridPrdOptions.data = []
      this.gridPrdSchdOptions.data = []
      this.gridPrdPhsOptions.data = []
      this.currPrdSchdRow = null
      this.tblData = []
    },
    /**
     * @description: 调试开关变化事件
     * @return void
     */
    showInspection () {
      this.isInspection = !this.isInspection
    },
    /**
     * @description: 生产报表
     * @return void
     */
    async handleGenReport () {
      if (this.dataShowStyle === '1') {
        this.genReportLoading = true
        const data = {
          date: dayjs(this.prodDate).format('YYYY-MM'),
          data: this.gridPrdSchdOptions.data
        }
        await getPrdSchdReport(data)
          .then(res => {
            const blob = new Blob([res], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            window.open(url)
          })
          .catch(() => {})
        this.genReportLoading = false
      } else {
        printjs({
          printable: 'dataShowStyle2',
          type: 'html',
          header: '<center><h2>排程计划报表</h2></center>',
          style: '#dataShowStyle2 table { margin: 25px 0; border-top: 1px solid rgba(0, 0, 0, 0.377); }'
        })
      }
    },
    /**
     * @description: 生产单表格当前行变化事件
     * @param Object row
     * @return void
     */
    currPrdSchdRowChg ({ row }) {
      this.currPrdSchdRow = row
      this.gridPrdPhsOptions.data = row.phases
    },
    /**
     * @description: 生产单查询
     * @return void
     */
    async handleSchdSearch () {
      this.schdSearchLoading = true
      this.gridPrdOptions.loading = true
      const date = dayjs(this.prodDate).format('YYYY-MM')
      await getProdSchdData(this.prodLine, date)
        .then(res => {
          if (res.result) {
            if (res.data.length) {
              this.gridPrdOptions.data = res.data
            } else {
              this.$message.info('暂无数据')
            }
          }
        })
        .catch(() => {})
      this.schdSearchLoading = false
      this.gridPrdOptions.loading = false
    },
    /**
     * @description: 同步生产单
     * @return void
     */
    handleSyncSchdParam () {
      const date = dayjs(this.prodDate).format('YYYY-MM')
      syncProdSchdParam(this.prodLine, date)
        .then(res => {
          if (res.result) {
          }
        })
        .catch(() => {})
    },
    autoSchd ({ year, month, arrangeDays, prodOrdersList, schdParams }) {
      // let startSchDate = ''
      // const firstDayOfMonth = `${year}-${month}-01`

      arrangeDays.forEach(date => {})
    },
    async handleAutoSchd2 () {
      this.autoSchdLoading = true
      this.gridPrdSchdOptions.loading = true
      this.gridPrdPhsOptions.loading = true

      const date = dayjs(this.prodDate).format('YYYY-MM')
      await getAutoSchdParam(this.prodLine, date)
        .then(res => {
          this.gridPrdSchdOptions.data = this.autoSchd(res)
        })
        .catch(err => {
          this.$notification.error({
            message: `${err.response.status} ${err.response.statusText}`,
            description: err.response.data.message,
            icon: <a-icon type="frown" style="color: #108ee9" />
          })
        })
      this.autoSchdLoading = false
      this.gridPrdSchdOptions.loading = false
      this.gridPrdPhsOptions.loading = false
    },
    /**
     * @description: 后端自动排程
     * @return void
     */
    async handleAutoSchd () {
      this.autoSchdLoading = true
      this.gridPrdSchdOptions.loading = true
      this.gridPrdPhsOptions.loading = true

      const date = dayjs(this.prodDate).format('YYYY-MM')
      await autoSchedule(this.prodLine, date, this.schdMode)
        .then(res => {
          if (res.result) {
            if (res.data.length) {
              this.gridPrdSchdOptions.data = res.data

              const arr = []
              res.data.forEach(item => {
                const {
                  // eslint-disable-next-line camelcase
                  ppi_customer_no,
                  // eslint-disable-next-line camelcase
                  ppi_customer_pono,
                  // eslint-disable-next-line camelcase
                  ppi_prd_item,
                  // eslint-disable-next-line camelcase
                  ppi_po_qty,
                  // eslint-disable-next-line camelcase
                  ppi_expected_qty,
                  // eslint-disable-next-line camelcase
                  ppi_workshop_name
                } = item

                const keys = [
                  '客户代号<br>',
                  '客户订单号<br>',
                  '工厂品号<br>',
                  '订单数量<br>',
                  '计划数量<br>',
                  '生产单位<br>'
                ]
                const values = [
                  // eslint-disable-next-line camelcase
                  ppi_customer_no,
                  // eslint-disable-next-line camelcase
                  ppi_customer_pono,
                  // eslint-disable-next-line camelcase
                  ppi_prd_item,
                  // eslint-disable-next-line camelcase
                  ppi_po_qty,
                  // eslint-disable-next-line camelcase
                  ppi_expected_qty,
                  // eslint-disable-next-line camelcase
                  ppi_workshop_name
                ]
                item.phases.forEach(e => {
                  const {
                    // eslint-disable-next-line camelcase
                    map_ppi_phs,
                    // eslint-disable-next-line camelcase
                    map_ppi_ismaster,
                    // eslint-disable-next-line camelcase
                    map_ppi_cost_time,
                    // eslint-disable-next-line camelcase
                    ppi_phs_start,
                    // eslint-disable-next-line camelcase
                    ppi_phs_complete
                  } = e
                  // eslint-disable-next-line camelcase
                  keys.push(`${map_ppi_phs} | ${map_ppi_cost_time} ${map_ppi_ismaster === 1 ? '' : '辅'}`)
                  // eslint-disable-next-line camelcase
                  values.push(`<br>${ppi_phs_start}<br>${ppi_phs_complete}`)
                })
                arr.push(
                  keys.map((k, i) => {
                    if (i === 10) {
                      return `<div style="page-break-after: always;">${k}\n${values[i]}</div>`
                    }
                    return `<div>${k}\n${values[i]}</div>`
                  })
                )
              })
              this.tblData = arr
              this.$nextTick(() => {
                this.gridPrdPhsOptions.data = res.data[0].phases
                this.$refs.xGridPrdSchd.setCurrentRow(res.data[0])
              })
            } else {
              this.$message.info('暂无数据')
            }
          } else {
            this.$notification.error({
              message: '排程失败',
              icon: <a-icon type="frown" style="color: #108ee9" />
            })
          }
        })
        .catch(err => {
          this.$notification.error({
            message: `${err.response.status} ${err.response.statusText}`,
            description: err.response.data.message,
            icon: <a-icon type="frown" style="color: #108ee9" />
          })
        })

      this.autoSchdLoading = false
      this.gridPrdSchdOptions.loading = false
      this.gridPrdPhsOptions.loading = false
    },
    /**
     * @description: 生产图表数据
     * @param Array data
     * @param Array color
     * @return Object
     */
    setChartData (data, color) {
      const arr = []
      const colorMap = {}
      const prdo = Array.from(new Set(data.map(e => e.ppi_customer_pono)))
      data.forEach(schedule => {
        prdo.forEach(orderNo => {
          if (schedule.ppi_customer_pono === orderNo) {
            if (!(schedule.ppi_customer_no in colorMap)) {
              colorMap[schedule.ppi_customer_no] = color[Object.keys(colorMap).length]
            }

            const idx = arr.findIndex(e => e.name === orderNo)
            if (idx > -1) {
              arr[idx].value += 1
            } else {
              arr.push({
                name: schedule.ppi_customer_pono,
                type: schedule.ppi_customer_no,
                value: 1
              })
            }
          }
        })
      })

      return { data: arr, colorMap }
    },
    /**
     * @description: 生成图表
     * @param Array dataList
     * @param Array color
     * @param String el
     * @param Number width
     * @param Number height
     * @return {*}
     */
    genChart (dataList, color, el = 'prdoContainer', width = 400, height = 300) {
      if (!dataList.length) return

      const { data, colorMap } = this.setChartData(dataList, color)

      const modalElemnt = document.querySelector('.ant-modal-body')
      const prdoContainer = document.createElement('div')
      prdoContainer.id = el
      modalElemnt.appendChild(prdoContainer)

      const ds = new DataSet()
      const dv = ds.createView()
      dv.source(data).transform({
        type: 'percent',
        field: 'value',
        dimension: 'type',
        as: 'percent'
      })

      const chart = new Chart({
        container: el,
        // autoFit: true,
        width,
        height
      })
      chart.data(dv.rows)
      chart.legend(false)
      chart.coordinate('theta', {
        radius: 0.5,
        innerRadius: 0.3
      })
      chart.tooltip({
        showMarkers: false
      })
      chart
        .interval()
        .adjust('stack')
        .position('percent')
        .color('type', val => colorMap[val])
        .style({
          stroke: 'white',
          lineWidth: 1
        })
        .label('type', {
          offset: -5,
          style: {
            fill: 'white',
            shadowBlur: 2,
            shadowColor: 'rgba(0, 0, 0, .45)'
          }
        })

      const ds2 = new DataSet()
      const dv2 = ds2.createView()
      dv2.source(data).transform({
        type: 'percent',
        field: 'value',
        dimension: 'name',
        as: 'percent'
      })
      const outterView = chart.createView()
      outterView.data(dv2.rows)
      outterView.coordinate('theta', {
        innerRadius: 0.5 / 0.8,
        radius: 0.8
      })
      outterView
        .interval()
        .adjust('stack')
        .position('percent')
        .color('type*name', (type, name) => colorMap[type])
        .style({
          stroke: 'white',
          lineWidth: 1
        })
        .label('name', {
          offset: -10,
          style: {
            fill: 'white',
            shadowBlur: 2,
            shadowColor: 'rgba(0, 0, 0, .45)'
          }
        })

      chart.interaction('element-active')

      chart.theme({
        styleSheet: {
          brandColor: '#5B8FF9',
          paletteQualitative10: [
            '#5B8FF9',
            '#61DDAA',
            '#65789B',
            '#F6BD16',
            '#6F5EF9',
            '#78D3F8',
            '#9661BC',
            '#F6903D',
            '#008685',
            '#F08BB4'
          ],
          paletteQualitative20: [
            '#5B8FF9',
            '#CDDDFD',
            '#61DDAA',
            '#CDF3E4',
            '#65789B',
            '#CED4DE',
            '#F6BD16',
            '#FCEBB9',
            '#6F5EF9',
            '#D3CEFD',
            '#78D3F8',
            '#D3EEF9',
            '#9661BC',
            '#DECFEA',
            '#F6903D',
            '#FFE0C7',
            '#008685',
            '#BBDEDE',
            '#F08BB4',
            '#FFE0ED'
          ]
        }
      })
      chart.render()
    },
    /**
     * @description: 生产图表事件
     * @param Array data
     * @return void
     */
    handleSetChartData (data) {
      this.prdSchdVisible = true
      this.$nextTick(() => {
        this.modalWidth = data.length === 1 ? 700 : 900
        let cfg = []
        if (data.length === 1) {
          this.modalWidth = 700
          cfg = [600, 400]
        }
        const color = [
          '#1890ff',
          '#13c2c2',
          '#ffc53d',
          '#73d13d',
          '#5B8FF9',
          '#CDDDFD',
          '#61DDAA',
          '#CDF3E4',
          '#65789B',
          '#CED4DE',
          '#F6BD16',
          '#FCEBB9',
          '#6F5EF9',
          '#D3CEFD',
          '#78D3F8',
          '#D3EEF9',
          '#9661BC',
          '#DECFEA',
          '#F6903D',
          '#FFE0C7',
          '#008685',
          '#BBDEDE',
          '#F08BB4',
          '#FFE0ED'
        ]
        data.forEach(e => {
          this.genChart(e, color, 'chartContainer', ...cfg)
        })
      })
    },
    /**
     * @description: 图表对话框关闭事件
     * @return void
     */
    handleModalOncancel () {
      this.prdSchdVisible = false
      setTimeout(() => {
        const modalElemnt = document.querySelector('.ant-modal-body')
        const chartContainers = document.querySelectorAll('.ant-modal-body div')
        for (const el of chartContainers) {
          if (el.id) {
            modalElemnt.removeChild(el)
          }
        }
      }, 150)
    },
    /**
     * @description: 调试开关变化事件
     * @return void
     */
    async handleInspect () {
      let param
      const year = dayjs(this.prodDate).format('YYYY')
      const month = dayjs(this.prodDate).format('MM')
      !!this.inspectParam.startAt &&
        (this.inspectParam.startAt = dayjs(this.inspectParam.startAt).format('YYYY-MM-DD HH:mm:ss'))
      if (this.inspectParam.prodList.length === 1) {
        param = Object.assign({ year, month, prodLine: this.prodLine, schdMode: this.schdMode }, this.inspectParam)
      } else if (this.inspectParam.prodList.length > 1) {
        param = Object.assign(
          { year, month, prodLine: this.prodLine, schdMode: this.schdMode },
          {
            prodList: this.inspectParam.prodList,
            startAt: this.inspectParam.startAt,
            splitCnt: this.inspectParam.splitCnt
          }
        )
      }

      if (!param) return

      this.schdInspectLoading = true
      this.gridPrdSchdOptions.loading = true
      this.gridPrdPhsOptions.loading = true

      await inspectSchedule(param)
        .then(res => {
          if (res.result) {
            if (res.data.length) {
              this.gridPrdSchdOptions.data = res.data

              const arr = []
              res.data.forEach(item => {
                const {
                  // eslint-disable-next-line camelcase
                  ppi_customer_no,
                  // eslint-disable-next-line camelcase
                  ppi_customer_pono,
                  // eslint-disable-next-line camelcase
                  ppi_prd_item,
                  // eslint-disable-next-line camelcase
                  ppi_po_qty,
                  // eslint-disable-next-line camelcase
                  ppi_expected_qty,
                  // eslint-disable-next-line camelcase
                  ppi_workshop_name
                } = item

                const keys = ['客户代号', '客户订单号', '工厂品号', '订单数量', '计划数量', '生产单位']
                const values = [
                  // eslint-disable-next-line camelcase
                  ppi_customer_no,
                  // eslint-disable-next-line camelcase
                  ppi_customer_pono,
                  // eslint-disable-next-line camelcase
                  ppi_prd_item,
                  // eslint-disable-next-line camelcase
                  ppi_po_qty,
                  // eslint-disable-next-line camelcase
                  ppi_expected_qty,
                  // eslint-disable-next-line camelcase
                  ppi_workshop_name
                ]
                item.phases.forEach(e => {
                  const {
                    // eslint-disable-next-line camelcase
                    map_ppi_phs,
                    // eslint-disable-next-line camelcase
                    map_ppi_ismaster,
                    // eslint-disable-next-line camelcase
                    map_ppi_cost_time,
                    // eslint-disable-next-line camelcase
                    ppi_phs_start,
                    // eslint-disable-next-line camelcase
                    ppi_phs_complete
                  } = e
                  // eslint-disable-next-line camelcase
                  keys.push(`${map_ppi_phs} ${map_ppi_cost_time} ${map_ppi_ismaster === 1 ? '' : '辅'}<br>`)
                  // eslint-disable-next-line camelcase
                  values.push(` | <br>${ppi_phs_start}<br>${ppi_phs_complete}`)
                })
                arr.push(
                  keys.map((k, i) => {
                    if (i === 13) {
                      return `<div style="page-break-after: always;">${k}<br>${values[i]}</div>`
                    }
                    return `<div>${k}<br>${values[i]}</div>`
                  })
                )
              })
              // this.tblData = arr
              this.$nextTick(() => {
                this.gridPrdPhsOptions.data = res.data[0].phases
                this.$refs.xGridPrdSchd.setCurrentRow(res.data[0])
              })
            } else {
              this.$message.info('暂无数据')
            }
          } else {
            this.$notification.error({
              message: '排程失败',
              icon: <a-icon type="frown" style="color: #108ee9" />
            })
          }
        })
        .catch(() => {})

      this.schdInspectLoading = false
      this.gridPrdSchdOptions.loading = false
      this.gridPrdPhsOptions.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-modal-body {
  display: flex;
  overflow: auto;
}

#dataShowStyle2 {
  overflow: auto;
  height: 600px;
  margin: 10px 0;
  padding: 0 10px;

  table {
    margin: 5px 0;
    text-align: center;
    width: 100%;

    tr {
      border: 1px solid rgba(0, 0, 0, 0.377);
    }
  }
}
</style>
