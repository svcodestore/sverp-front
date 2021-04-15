<!--
 * @Author: yanbuw1911
 * @Date: 2021-03-04 14:10:44
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-04-13 11:12:49
 * @Description: 样式一
 * @FilePath: /sverp-front/src/views/PROD/AutoSchedule/prodSchd/showStyle1.vue
-->
<template>
  <div>
    <a-row :gutter="10">
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="10">
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
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="14">
        <sv-grid
          ref="xGridPrdPhs"
          v-bind="gridPrdPhsOptions"
          v-if="!!prodLine && !!prodDate && gridPrdSchdOptions.data.length"
        >
          <template #isvice="{ row, column }">
            <a-icon
              type="tags"
              style="color: rgba(250, 20, 40, 0.69);"
              v-if="row[column.property] === '1'"
              title="辅流程工站"
            />
            <a-icon type="tag" v-else title="主流程工站" />
          </template>
          <template v-slot:phases="{ row }">
            <vxe-grid
              :columns="row.childCols"
              :data="row.childData"
              style="border-top: 1px solid #e8eaec;"
              :cell-class-name="handleCellColor"
            >
              <template #name="{row, column}">
                <a-icon
                  type="tags"
                  title="辅流程"
                  style="color: rgba(250, 20, 40, 0.69);"
                  v-if="row.map_ppi_ismaster === 0"
                />
                <a-icon type="tag" v-else title="主流程" />
                {{ row[column.property] }}
              </template>
            </vxe-grid>
          </template>
        </sv-grid>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getProdItemSubphases } from '@/api/prod'

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
          { type: 'seq', width: 50 },
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
        expandConfig: {
          accordion: true,
          lazy: true,
          loadMethod: this.loadContentMethod
        },
        columns: [
          { type: 'seq', width: 50 },
          {
            field: 'ppi_phs_start',
            title: '开始于',
            width: 110,
            sortable: true
          },
          {
            field: 'ppi_phs_complete',
            title: '完成于',
            width: 110,
            sortable: true
          },
          {
            type: 'expand',
            field: 'map_ppi_isvice',
            title: '流程',
            slots: {
              default: 'isvice',
              content: 'phases'
            },
            width: 60,
            sortable: true
          },
          {
            field: 'map_ppi_cost_time',
            title: '耗时（s）',
            width: 110,
            align: 'right',
            sortable: true
          },
          {
            field: 'map_ppi_phs',
            title: '工站',
            width: 110,
            sortable: true
          },
          {
            field: 'map_ppi_phs_desc',
            title: '描述',
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
      console.log(row)
      this.currPrdSchdRow = row
      this.gridPrdPhsOptions.data = row.phases
    },
    loadContentMethod ({ row }) {
      const prdItem = this.currPrdSchdRow
        ? this.currPrdSchdRow.ppi_prd_item
        : this.gridPrdSchdOptions.data[0].ppi_prd_item
      return getProdItemSubphases(prdItem, row.map_ppi_phsid).then(res => {
        const cols = [
          { type: 'seq', width: 50 },
          {
            field: 'map_ppi_phs_desc',
            title: '名称',
            sortable: true,
            slots: {
              default: 'name'
            }
          },
          {
            align: 'right',
            field: 'map_ppi_cost_time',
            title: '耗时',
            sortable: true
          },
          {
            align: 'right',
            field: 'map_ppi_deadtime',
            title: '停滞时间',
            sortable: true
          },
          {
            field: 'map_ppi_outime',
            title: '外发时间',
            align: 'right',
            sortable: true
          },
          {
            align: 'right',
            field: 'map_ppi_aheadtime',
            title: '前置时间',
            sortable: true
          }
        ]
        const data = res.data
        row.childCols = cols
        row.childData = data
      })
    },
    handleCellColor ({ row, rowIndex, column, columnIndex }) {
      switch (column.property) {
        case 'map_ppi_deadtime':
          return 'deadtime-cell-red'

        case 'map_ppi_outime':
          return 'outime-cell-yellow'

        case 'map_ppi_aheadtime':
          return 'aheadtime-cell-orange'

        case 'map_ppi_cost_time':
          return 'costtime-cell-green'
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.deadtime-cell-red {
  color: #000;
  background-color: rgb(241, 102, 102);
}
/deep/.outime-cell-yellow {
  color: #000;
  background-color: rgba(247, 232, 28, 0.596);
}
/deep/.aheadtime-cell-orange {
  color: #000;
  background-color: rgba(248, 131, 53, 0.801);
}
/deep/.costtime-cell-green {
  color: #000;
  background-color: rgba(245, 171, 11, 0.493);
}
</style>
