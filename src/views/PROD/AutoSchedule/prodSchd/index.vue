<!--
 * @Author: yanbuw1911
 * @Date: 2021-03-04 14:07:18
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-03-31 09:17:32
 * @Description: Do not edit
 * @FilePath: /sverp-front/src/views/PROD/AutoSchedule/prodSchd/index.vue
-->
<template>
  <div>
    <div class="operation-bar">
      <a-select placeholder="请选择生产线" style="width: 140px" allowClear v-model="prodLine" @change="initData">
        <a-select-option v-for="item in prodLines" :key="item.value" :value="item.value" :disabled="item.disabled">
          {{ item.label }}
        </a-select-option>
      </a-select>
      <a-month-picker
        placeholder="请选择月份"
        style="width: 120px"
        allowClear
        :disabled-date="disabledDate"
        v-model="prodDate"
        @change="initData"
      />
      <a-select allowClear v-model="schdMode" style="width: 110px;" placeholder="排程模式">
        <a-select-option key="1" value="MAX_COST">最大耗时</a-select-option>
        <a-select-option key="2" value="SELF_COST">自身耗时</a-select-option>
      </a-select>
      <a-button
        type="primary"
        shape="round"
        :loading="autoSchdLoading"
        :disabled="!prodLine || !prodDate || !schdMode"
        @click="handleAutoSchd"
      >
        自动排程
      </a-button>
      <a-button
        type="primary"
        shape="round"
        ghost
        :loading="genReportLoading"
        v-if="prodLine && prodDate && schdMode && $refs.showStyle1 && $refs.showStyle1.gridPrdSchdOptions.data.length"
        @click="handleGenReport"
      >
        生成报表
      </a-button>
      <a-select
        title="数据呈现的样式"
        style="width: 90px;"
        v-if="prodLine && prodDate && schdMode && $refs.showStyle1 && $refs.showStyle1.gridPrdSchdOptions.data.length"
        v-model="dataShowStyle"
      >
        <a-select-option value="1">样式一</a-select-option>
        <a-select-option value="2">样式二</a-select-option>
      </a-select>
      <!-- <a-switch
      title="局部数据测试"
      v-show="!!prodLine && !!prodDate && gridPrdSchdOptions.data.length"
      style="margin-left: 10px;"
      checked-children="开启调试"
      un-checked-children="关闭调试"
      :checked="isInspection"
      @change="isInspection = !isInspection"
      /> -->
    </div>
    <!-- <Debug v-if="isInspection" style="margin-top: 5px;"></Debug> -->

    <ShowStyle1
      v-show="dataShowStyle === '1'"
      ref="showStyle1"
      :prodLine="prodLine"
      :prodDate="prodDate"
      :schdMode="schdMode"
      @chart="showChart"
    ></ShowStyle1>
    <ShowStyle2 v-show="dataShowStyle === '2'" ref="showStyle2" :data="tblData"></ShowStyle2>
    <Chart ref="chart"></Chart>
  </div>
</template>

<script>
import moment from 'moment'
import printjs from 'print-js'
import { autoSchedule, getPrdSchdReport } from '@/api/prod'

import ShowStyle2 from './showStyle2'
import ShowStyle1 from './showStyle1'
import Debug from './debug'
import Chart from './chart'

export default {
  components: {
    Chart,
    Debug,
    ShowStyle1,
    ShowStyle2
  },
  data () {
    return {
      prodLine: 'N',
      prodDate: moment(),
      schdMode: 'MAX_COST',
      phases: [],

      isInspection: false,

      dataShowStyle: '1',
      schdSearchLoading: false,
      autoSchdLoading: false,
      genReportLoading: false,

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
      tblData: []
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
          moment()
            .add(-2, 'years')
            .endOf('year') ||
          current >
            moment()
              .add(1, 'years')
              .endOf('year'))
      )
    },
    /**
     * @description: 初始化数据
     * @return void
     */
    initData () {
      // this.gridPrdOptions.data = []
      this.$refs.showStyle1.gridPrdSchdOptions.data = []
      this.$refs.showStyle1.gridPrdPhsOptions.data = []
      this.$refs.showStyle1.currPrdSchdRow = null
      this.tblData = []
    },
    /**
     * @description: 生产报表
     * @return void
     */
    async handleGenReport () {
      if (this.dataShowStyle === '1') {
        this.genReportLoading = true
        const data = {
          date: moment(this.prodDate).format('YYYY-MM'),
          data: this.$refs.showStyle1.gridPrdSchdOptions.data
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
          header: `<center><h2>${this.prodDate.format('YYYY-MM')} 排程计划报表</h2></center>`,
          style: '#dataShowStyle2 table { margin: 25px 0; border-top: 1px solid rgba(0, 0, 0, 0.377); }'
        })
      }
    },
    /**
     * @description: 自动排程
     * @return void
     */
    async handleAutoSchd () {
      this.autoSchdLoading = true
      this.$refs.showStyle1.gridPrdSchdOptions.loading = true
      this.$refs.showStyle1.gridPrdPhsOptions.loading = true

      const date = moment(this.prodDate).format('YYYY-MM')
      await autoSchedule(this.prodLine, date, this.schdMode)
        .then(res => {
          if (res.result) {
            if (res.data.length) {
              const data = res.data.map(el => {
                el.phases = el.phases.map(phs => {
                  phs.ppi_phs_start = phs.ppi_phs_start.substr(8)
                  phs.ppi_phs_complete = phs.ppi_phs_complete.substr(8)
                  return phs
                })
                return el
              })
              this.$refs.showStyle1.gridPrdSchdOptions.data = data

              this.tblData = data
              this.$nextTick(() => {
                this.$refs.showStyle1.gridPrdPhsOptions.data = data[0].phases
                this.$refs.showStyle1.$refs.xGridPrdSchd.setCurrentRow(data[0])
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
      this.$refs.showStyle1.gridPrdSchdOptions.loading = false
      this.$refs.showStyle1.gridPrdPhsOptions.loading = false
    },
    showChart (data) {
      this.$refs.chart.handleSetChartData(data)
    }
  }
}
</script>

<style lang="less" scoped>
.operation-bar {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}

@media screen and (min-width: 500px) {
  .operation-bar {
    width: 500px;
  }
}
</style>
