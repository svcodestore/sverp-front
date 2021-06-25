<!--
 * @Date: 2021-04-22 08:15:51
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-04-22 09:15:12
 * @FilePath: \sverp-front\src\views\TPM\MyReports\Other\index.vue
-->
<template>
  <div>
    <div v-show="isShowMain">
      <sv-grid ref="svGrid" v-bind="tableOptions" v-on="svGridEvents" height="780">
        <template #op="{ row }">
          <a-button size="small" @click="showDetail(row)">详细</a-button>
        </template>
      </sv-grid>
    </div>
  </div>
</template>
<script>
// import XEUtils from 'xe-utils'
import { apiGetReportLogs } from '@/api/records'
export default {
  data () {
    return {
      isShowMain: true,
      listData: [],
      tableOptions: {
        loading: false,
        data: [],
        params: {
          originData: []
        },
        addItem: {
          defaultValue: {
            dell_repair: 0
          },
          focusField: 'id'
        },
        handleInsert: this.handleInsert,
        handleUpdate: this.handleUpdate,
        editConfig: {
          activeMethod: this.activeCellMethod
        },
        keyboardConfig: {
          editMethod: this.editMethod
        },
        // handleSaveOpt: apiSaveRepair,
        columns: [
          {
            field: 'id',
            title: 'ID',
            width: 50,
            fixed: 'middle'
          },
          {
            field: 'repair_name',
            title: '报修设备'
          },
          {
            field: 'repair_content',
            title: '报修内容'
          },
          {
            field: 'repair_create_time',
            title: '报修时间'
          },
          {
            field: '',
            title: '状态',
            slots: {
              default: ({ row }) => {
                if (row.repair_create_time.startsWith('1970-01')) {
                  return [
                    <a-tag color="red">待处理</a-tag>
                  ]
                } else {
                  return [
                    <a-tag color="green">已完成</a-tag>
                  ]
                }
              }
            }
          }
          // {
          //   field: '',
          //   title: '操作',
          //   slots: {
          //     default: 'op'
          //   }
          // }
        ]
      }
    }
  },
  methods: {
    handleInsert () {},
    handleUpdate () {},
    activeCellMethod () {},
    editMethod () {},
    async getData () {
      const reporterConId = this.$store.state.user.info.con_id
      await apiGetReportLogs({ reporterConId }).then(result => {
        this.tableOptions.data = result
      })
    },
    refreshTable () {
      this.getData()
    }
  },
  mounted () {
    this.refreshTable()
  },
  created () {}
}
</script>
