<!--
 * @Author: yanbuw1911
 * @Date: 2021-01-08 11:08:16
 * @LastEditTime: 2021-01-21 16:55:49
 * @LastEditors: yanbuw1911
 * @Description: 出库管理
 * @FilePath: \client\src\views\HRD\MaterialManagement\storehouse\outbound.vue
-->
<template>
  <div>
    <sv-grid v-bind="gridOptions" v-on="gridEvts">
      <template #approveStatus="{row, column}">
        <a-tag color="green" v-if="row[column.property] === 1">
          已审核
        </a-tag>
        <a-tag color="blue" v-else>
          未审核
        </a-tag>
      </template>
    </sv-grid>
    <a-modal
      :title="modalTitle"
      :closable="modalClosable"
      v-model="outboundVisible"
      :width="900"
      :keyboard="false"
      :maskClosable="false"
      :destroyOnClose="true"
      :footer="null"
      @ok="outboundVisible = false"
      @cancel="outboundVisible = false"
    >
      <div class="outbound-detail-bar">
        <div class="bar" v-show="!isPrinting">
          <a-button type="primary" @click="handleApprove" v-if="!gridCurrRow.hoo_is_approved">审核</a-button>
          <a-button @click="handlePrint">打印</a-button>
        </div>
      </div>
      <div id="outbound-detail-grid-printable">
        <sv-grid v-bind="detailGridOptions" ref="detailGrid">
          <template #toolbar>
            <center style="letter-spacing: 16px;font-weight: bolder;"><h1>东莞斯达文星皮具有限公司</h1></center>
            <center style="letter-spacing: 12px;font-weight: bolder;"><h2>出库清单</h2></center>
            <a-row class="outbound-detail-field">
              <a-col :span="4">
                日期：<span>{{ `${gridCurrRow.hoo_join_date.substr(0, 10)}` }}</span>
              </a-col>
              <a-col :span="4">
                制单人：<span>{{ gridCurrRow.hoo_creator }}</span>
              </a-col>
              <a-col :span="4">
                部门：<span>{{ gridCurrRow.cdw_name }}</span>
              </a-col>
            </a-row>
          </template>
        </sv-grid>
        <a-row class="outbound-detail-field">
          <a-col :span="4">
            发料人：
          </a-col>
          <a-col :span="4">
            审核人：
          </a-col>
          <a-col :span="4">
            领料员：
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOutboundOrder, getOutboundMaterialList, approveOutbound } from '@/api/hrd'

export default {
  data () {
    return {
      modalTitle: '出库单详情',
      modalClosable: true,
      outboundVisible: false,
      isPrinting: false,
      gridOptions: {
        class: 'outbound-svgrid',
        height: 700,
        loading: false,
        rowClassName: this.handleRowColor,
        data: [],
        columns: [
          {
            title: '出库单号',
            field: 'hoo_order_id'
          },
          {
            title: '部门',
            field: 'cdw_name',
            sortable: true
          },
          {
            title: '创建日期',
            field: 'hoo_join_date',
            sortable: true
          },
          {
            title: '创建人',
            field: 'hoo_creator'
          },
          {
            title: '审核状态',
            field: 'hoo_is_approved',
            slots: { default: 'approveStatus' },
            filters: [
              { label: '已审核', value: 1 },
              { label: '未审核', value: 0 }
            ]
          }
        ]
      },
      gridCurrRow: {},
      gridEvts: {
        refresh: this.getOutboundOrder,
        'cell-dblclick': this.handleDblClick
      },
      detailGridOptions: {
        showOverflow: false,
        height: null,
        data: [],
        editRules: {
          hom_apply_qty: [{ validator: this.validator }],
          hom_out_qty: [{ validator: this.validator }]
        },
        columns: [
          {
            type: 'seq',
            width: 50
          },
          {
            title: '品名',
            field: 'hmu_material_name'
          },
          {
            title: '规格型号',
            field: 'hmu_material_model'
          },
          {
            title: '单位',
            field: 'hmu_material_unit'
          },
          {
            title: '申请数量',
            field: 'hom_apply_qty'
          },
          {
            title: '出库数量',
            field: 'hom_out_qty'
          },
          {
            title: '备注',
            field: 'hom_remark'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    async getOutboundOrder () {
      this.gridOptions.loading = true
      await getOutboundOrder().then(res => res.result && (this.gridOptions.data = res.data))
      this.gridOptions.loading = false
    },
    handleDblClick ({ row }) {
      this.gridCurrRow = row
      this.outboundVisible = true
      if (row.hoo_is_approved) {
        delete this.detailGridOptions.columns[4].editRender
        delete this.detailGridOptions.columns[5].editRender
        delete this.detailGridOptions.columns[6].editRender
      } else {
        this.detailGridOptions.columns[4].editRender = { name: 'input' }
        this.detailGridOptions.columns[5].editRender = { name: 'input' }
        this.detailGridOptions.columns[6].editRender = { name: 'input' }
      }
      getOutboundMaterialList(row.id).then(res => res.result && (this.detailGridOptions.data = res.data))
    },
    handleRowColor ({ row, rowIndex }) {
      return row.hoo_is_approved === 1 ? 'outbound-svgrid-col-green' : 'outbound-svgrid-col-blue'
    },
    handlePrint () {
      this.isPrinting = true
      this.modalTitle = null
      this.modalClosable = false

      setTimeout(() => {
        window.print()

        setTimeout(() => {
          this.isPrinting = false
          this.modalTitle = '出库单详情'
          this.modalClosable = true
        })
      })
    },
    async handleApprove () {
      const data = {
        outboundId: this.gridCurrRow.id,
        approver: this.userInfo.con_name,
        stock: {
          usr: this.gridCurrRow.hoo_creator,
          data: this.detailGridOptions.data.map(e => ({ materialId: e.hom_material_id, qty: e.hom_out_qty }))
        }
      }
      console.log(this.gridCurrRow, this.detailGridOptions.data)
      let err
      await this.$refs.detailGrid.fullValidate().catch(e => {
        err = e
      })
      if (!err) {
        const opt = this.$refs.detailGrid.getGridOpt()
        opt && (data.modify = opt)
      }

      await approveOutbound(data).then(res => {
        if (res.result) {
          this.$notification.success({
            message: '已审核',
            icon: <a-icon type='smile' style='color: #108ee9' />
          })

          this.outboundVisible = false
          this.getOutboundOrder()
        } else {
          this.$notification.error({
            message: '审核失败',
            icon: <a-icon type='frown' style='color: #108ee9' />
          })
        }
      })
    },
    validator ({ cellValue }) {
      if (!new RegExp(/^\d{1,4}$/).test(cellValue)) {
        return new Error('1-4位数字')
      }
    }
  },
  async mounted () {
    await this.getOutboundOrder()
  }
}
</script>

<style lang="less">
.outbound-svgrid {
  .outbound-svgrid-col-green/deep/ {
    background-color: #ebfadb !important;
  }
}
.outbound-svgrid {
  .outbound-svgrid-col-blue/deep/ {
    background-color: #cbeafac0 !important;
  }
}
</style>

<style lang="less" scoped>
.ant-row/deep/ {
  font-size: 16px !important;
  margin: 8px 0;

  span {
    color: black;
    text-decoration: underline;
  }
}

.outbound-detail-bar {
  display: flex;

  .bar {
    margin-left: auto;

    .ant-btn {
      margin-left: 5px;
    }
  }
}
</style>
