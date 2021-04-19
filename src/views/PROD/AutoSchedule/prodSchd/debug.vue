<!--
 * @Author: yanbuw1911
 * @Date: 2021-03-04 14:20:24
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-03-04 14:20:25
 * @Description: 调试
 * @FilePath: /sverp-front/src/views/PROD/AutoSchedule/prodSchd/debug.vue
-->
<template>
  <div>
    <div>
      生产单：
      <a-select
        placeholder="请选择调试的生产单"
        mode="multiple"
        v-model="inspectParam.prodList"
        style="width: 400px; margin-right: 5px;"
      >
        <a-select-option v-for="item in data" :key="item.prdoid" :value="item.prdoid">
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
</template>

<script>
import dayjs from 'dayjs'
import {
  inspectSchedule
} from '@/api/prod'

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    prodDate: {
      type: Object,
      default: () => null
    },
    prodLine: {
      type: String,
      default: () => 'N'
    },
    schdMode: {
      type: String,
      default: () => 'MAX_COST'
    }
  },
  data: () => ({
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
    schdInspectLoading: false
  }),
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

<style></style>
