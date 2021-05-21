<!--
 * @Author: yanbuw1911
 * @Date: 2021-05-18 16:05:57
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-05-20 09:12:58
 * @Description: JSTW 核薪考勤代扣
 * @FilePath: /sverp-front/src/views/HRD/KPI/setting/JSTW_Commute.vue
-->
<template>
  <div>
    <vxe-toolbar print>
      <template #buttons>
        <a-button shape="circle" @click="getData">
          <a-icon type="reload"></a-icon>
        </a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      align="center"
      border
      :loading="loading"
      resizable
      show-footer
      height="800"
      :print-config="{}"
      :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
      :column-config="{ width: 90 }"
      :data="tableData"
    >
      <vxe-table-colgroup :title="date + 'JSTW 核薪考勤代扣款月明細'">
        <vxe-table-colgroup :title="date + '應出勤天數:'">
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="staffNo" title="員工編號"></vxe-table-column>
          <vxe-table-column
            :edit-render="{ name: 'input', attrs: { type: 'text' } }"
            field="name"
            title="姓名"
          ></vxe-table-column>
          <vxe-table-column
            :edit-render="{ name: '$input', props: { type: 'date', placeholder: '请选择日期' } }"
            field="joinDate"
            title="到職日期"
          ></vxe-table-column>
        </vxe-table-colgroup>
        <vxe-table-colgroup :title="String(daysInMonth)">
          <vxe-table-column
            :edit-render="{ name: '$input', props: { type: 'date', placeholder: '请选择日期' } }"
            field="currJoinDate"
            title="當月到職日"
          ></vxe-table-column>
          <vxe-table-column
            :edit-render="{ name: '$input', props: { type: 'date', placeholder: '请选择日期' } }"
            field="leaveDate"
            title="當月離職日"
          ></vxe-table-column>
          <vxe-table-column
            :edit-render="{ name: 'input', attrs: { type: 'text' } }"
            defaultValue="JS0"
            field="positionRank"
            title="職級"
          ></vxe-table-column>
          <vxe-table-column
            :edit-render="{ name: 'input', attrs: { type: 'text' } }"
            field="status"
            title="直間"
          ></vxe-table-column>
          <vxe-table-column
            :edit-render="{ name: 'input', attrs: { type: 'number' } }"
            field="commuteDays"
            title="本月在崗天數"
          ></vxe-table-column>
        </vxe-table-colgroup>
        <vxe-table-colgroup title="本月調班天數：">
          <vxe-table-colgroup title="加班前2H時數薪資(A)">
            <vxe-table-column
              :edit-render="{ name: 'input', attrs: { type: 'number' } }"
              field="first2hOvertime"
              title="時數"
            ></vxe-table-column>
          </vxe-table-colgroup>
          <vxe-table-colgroup title="加班後2H時數薪資(B)">
            <vxe-table-column
              :edit-render="{ name: 'input', attrs: { type: 'number' } }"
              field="later2hOvertime"
              title="時數"
            ></vxe-table-column>
          </vxe-table-colgroup>
          <vxe-table-colgroup title="假日加班8小時(前)">
            <vxe-table-column
              :edit-render="{ name: 'input', attrs: { type: 'number' } }"
              field="dayoffOvertime"
              title="時數"
            ></vxe-table-column>
          </vxe-table-colgroup>
          <vxe-table-colgroup title="國定假日加班8小時">
            <vxe-table-column
              :edit-render="{ name: 'input', attrs: { type: 'number' } }"
              field="holidayOvertime"
              title="時數"
            ></vxe-table-column>
          </vxe-table-colgroup>
          <vxe-table-colgroup title="特休換薪">
            <vxe-table-column
              :edit-render="{ name: 'input', attrs: { type: 'number' } }"
              field="restOvertime"
              title="時數"
            ></vxe-table-column>
          </vxe-table-colgroup>
        </vxe-table-colgroup>
        <vxe-table-colgroup>
          <vxe-table-colgroup title="請假扣款明細(所得扣項)">
            <vxe-table-column
              :edit-render="{ name: 'input', attrs: { type: 'number' } }"
              field="leave"
              title="事假時數"
            ></vxe-table-column>
            <vxe-table-column
              :edit-render="{ name: 'input', attrs: { type: 'number' } }"
              field="sick"
              title="病假時數"
            ></vxe-table-column>
            <vxe-table-column
              :edit-render="{ name: 'input', attrs: { type: 'number' } }"
              field="rest"
              title="特休"
            ></vxe-table-column>
            <vxe-table-column
              :edit-render="{ name: 'input', attrs: { type: 'number' } }"
              field="salaryDayoff"
              title="有薪假"
            ></vxe-table-column>
            <vxe-table-column
              :edit-render="{ name: 'input', attrs: { type: 'number' } }"
              field="nonSalaryDayoff"
              title="無薪假時數"
            ></vxe-table-column>
          </vxe-table-colgroup>
          <vxe-table-column
            :edit-render="{ name: 'input', attrs: { type: 'number' } }"
            field="mealPrice"
            title="餐費扣款"
          ></vxe-table-column>
          <vxe-table-column
            :edit-render="{ name: 'input', attrs: { type: 'number' } }"
            field="otherDeduction"
            title="其它扣項"
          ></vxe-table-column>
          <vxe-table-column
            :edit-render="{ name: 'input', attrs: { type: 'number' } }"
            field="dismissDeduction"
            title="勞退6%扣項"
          ></vxe-table-column>
          <vxe-table-column
            :edit-render="{ name: 'input', attrs: { type: 'number' } }"
            field="estimatedLaborInsurance"
            title="預估自付勞保費"
          ></vxe-table-column>
          <vxe-table-column
            :edit-render="{ name: 'input', attrs: { type: 'number' } }"
            field="laborInsurance"
            title="實際自付勞保費"
          ></vxe-table-column>
          <vxe-table-column
            :edit-render="{ name: 'input', attrs: { type: 'number' } }"
            field="estimatedHealthInsurance"
            title="預估自付健保費"
          ></vxe-table-column>
          <vxe-table-column
            :edit-render="{ name: 'input', attrs: { type: 'number' } }"
            field="familyHealthInsurance"
            title="健保費-眷屬"
          ></vxe-table-column>
          <vxe-table-column
            :edit-render="{ name: 'input', attrs: { type: 'number' } }"
            field="healthInsurance"
            title="實際自付健保費"
          ></vxe-table-column>
          <vxe-table-column
            :edit-render="{ name: 'input', attrs: { type: 'number' } }"
            field="estimatedObtain"
            title="預估勞退自提"
          ></vxe-table-column>
          <vxe-table-column
            :edit-render="{ name: 'input', attrs: { type: 'number' } }"
            field="obtain"
            title="實際自提勞退費"
          ></vxe-table-column>
          <vxe-table-column
            :edit-render="{ name: 'input', attrs: { type: 'number' } }"
            field="insuredAmount"
            title="投保金額"
          ></vxe-table-column>
          <vxe-table-column
            :edit-render="{ name: 'input', attrs: { type: 'number' } }"
            field="insuredDays"
            title="投保天數"
          ></vxe-table-column>
          <vxe-table-column
            :edit-render="{ name: 'input', attrs: { type: 'text' } }"
            field="ramark"
            title="備註"
          ></vxe-table-column>
        </vxe-table-colgroup>
      </vxe-table-colgroup>
    </vxe-table>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      loading: false,
      date: moment().format('YYYY年MM月'),
      daysInMonth: moment().daysInMonth(),
      tableData: [
        // {
        //   staffNo: '123',
        //   name: '456',
        //   joinDate: '',
        //   currJoinDate: '',
        //   leaveDate: '',
        //   positionRank: '',
        //   status: '',
        //   commuteDays: null,
        //   first2hOvertime: null,
        //   later2hOvertime: null,
        //   dayoffOvertime: null,
        //   holidayOvertime: null,
        //   restOvertime: null,
        //   leave: null,
        //   sick: null,
        //   rest: null,
        //   salaryDayoff: null,
        //   nonSalaryDayoff: null,
        //   mealPrice: null,
        //   otherDeduction: null,
        //   dismissDeduction: null,
        //   estimatedLaborInsurance: null,
        //   laborInsurance: null,
        //   estimatedHealthInsurance: null,
        //   familyHealthInsurance: null,
        //   healthInsurance: null,
        //   estimatedObtain: null,
        //   obtain: null,
        //   insuredAmount: null,
        //   insuredDays: null,
        //   ramark: ''
        // }
      ]
    }
  },
  methods: {
    async getData () {
      this.loading = true
      const invisiblePersons = ['JS0212', 'JS0016', 'JS0127', 'JS0153']
      await this.$axios
        .post('http://192.168.123.51:9600/webApi/test/dbfreader', this.$qs.stringify({ loc: 'JS' }))
        .then(res => {
          this.tableData = res
            .sort((a, b) => a.staffNo.substr(2) - b.staffNo.substr(2))
            .filter(e => !invisiblePersons.includes(e.staffNo))
        })
        .catch(() => {
          this.loading = false
        })
      this.loading = false
    }
  }
}
</script>
