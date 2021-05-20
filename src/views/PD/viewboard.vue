<!--
 * @Date: 2021-04-30 14:08:15
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-05-18 10:40:04
 * @FilePath: \sverp-front\src\views\PD\viewboard.vue
-->
<template>
  <div>
    <div>
      <div class="search-row">
        <span>
          审核状态
          <a-select style="width:120px;" v-model="searchParam.sign_status">
            <a-select-option value="2">全部</a-select-option>
            <a-select-option value="1">已审核</a-select-option>
            <a-select-option value="0">未审核</a-select-option>
          </a-select>
        </span>

        <span>
          结案状态
          <a-select style="width:120px;" v-model="searchParam.commit_status">
            <a-select-option value="2">全部</a-select-option>
            <a-select-option value="1">已结案</a-select-option>
            <a-select-option value="0">未结案</a-select-option>
          </a-select>
        </span>

        <span>
          公司
          <a-select style="width:120px;" v-model="searchParam.comply_name">
            <a-select-option v-for="item in companys" :key="item.name" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
        </span>

        <span>
          制单人
          <a-select style="width:120px;" default-value="nothing" v-model="searchParam.cru">
            <a-select-option value="nothing">全部</a-select-option>
            <a-select-option v-for="cru in cruList" :key="cru.CRU" :value="cru.CRU">{{ cru.CRU }}</a-select-option>
          </a-select>
        </span>

        <span>
          采购单号：
          <a-input style="width:200px;" v-model="searchParam.Bt_No" />
        </span>
      </div>

      <div class="search-row">
        <span> 计划交期:<a-range-picker v-model="searchParam.pro_time" /> </span>
        <span> 请购单号:<a-input style="width:200px;" v-model="searchParam.Ask_Nos" /> </span>
        <span> 物料名称：<a-input style="width:200px;" v-model="searchParam.sp_catName" /> </span>
      </div>

      <div class="search-row">
        <span>
          生管日期:
          <a-range-picker v-model="searchParam.sg_time" />
        </span>
        <span>
          <a-button @click="getData">查询</a-button>
          <a-button @click="downExcel">导出表格</a-button>
        </span>
      </div>
    </div>

    <sv-grid v-bind="svgOptions" show-overflow="false" show-header-overflow="false" ref="xTable1">
      <template #showState="{ row, column }">
        <span v-if="row[column.property] == 0">
          <a-tag color="red">未完成</a-tag>
        </span>
        <span v-else>
          <a-tag color="green">已完成</a-tag>
        </span>
      </template>
    </sv-grid>
    <vxe-table
      v-show="csvShow"
      highlight-hover-row
      border="inner"
      ref="xTable1"
      height="300"
      :export-config="{}"
      :data="svgOptions.data"
    >
      <vxe-table-column field="Bt_No" title="采购编号"></vxe-table-column>
      <vxe-table-column field="Ask_Nos" title="请购单号"></vxe-table-column>
      <vxe-table-column field="PC_ID" title="公司名"></vxe-table-column>
      <vxe-table-column field="Sp_No" title="物料编号"></vxe-table-column>
      <vxe-table-column field="Sp_Name" title="物料名称"></vxe-table-column>
      <vxe-table-column field="P_Qty" title="采购数量"></vxe-table-column>
      <vxe-table-column field="Bt_Date" title="采购时间"></vxe-table-column>
      <vxe-table-column field="SG_ASK_DATE" title="生管日期"></vxe-table-column>
      <vxe-table-column field="Due_Date" title="计划交期"></vxe-table-column>
      <vxe-table-column field="Kh_Name" title="厂商名称"></vxe-table-column>
      <vxe-table-column field="KhCfg_Date" title="厂商确认日期"></vxe-table-column>
      <vxe-table-column field="TR_Qty" title="收货数量"></vxe-table-column>
      <vxe-table-column field="shouhuotime" title="收货时间"></vxe-table-column>
      <vxe-table-column field="diff_time" title="差异天数"></vxe-table-column>
      <vxe-table-column field="In_Qty" title="入库数量"></vxe-table-column>
      <vxe-table-column field="rukutime" title="入库时间"></vxe-table-column>
      <vxe-table-column field="CRU" title="制单人"></vxe-table-column>
      <vxe-table-column field="Unit_Name" title="单位"></vxe-table-column>
      <vxe-table-column field="State" title="审核状态"></vxe-table-column>
      <vxe-table-column field="LkState" title="结案状态"></vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
