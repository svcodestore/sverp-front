<!--
 * @Date: 2021-04-19 14:12:58
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-05-25 14:36:09
 * @FilePath: \sverp-front\src\views\BS\index.vue
-->
<template>
  <div>
    <div class="search-form">
      <label for="">
        客户单号：
        <a-input v-model="searchParam.customOrderNum" style="width:120px;" />
      </label>

      <label>存货编号：<a-input v-model="searchParam.storageGoodsNum" style="width:120px;"/></label>
      <label>客商编号:<a-input v-model="searchParam.khGoodsNum" style="width:120px;"/></label>
      <label>
        公司:
        <a-select style="width:120px;" v-model="searchParam.company" default-value="1">
          <a-select-option :value="1">斯达文星</a-select-option>
          <a-select-option :value="2">杰士通</a-select-option>
        </a-select>
      </label>
      <label>
        表格
        <a-select
          style="width:120px;"
          v-model="searchParam.tableType"
          :default-value="searchParam.tableType"
          @change="handleTableChange"
        >
          <a-select-option value="normal">普通版</a-select-option>
          <a-select-option value="detail">明细版</a-select-option>
        </a-select>
      </label>
      <a-button type="primary" @click="handleSearch">搜索</a-button>
    </div>
    <vxe-grid
      ref="svGrid"
      v-bind="svGridOptions"
      height="780"
      auto-resize
      highlight-hover-row
      highlight-current-row
      resizable
      :scroll-x="{ enabled: false }"
      :scroll-y="{ enabled: false }"
      :cell-style="cellStyle"
    >
      <template #showDetail="{row}">
        <table width="100%" border="1" bordercolor="#ddd" cellpadding="5">
          <thead>
            <tr>
              <th>单次出货</th>
              <th>出库日期</th>
              <th>出库单号</th>
            </tr>
          </thead>
          <tbody v-if="searchParam.tableType === 'normal'">
            <tr v-for="(r, index) in row.lastTrueLessInfo" :key="index">
              <td>{{ r.danCiChuHuo }}</td>
              <td>{{ r.danCiChuHuoShiJian }}</td>
              <td>{{ r.chuHuoDanHao }}</td>
            </tr>
          </tbody>
          <tbody v-else-if="searchParam.tableType === 'detail'">
            <tr v-for="(r, index) in row.lessTableInfo" :key="index">
              <td>{{ r.danCiChuHuo }}</td>
              <td>{{ r.danCiChuHuoShiJian }}</td>
              <td>{{ r.chuHuoDanHao }}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </vxe-grid>
  </div>
</template>

<script>
import { getOrders } from '@/api/order'
export default {
  data () {
    return {
      searchParam: {
        customOrderNum: null,
        storageGoodsNum: null,
        khGoodsNum: null,
        company: 1,
        tableType: 'normal'
      },
      svGridOptions: {
        loading: false,
        data: [],
        border: true,
        params: {
          originData: []
        },
        addItem: {
          defaultValue: {
            dell_repair: 0
          },
          focusField: 'id'
        },

        columns: [
          {
            field: 'SC_Name',
            title: '类别',
            width: 50,
            fixed: 'left'
          },
          {
            field: 'dingDanShiJian',
            title: '订单时间',
            width: 100,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'jiHuaJiaoQi',
            title: '计划交期',
            width: 100,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'KhPONo',
            title: '客单号',
            width: 70,
            fixed: 'left'
          },
          {
            field: 'smSOBPlusmyField12',
            title: '客商编号',
            width: 90,
            fixed: 'left'
          },
          {
            field: 'cunHuoBianHao',
            title: '存货编号',
            width: 90,
            fixed: 'left'
          },
          {
            field: 'dingDanShuLiang',
            title: '订单数',
            width: 90,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'leiJiChuHuo',
            title: '累积出货',
            width: 90,
            sortable: true,
            fixed: 'left'
          },
          {
            field: '',
            title: '出货明细',
            slots: {
              default: 'showDetail'
            },
            showOverflow: false
          }
        ]
      }
    }
  },
  methods: {
    handleSearch () {
      this.svGridOptions.loading = true
      getOrders(this.searchParam).then(res => {
        this.svGridOptions.data = res.data
        this.svGridOptions.loading = false
      })
    },
    handleTableChange () {
      this.svGridOptions.data = []
    },
    cellStyle () {
      return {
        padding: 0
      }
    }
  }
}
</script>

<style lang="less">
.search-form * {
  margin-right: 0.2rem;
}
</style>
