<!--
 * @Author: yanbuw1911
 * @Date: 2021-01-08 11:08:16
 * @LastEditTime: 2021-04-19 07:47:01
 * @LastEditors: yanbuw1911
 * @Description: 出库管理
 * @FilePath: /sverp-front/src/views/HRD/MaterialManagement/storehouse/outbound.vue
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
      @cancel=";(outboundVisible = false), (detailGridCurrRow = null)"
    >
      <div class="outbound-detail-bar">
        <div class="bar" v-show="!isPrinting">
          <a-popconfirm
            placement="bottom"
            title="确认通过下列用料申请吗"
            :ok-text="$t('confirm')"
            :cancel-text="$t('cancel')"
            :disabled="popconfirmDisabled"
            @confirm="submitApprove"
            @cancel="popconfirmDisabled = true"
          >
            <a-button type="primary" @click="handleApprove" v-if="!gridCurrRow.hoo_is_approved">通过</a-button>
          </a-popconfirm>
          <a-button @click="handlePrint">打印</a-button>
        </div>
      </div>
      <div id="outbound-detail-grid-printable">
        <sv-grid v-bind="detailGridOptions" ref="detailGrid" v-on="detailGridEvts">
          <template #toolbar>
            <center style="letter-spacing: 16px;font-weight: bolder;"><h1>东莞斯达文星皮具有限公司</h1></center>
            <center style="letter-spacing: 12px;font-weight: bolder;"><h2>出库清单</h2></center>
            <a-row class="outbound-detail-field">
              <a-col :span="8">
                日期：<span>{{ `${gridCurrRow.hoo_join_date.substr(0, 10)}` }}</span>
              </a-col>
              <a-col :span="8">
                制单人：<span>{{ gridCurrRow.hoo_creator }}</span>
              </a-col>
              <a-col :span="7">
                部门：<span>{{ gridCurrRow.cdw_name }}</span>
              </a-col>
              <a-col :span="1">
                <a-button
                  v-show="!isPrinting"
                  type="danger"
                  shape="circle"
                  size="small"
                  title="删除"
                  :disabled="!detailGridCurrRow"
                  @click="handleDelOutboundMaterial"
                >
                  <a-icon type="delete"></a-icon>
                </a-button>
              </a-col>
            </a-row>
          </template>
        </sv-grid>
        <a-row class="outbound-detail-field">
          <a-col :span="8">
            发料人：
          </a-col>
          <a-col :span="8">
            审核人：<span>{{ gridCurrRow.approver_name }}</span>
          </a-col>
          <a-col :span="8">
            领料员：
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getOutboundOrder, getOutboundMaterialList, approveOutbound, delOutboundMaterial } from '@/api/hrd'

export default {
  data () {
    return {
      modalTitle: '出库单详情',
      modalClosable: true,
      outboundVisible: false,
      isPrinting: false,
      gridOptions: {
        class: 'outbound-svgrid',
        border: 'none',
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
            field: 'hoo_creator',
            sortable: true
          },
          {
            title: '审核人',
            field: 'approver_name',
            sortable: true
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
        refresh: this.getData,
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
      },
      detailGridEvts: {
        'current-change': this.handleDetailCurrChg
      },
      detailGridCurrRow: void 0,
      popconfirmDisabled: true
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    async getData () {
      this.gridOptions.loading = true
      await getOutboundOrder().then(
        res =>
          res.result &&
          (this.gridOptions.data = res.data.map(e => {
            e.creator_name && (e.hoo_creator = e.creator_name)
            return e
          }))
      )
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
    async submitApprove () {
      const data = {
        outboundId: this.gridCurrRow.id,
        approver: this.userInfo.con_id,
        stock: {
          usr: this.gridCurrRow.creator_id || this.gridCurrRow.hoo_creator,
          data: this.detailGridOptions.data.map(e => ({ materialId: e.hom_material_id, qty: e.hom_out_qty }))
        }
      }
      const opt = this.$refs.detailGrid.getGridOpt()
      opt && (data.modify = opt)

      await approveOutbound(data).then(res => {
        if (res.result) {
          this.$notification.success({
            message: '已审核',
            icon: <a-icon type="smile" style="color: #108ee9" />
          })

          this.outboundVisible = false
          this.getOutboundOrder()
        } else {
          this.$notification.error({
            message: '审核失败',
            icon: <a-icon type="frown" style="color: #108ee9" />
          })
        }
      })
    },
    async handleApprove () {
      let err
      await this.$refs.detailGrid.fullValidate().catch(e => {
        err = e
      })
      this.popconfirmDisabled = !!err
    },
    validator ({ cellValue }) {
      if (Number(cellValue) === 0 || Number.isNaN(Number(cellValue))) {
        this.$message.error('无效的数量')
        return new Error('无效的数量')
      } else if (Number(cellValue) > Number(this.detailGridCurrRow.hmu_material_stock)) {
        this.$message.error('数量不能超过库存' + this.detailGridCurrRow.hmu_material_stock)
        return new Error('数量不能超过库存' + this.detailGridCurrRow.hmu_material_stock)
      }
    },
    handleDetailCurrChg ({ row }) {
      this.detailGridCurrRow = row
    },
    async handleDelOutboundMaterial () {
      await delOutboundMaterial(this.detailGridCurrRow.id).then(res => {
        if (res.result) {
          this.detailGridCurrRow = null
          this.$message.success('删除成功')
          getOutboundMaterialList(this.gridCurrRow.id).then(
            res => res.result && (this.detailGridOptions.data = res.data)
          )
        } else {
          this.$message.error('删除失败')
        }
      })
    }
  },
  async mounted () {
    await this.getData()
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
