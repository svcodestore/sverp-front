<!--
 * @Author: yanbuw1911
 * @Date: 2021-03-04 14:10:55
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-04-13 11:21:08
 * @Description: 样式二
 * @FilePath: /sverp-front/src/views/PROD/AutoSchedule/prodSchd/showStyle2.vue
-->
<template>
  <div id="dataShowStyle2">
    <table v-for="(t, i) in tblData" :key="i" @mouseenter="prettyShow" @mouseleave="resumeStyle" :title="t.title">
      <tr>
        <td>{{ i + 1 }}</td>
        <td v-for="(v, idx) in t.phases" :key="idx" v-html="v" :class="idx < 6 ? 'common-field-td' : ''"></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    tblData () {
      const arr = []
      this.data.forEach(item => {
        const commonFields = ['客户代号', '客户订单号', '工厂品号', '订单数量', '计划数量', '生产单位']
        const vals = [
          // eslint-disable-next-line camelcase
          item.ppi_customer_no,
          // eslint-disable-next-line camelcase
          item.ppi_customer_pono,
          // eslint-disable-next-line camelcase
          item.ppi_prd_item,
          // eslint-disable-next-line camelcase
          item.ppi_po_qty,
          // eslint-disable-next-line camelcase
          item.ppi_expected_qty,
          // eslint-disable-next-line camelcase
          item.ppi_workshop_name
        ]
        const keys = commonFields.map(field => `<span class="common-field">${field}</span><br>`)
        const values = vals.map(value => `<span class="common-field">${value}</span><br>`)

        item.phases.forEach(e => {
          const {
            // eslint-disable-next-line camelcase
            map_ppi_phs,
            // eslint-disable-next-line camelcase
            map_ppi_isvice,
            // eslint-disable-next-line camelcase
            map_ppi_cost_time,
            // eslint-disable-next-line camelcase
            ppi_phs_start,
            // eslint-disable-next-line camelcase
            ppi_phs_complete
          } = e
          keys.push(
            // eslint-disable-next-line camelcase
            `<span title="工序">${map_ppi_phs}${
              // eslint-disable-next-line camelcase
              map_ppi_isvice === '1' ? '·副' : ''
              // eslint-disable-next-line camelcase
            }</span><span class="header-split-line">|</span><span title="耗时">${map_ppi_cost_time}</span>`
          )
          values.push(
            // eslint-disable-next-line camelcase
            `<br><span class="start-at" title="作业开始时间">${ppi_phs_start}</span><br><span class="complete-at" title="作业结束时间">${ppi_phs_complete}</span>`
          )
        })
        let commonTitle = ''
        commonFields.forEach((k, i) => {
          commonTitle += `${k} | ${vals[i]}\n`
        })
        arr.push({
          title: commonTitle,
          phases: keys.map((k, i) => {
            if (i === 10) {
              return `<div style="page-break-after: always;">${k}\n${values[i]}</div>`
            }
            return `<div>${k}\n${values[i]}</div>`
          })
        })
      })

      return arr
    }
  },
  methods: {
    prettyShow (e) {
      const commonFields = e.target.querySelectorAll('.common-field-td')
      for (const el of commonFields) {
        el.style.display = 'none'
      }
    },
    resumeStyle (e) {
      const commonFields = e.target.querySelectorAll('.common-field-td')
      for (const el of commonFields) {
        el.style.display = 'table-cell'
      }
    }
  }
}
</script>

<style lang="less" scoped>
#dataShowStyle2 {
  overflow: auto;
  height: 600px;
  margin: 10px 0;
  padding: 0 10px;

  table {
    margin: 5px 0;
    text-align: center;
    width: 100%;

    tr:hover {
      font-size: 18px;
      background-color: #fff;
      cursor: pointer;

      td {
        border-radius: 10px;
        padding: 0 10px;
        box-shadow: 18px 18px 40px rgba(0, 0, 0, 0.2), -18px -18px 40px rgba(255, 255, 255, 1);
        transition: box-shadow 0.2s ease-in-out;
      }

      td:hover {
        padding: 0 10px;

        /deep/.start-at {
          position: relative;
          color: #78d3f8;
          text-decoration: none;
        }
        /deep/.start-at:before {
          -webkit-transition: all 0.4s ease-in-out;
          -moz-transition: all 0.4s ease-in-out;
          transition: all 0.4s ease-in-out;
          position: absolute;
          right: 50%;
          left: 50%;
          bottom: -2px;
          display: block;
          height: 1px;
          background-color: #78d3f8;
          content: '';
        }
        /deep/.start-at:hover:before {
          right: 0;
          left: 0;
        }

        /deep/.complete-at {
          position: relative;
          color: #61ddaa;
          text-decoration: none;
        }
        /deep/.complete-at:before {
          -webkit-transition: all 0.4s ease-in-out;
          -moz-transition: all 0.4s ease-in-out;
          transition: all 0.4s ease-in-out;
          position: absolute;
          right: 50%;
          left: 50%;
          bottom: -2px;
          display: block;
          height: 1px;
          background-color: #61ddaa;
          content: '';
        }
        /deep/.complete-at:hover:before {
          right: 0;
          left: 0;
        }

        /deep/.header-split-line {
          color: #eef;
        }
        background-color: #f2feefc4;
        font-weight: 900;

        box-shadow: 0 0 0 rgba(0, 0, 0, 0.2), 0 0 0 rgba(255, 255, 255, 1), inset 20px 20px 40px rgba(0, 0, 0, 0.2),
          inset -20px -20px 40px rgba(255, 255, 255, 1);
        transition: box-shadow 0.2s ease-out;
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  #dataShowStyle2 {
    font-size: 12px;
  }
}
</style>
