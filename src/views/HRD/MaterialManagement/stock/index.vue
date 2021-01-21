<!--
 * @Author: yanbuw1911
 * @Date: 2021-01-07 16:32:16
 * @LastEditTime: 2021-01-20 10:29:07
 * @LastEditors: yanbuw1911
 * @Description: 库存列表
 * @FilePath: \client\src\views\HRD\MaterialManagement\stock\index.vue
-->
<template>
  <div>
    <sv-grid v-bind="svGridOptions" v-on="svGridEvents"></sv-grid>
    <a-modal :visible="modalVisible" title="用料操作明细" :footer="null" @cancel="modalVisible = false">
      <a-timeline style="max-height: 500px; overflow: auto; padding: 5px 0;">
        <a-timeline-item class="log-list" v-for="(item, idx) in logList" :key="idx">
          <div class="log-content">
            <ul v-html="logConentHtml(item)"></ul>
            <div class="log-count">
              <p></p>
            </div>
          </div>
        </a-timeline-item>
      </a-timeline>
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
        title: '用料库存列表',
        desc: '',
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
  computed: {
    logField () {
      return [
        'hml_creator',
        'hml_operate_type',
        'hmu_material_name',
        'hml_operate_qty',
        'hmu_material_unit',
        'hml_join_date'
      ]
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
    logConentHtml (item) {
      return this.logField.reduce((pre, curr) => {
        let html = `<li>${item[curr]}</li>`
        if (item[curr] === 'put') {
          html = '<li style="text-shadow: 1px 1px 1px #a8ee58;">入账</li>'
        }
        if (item[curr] === 'out') {
          html = '<li style="text-shadow: 1px 1px 1px rgb(235, 184, 17);">出账</li>'
        }
        if (item[curr] === 'set') {
          html = '<li>建账</li>'
        }
        if (/入账/.test(pre) && typeof item[curr] === 'number') {
          html = `<li style="color: #a8ee58;">${item[curr]}</li>`
        }
        if (/出账/.test(pre) && typeof item[curr] === 'number') {
          html = `<li style="color: rgb(235, 184, 17);">${item[curr]}</li>`
        }

        return pre + html
      }, '')
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style lang="less" scoped>
.log-list {
  counter-increment: number;

  .log-content {
    display: flex;

    ul {
      padding: 0;
      display: flex;
      width: 80%;
      justify-content: space-between;
    }

    .log-count {
      margin-left: auto;

      p {
        margin: 0 15px;
      }

      p::before {
        content: counter(number) ' ';
        color: rgba(107, 109, 110, 0.562);
      }
    }
  }
}
</style>
