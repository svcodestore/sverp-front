<!--
 * @Author: yanbuw1911
 * @Date: 2021-05-08 10:14:58
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-05-20 09:26:49
 * @Description: KPI 报表
 * @FilePath: /sverp-front/src/views/HRD/KPI/view/report.vue
-->
<template>
  <div>
    <div class="search-bar">
      <a-input-search
        style="width: 15rem;"
        placeholder="输入工号或姓名查询"
        enter-button
        @search="onSearch"
        @change="isShowReport = false"
      />
      <div class="right" v-if="isShowReport">
        <a-switch checked-children="空白表格" un-checked-children="默认表格" />
        <a-button style="margin-left: 0.3rem;" @click="printReport">打印</a-button>
      </div>
    </div>
    <div class="report-container" id="report-container" v-if="isShowReport">
      <h1>
        <b>
          东莞斯达文星皮具有限公司
        </b>
      </h1>
      <h2>
        <b>
          新创行销设计中心绩效考核表(2021年05月)
        </b>
      </h2>
      <div class="report-table">
        <table class="header-table">
          <tr>
            <td colspan="8">
              <b>-</b>
            </td>
          </tr>
          <tr>
            <td colspan="4">2</td>
            <td colspan="4">32</td>
          </tr>
          <tr>
            <td colspan="8">
              <b>-</b>
            </td>
          </tr>
          <tr>
            <td>组别</td>
            <td>-</td>
            <td>姓名</td>
            <td>-</td>
            <td>职级</td>
            <td>-</td>
            <td>职称</td>
            <td>-</td>
          </tr>
          <tr>
            <td>职务</td>
            <td>-</td>
            <td>工号</td>
            <td>-</td>
            <td colspan="2">入职日期</td>
            <td colspan="2">-年-月-日</td>
          </tr>
          <tr>
            <td colspan="4">团队KPI考评</td>
            <td colspan="4">个人KPI考评</td>
          </tr>
          <tr>
            <td>编号</td>
            <td>项目</td>
            <td>分值</td>
            <td>小计得分</td>
            <td>项目</td>
            <td>分值</td>
            <td>小计得分</td>
            <td>签名</td>
          </tr>
        </table>

        <table class="score-table">
          <tr>
            <td>K001</td>
            <td>月出貨金額達成率</td>
            <td>10%</td>
            <td rowspan="2"></td>
            <td rowspan="3">副理考核</td>
            <td rowspan="3">30%</td>
            <td rowspan="3"></td>
            <td rowspan="3"></td>
          </tr>
          <tr>
            <td colspan="3">
              实际数据： KPI得分：
            </td>
          </tr>
          <tr>
            <td>K035_10_3</td>
            <td>工作完成率</td>
            <td>30%</td>
            <td rowspan="2"></td>
          </tr>
          <tr>
            <td colspan="3">
              实际数据： KPI得分：
            </td>
            <td rowspan="3">科长考核</td>
            <td rowspan="3">10%</td>
            <td rowspan="3"></td>
            <td rowspan="3"></td>
          </tr>
          <tr>
            <td>K035_11_1_4</td>
            <td>7S完成率</td>
            <td>20%</td>
            <td rowspan="2"></td>
          </tr>
          <tr>
            <td colspan="3">
              实际数据： KPI得分：
            </td>
          </tr>
        </table>

        <table class="footer-table">
          <tr>
            <td colspan="2">本人签名：</td>
            <td colspan="2"></td>
            <td colspan="2">总计得分：</td>
            <td colspan="2"></td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import printjs from 'print-js'

export default {
  data () {
    return {
      isShowReport: false
    }
  },
  methods: {
    onSearch (value) {
      console.log(value)
      this.isShowReport = true
    },
    printReport () {
      printjs({
        printable: 'report-container',
        type: 'html'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search-bar {
  width: 100%;
  margin-bottom: 1.5rem;
  display: flex;

  .right {
    margin-left: auto;
  }
}

.report-container {
  height: 45rem;
  overflow: auto;

  h1 {
    text-align: center;
    b {
      letter-spacing: 0.3rem;
      font-size: 1.8rem;
    }
  }

  h2 {
    text-align: center;
    b {
      font-size: 1.5rem;
    }
  }

  .report-table {
    width: 100%;

    table {
      width: 100%;
      tr {
        td {
          width: 12.5%;
          text-align: center;
          border: 1px solid black;
          height: 4rem;
        }
      }
    }

    .header-table {
      tr:nth-child(1) {
        td {
          font-size: 1.2rem;
          height: 5rem;
        }
      }

      tr:nth-child(2) {
        td {
          height: 16rem;
        }
      }

      tr:nth-child(3) {
        td {
          font-size: 1.2rem;
          height: 5rem;
        }
      }
    }
  }
}
</style>
