<!--
 * @Author: yanbuw1911
 * @Date: 2021-03-04 14:10:44
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-03-05 08:17:23
 * @Description: 样式一
 * @FilePath: /sverp-front/src/views/PROD/AutoSchedule/prodSchd/showStyle1.vue
-->
<template>
  <div>
    <a-row :gutter="10">
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="11">
        <sv-grid
          ref="xGridPrdSchd"
          v-bind="gridPrdSchdOptions"
          v-if="!!prodLine && !!prodDate && gridPrdSchdOptions.data.length"
          v-on="gridPrdSchdEvts"
        >
          <template #svgridToolbar>
            <a-button title="图表" shape="circle" @click="handleSetChartData">
              <a-icon type="bar-chart" />
            </a-button>
          </template>
        </sv-grid>
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="13">
        <sv-grid
          ref="xGridPrdPhs"
          v-bind="gridPrdPhsOptions"
          v-if="!!prodLine && !!prodDate && gridPrdSchdOptions.data.length"
        >
          <template #ismaster="{ row, column }">
            <a-icon type="tag" v-if="row[column.property] === 1" title="主流程" />
            <a-icon type="tags" v-else title="辅流程" />
          </template>
        </sv-grid>
      </a-col>
    </a-row>
  </div>
</template>

<script>
const cnf = {
  refreshBtn: false,
  searchBar: false,
  zoomBtn: false,
  showOverflow: false,
  showHeaderOverflow: false,
  border: 'none',
  rowId: 'prdoid',
  height: 550
}

export default {
  props: {
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
  data () {
    return {
      currPrdSchdRow: null,
      gridPrdSchdOptions: {
        ...cnf,
        data: [],
        title: '生产排程表',
        loading: false,
        id: 'full_edit_3',
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
      gridPrdSchdEvts: {
        'current-change': this.currPrdSchdRowChg
      },
      gridPrdPhsOptions: {
        ...cnf,
        data: [],
        title: '排程工序表',
        loading: false,
        id: 'full_edit_2',
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
            align: 'center',
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
  methods: {
    handleSetChartData () {
      this.$emit('chart', [this.gridPrdSchdOptions.data])
    },
    /**
     * @description: 生产单表格当前行变化事件
     * @param Object row
     * @return void
     */
    currPrdSchdRowChg ({ row }) {
      this.currPrdSchdRow = row
      this.gridPrdPhsOptions.data = row.phases
    }
  }
}
</script>
