<!--
 * @Author: yanbuw1911
 * @Date: 2021-03-04 14:11:23
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-03-04 16:12:48
 * @Description: 图表
 * @FilePath: /sverp-front/src/views/PROD/AutoSchedule/prodSchd/chart.vue
-->
<template>
  <div>
    <a-modal
      centered
      title="生产单图表"
      :width="modalWidth"
      :footer="null"
      v-model="prdSchdVisible"
      @cancel="handleModalOncancel"
    >
    </a-modal>
  </div>
</template>

<script>
import { Chart } from '@antv/g2'
import DataSet from '@antv/data-set'
export default {
  data: () => ({
    modalWidth: 900,
    prdSchdVisible: false
  }),
  methods: {
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
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-modal-body {
  display: flex;
  overflow: auto;
}
</style>
