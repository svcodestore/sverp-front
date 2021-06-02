<!--
 * @Date: 2021-04-22 15:58:09
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-06-02 09:59:00
 * @FilePath: \sverp-front\src\views\TPM\Records\fettingUsed.vue
-->
<template>
  <div>
    <sv-grid v-bind="tableOptions" height="300">
      <template #toolbar>
        <div></div>
      </template>
    </sv-grid>
  </div>
</template>
<script>
import { apiGetRecordFettingUsed } from '@/api/records'
export default {
  props: {
    recordId: {
      type: Number,
      default: function () {
        return 0
      }
    }
  },
  data () {
    return {
      tableOptions: {
        showFooter: true,
        footerMethod: this.footerMethod,
        data: [],
        columns: [
          { field: 'fitting_name', title: '配件名' },
          {
            field: 'count',
            title: '使用量',
            slots: {
              default: ({ row }) => {
                if (row.fitting_id === 13) {
                  return ''
                }
              }
            }
          },
          {
            field: 'price',
            title: '单价',
            slots: {
              default: ({ row }) => {
                if (row.fitting_id === 13) {
                  return ''
                }
              }
            }
          },
          {
            field: '',
            title: '总价',
            slots: {
              default: ({ row }) => {
                return row.price * row.count
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    async getData () {
      apiGetRecordFettingUsed(this.recordId).then(result => {
        if (result.code === 0) {
          this.tableOptions.data = result.data
        }
      })
    },
    footerMethod () {
      let sumPrice = 0
      let sumCount = 0
      if (this.tableOptions.data.length > 0) {
        for (const item of this.tableOptions.data) {
          if (item.fitting_id !== 13) {
            sumCount += item.count
          }
          sumPrice += (item.price * item.count)
        }
      }
      return [['总数', sumCount, '/', sumPrice]]
    }
  },
  watch: {
    recordId: function (n, o) {
      if (o === n) {
        return
      }
      this.getData()
    }
  }
}
</script>