import { getOrders, getCruInfo } from '@/api/pd'
export default {
  props: {
    companys: {
      type: Array,
      default: function () {
        return [
          { value: 'nothing', name: '全部' },
          { value: 'A020', name: '斯达文星' },
          { value: 'A021', name: '斯达富' },
          { value: 'A022', name: '杰仕通' }
        ]
      }
    }
  },
  data () {
    return {
      csvShow: false,
      isShowSearch: false,
      cruList: [],
      searchParam: {
        sign_status: '0',
        commit_status: '0',
        pro_time_star: null,
        pro_time_end: null,
        sg_time_start: null,
        sg_time_end: null,
        comply_name: 'nothing',
        cru: 'nothing',
        Bt_No: null,
        Ask_Nos: null,
        pro_time: null,
        sg_time: null,
        sp_catName: null
      },
      svgOptions: {
        keepSource: true,
        export: true,
        isShowSearch: false,
        refreshBtn: false,
        zoomBtn: false,
        loading: false,
        data: [],
        params: {
          originData: []
        },
        columns: [
          { field: 'Bt_No', title: '采购编号' },
          { field: 'Ask_Nos', title: '请购单号' },
          { field: 'PC_ID', title: '公司名' },
          { field: 'Sp_No', title: '物料编号' },
          { field: 'Sp_Name', title: '物料名称' },
          { field: 'P_Qty', title: '采购数量' },
          { field: 'Bt_Date', title: '采购时间' },
          { field: 'SG_ASK_DATE', title: '生管日期' },
          { field: 'Due_Date', title: '计划交期' },
          { field: 'Kh_Name', title: '厂商名称' },
          { field: 'KhCfg_Date', title: '厂商确认日期' },
          { field: 'TR_Qty', title: '收货数量' },
          { field: 'shouhuotime', title: '收货时间' },
          { field: 'diff_time', title: '差异天数' },
          { field: 'In_Qty', title: '入库数量' },
          { field: 'rukutime', title: '入库时间' },
          { field: 'CRU', title: '制单人' },
          { field: 'Unit_Name', title: '单位' },
          {
            field: 'State',
            title: '审核状态',
            slots: {
              default: 'showState'
            }
          },
          {
            field: 'LkState',
            title: '结案状态',
            slots: {
              default: 'showState'
            }
          }
        ],
        svGridEvents: {
          refresh: this.refreshTable
        }
      }
    }
  },
  methods: {
    getData () {
      this.svgOptions.data = []
      this.searchParam.loading = true
      try {
        this.searchParam.pro_time_star = this.searchParam.pro_time[0].format('YYYY-MM-DD 00:00:00')
        this.searchParam.pro_time_end = this.searchParam.pro_time[1].format('YYYY-MM-DD 23:59:59')
      } catch (e) {}
      try {
        this.searchParam.sg_time_start = this.searchParam.sg_time[0].format('YYYY-MM-DD 00:00:00')
        this.searchParam.sg_time_end = this.searchParam.sg_time[1].format('YYYY-MM-DD 23:59:59')
      } catch (e) {}

      getOrders(this.searchParam).then(res => {
        this.svgOptions.data = res
        this.searchParam.loading = false
      })
    },
    downExcel () {
      this.$refs.xTable1.exportData({ type: 'csv' })
    }
  },
  mounted () {
    getCruInfo().then(res => {
      this.cruList = res
    })
    this.searchParam.comply_name = this.companys[0].value
  }
}
</script>

<style lang="less" scoped>
.search-row {
  margin: 10px 0;

  span {
    margin: 0 5px;

    button {
      margin-right: 5px;
    }
  }
}
</style>
