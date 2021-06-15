<!--
 * @Date: 2021-04-22 09:11:26
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-04-22 10:06:49
 * @FilePath: \sverp-front\src\views\TPM\Logs\index.vue
-->
<template>
  <div>
    <sv-grid ref="svGrid" v-bind="tableOptions" v-on="svGridEvents" height="780"></sv-grid>
    <div v-show="isShowFollow">
      <a-form-item>
        <a-row>
          <a-col :span="8">
            <a-textarea></a-textarea>
          </a-col>
        </a-row>
      </a-form-item>
    </div>
  </div>
</template>
<script>
import { apiGetReportLogs } from '@/api/records'
export default {
  data () {
    return {
      isShowMian: true,
      isShowFollow: false,
      listData: [],
      rowOrigin: {
        id: 0,
        repair_follow_content: ''
      },
      currRow: null,
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
          },
          {
            field: '',
            title: '操作',
            slots: {
              default: 'op'
            }
          }
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
      await apiGetReportLogs({}).then(result => {
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
