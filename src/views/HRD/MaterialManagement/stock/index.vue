<!--
 * @Author: yanbuw1911
 * @Date: 2021-01-07 16:32:16
 * @LastEditTime: 2021-01-16 17:25:21
 * @LastEditors: yanbuw1911
 * @Description: 库存列表
 * @FilePath: \client\src\views\HRD\MaterialManagement\stock\index.vue
-->
<template>
  <div>
    <sv-grid v-bind="svGridOptions" v-on="svGridEvents"></sv-grid>
    <a-modal :visible="modalVisible" title="用料操作明细" :footer="null" @cancel="modalVisible = false">
      <ul style="max-height: 500px; overflow: auto;">
        <li class="log-list" v-for="(item, idx) in logList" :key="idx">
          {{
            `${item.hml_creator} ${operType(item.hml_operate_type)} ${item.hmu_material_name} ${item.hml_operate_qty}
            ${item.hmu_material_unit} ${item.hml_join_date}`
          }}
        </li>
      </ul>
    </a-modal>
  </div>
</template>

<script>
import { getMaterialList, getMaterialLogList } from '@/api/hrd'

export default {
  data () {
    return {
      modalVisible: false,
      logList: [],
      svGridOptions: {
        loading: false,
        data: [],
        columns: [
          {
            type: 'seq',
            width: 50
          },
          {
            align: 'right',
            title: '种类编码',
            field: 'hmu_material_code',
            sortable: true
          },
          {
            title: '种类名称',
            field: 'hmu_material_name',
            sortable: true
          },
          {
            title: '规格型号',
            field: 'hmu_material_model',
            sortable: true
          },
          {
            title: '计量单位',
            field: 'hmu_material_unit',
            sortable: true
          },
          {
            align: 'right',
            title: '剩余数量',
            field: 'hmu_material_stock',
            sortable: true
          },
          {
            align: 'right',
            title: '入库数量',
            field: 'in_stock',
            sortable: true
          },
          {
            align: 'right',
            title: '出库数量',
            field: 'out_stock',
            sortable: true
          }
        ]
      },
      svGridEvents: {
        refresh: this.getData,
        'cell-dblclick': this.handleDblClick
      }
    }
  },
  methods: {
    async getData () {
      this.svGridOptions.loading = true
      await getMaterialList().then(
        res => res.result && (this.svGridOptions.data = res.data.filter(e => e.hmu_material_model !== '0'))
      )
      this.svGridOptions.loading = false
    },
    async handleDblClick ({ row }) {
      await getMaterialLogList(row.id).then(res => res.result && (this.logList = res.data))
      this.modalVisible = true
    },
    operType (val) {
      return val === 'put' ? '入账' : val === 'out' ? '出账' : '建账'
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style lang="less" scoped>
.log-list {
  list-style: none;
  counter-increment: number;
}

.log-list::before {
  content: counter(number) ' ';
  font-weight: bold;
  color: rgba(37, 172, 250, 0.815);
}
</style>
