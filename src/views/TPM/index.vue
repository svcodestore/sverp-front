<template>
  <div>
    <div class="box">
      <vxe-button
        v-show="category"
        v-for="item in count"
        :key="item.value"
        :style="item.color"
        @click="mecheStatus(item.value)"
      >
        {{ item.name }}
        <div>{{ item.count }}</div>
      </vxe-button>
      <!-- <vxe-button @click="fitting">
        查看
        <div>{{ name }}</div>
      </vxe-button> -->
    </div>
    <sv-grid ref="svGrid" v-bind="svGridOptions" v-on="svGridEvents" v-show="showTable">
      <template #statusSolt="{ row }">
        <div v-if="row.status == '正常'">
          <a-tag color="RGB(0,191,8)">正常</a-tag>
        </div>
        <div v-else-if="row.status == '维修'">
          <a-tag color="RGB(180,191,8)">维修</a-tag>
        </div>
        <div v-else-if="row.status == '保养'">
          <a-tag color="RGB(13,235,244)">保养</a-tag>
        </div>
        <div v-else-if="row.status == '调试'">
          <a-tag color="RGB(244,144,13)">调试</a-tag>
        </div>
        <div v-else-if="row.status == '停用'">
          <a-tag color="RGB(244,13,29)">停用</a-tag>
        </div>
      </template>
    </sv-grid>
  </div>
</template>

<script>
import { apiMecheInfo, apiSaveMecheInfo, apiSaveFitting, apiFitting } from '@/api/records'
import XEUtils from 'xe-utils'
export default {
  data () {
    return {
      fittingCount: 0,
      name: '配件',
      category: true,
      count: [
        {
          value: 1,
          name: '正常',
          color: 'color:RGB(0,191,8)',
          count: 0
        },
        {
          value: 2,
          name: '维修',
          color: 'color:RGB(180,191,8)',
          count: 0
        },
        {
          value: 3,
          name: '保养',
          color: 'color:RGB(13,235,244)',
          count: 0
        },
        {
          value: 4,
          name: '调试',
          color: 'color:RGB(244,144,13)',
          count: 0
        },
        {
          value: 5,
          name: '停用',
          color: 'color:RGB(244,13,29)',
          count: 0
        }
      ],
      showTable: true,
      svGridOptions: {
        loading: false,
        data: [],
        params: {
          originData: []
        },
        handleInsert: this.handleInsert,
        handleUpdate: this.handleUpdate,
        editConfig: {
          activeMethod: this.activeCellMethod
        },
        keyboardConfig: {
          editMethod: this.editMethod
        },
        handleSaveOpt: apiSaveMecheInfo,
        columns: [
          {
            field: 'id',
            title: 'ID',
            width: 60,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'line_num',
            title: '线号',
            width: 90,
            sortable: true,
            fixed: 'left',
            editRender: {
              name: 'input'
            }
          },
          {
            field: 'produc_num',
            title: '工程号',
            width: 110,
            editRender: {
              name: 'input'
            },
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'mache_num',
            title: '设备编号',
            editRender: {
              name: 'input'
            },
            width: 110,
            fixed: 'left'
          },
          {
            field: 'mache_name',
            title: '设备名称',
            width: 100,
            fixed: 'left',
            editRender: {
              name: 'input'
            }
          },
          {
            field: 'keeper',
            title: '管理者',
            editRender: {
              name: 'input'
            },
            width: 110,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'create_time',
            title: '添加时间',
            editRender: {
              name: 'input'
            },
            width: 110,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'inspection_cycle',
            title: '保养周期(天)',
            width: 130,
            editRender: {
              name: 'input'
            }
          },
          {
            field: 'status',
            title: '状态',
            editRender: {
              name: '$select',
              options: [
                {
                  value: 1,
                  label: '正常'
                },
                {
                  value: 2,
                  label: '维修'
                },
                {
                  value: 3,
                  label: '保养'
                },
                {
                  value: 4,
                  label: '调试'
                },
                {
                  value: 5,
                  label: '停用'
                }
              ]
            },
            width: 100,
            slots: {
              default: 'statusSolt'
            }
          }
        ]
      },
      svGridEvents: {
        refresh: this.refreshTable
      },
      searchLoading: false,
      showInfoTbl: false
    }
  },
  methods: {
    fitting () {
      this.category = !this.category
      if (this.category === false) {
        this.name = '设备'
        this.svGridEvents.refresh = this.fittingInfo
        this.svGridOptions = {
          loading: false,
          data: [],
          params: {
            originData: []
          },
          handleInsert: this.handleInsert,
          handleUpdate: this.handleUpdate,
          editConfig: {
            activeMethod: this.activeCellMethod
          },
          keyboardConfig: {
            editMethod: this.editMethod
          },
          handleSaveOpt: apiSaveFitting,
          columns: [
            {
              field: 'id',
              title: 'ID',
              width: 100,
              sortable: true,
              fixed: 'left'
            },
            {
              field: 'fitting_name',
              title: '配件名称',
              width: 130,
              editRender: {
                name: 'input'
              },
              sortable: true,
              fixed: 'left'
            },
            {
              field: 'fitting_num',
              title: '配件数量',
              editRender: {
                name: 'input'
              },
              width: 110,
              fixed: 'left'
            },
            {
              field: 'fitting_msg_number',
              fixed: 'left',
              title: '最低配件数量',
              editRender: {
                name: 'input'
              },
              width: 130
            },
            {
              field: 'fitting_msg_status',
              title: '状态',
              fixed: 'left',
              editRender: {
                name: '$select',
                options: [
                  {
                    value: 1,
                    label: '未发送'
                  },
                  {
                    value: -1,
                    label: '已发送'
                  }
                ]
              },
              width: 100
            },
            {
              field: 'fitting_consume_num',
              title: '已消耗配件数量',
              editRender: {
                name: 'input'
              },
              width: 150,
              fixed: 'left'
            }
          ]
        }
        this.fittingInfo()
      } else {
        this.name = '配件'
        this.svGridEvents.refresh = this.refreshTable
        this.svGridOptions = {
          loading: false,
          data: [],
          params: {
            originData: []
          },
          addItem: {
            defaultValue: {
              status: 1
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
          handleSaveOpt: apiSaveMecheInfo,
          columns: [
            {
              field: 'id',
              title: 'ID',
              width: 100,
              sortable: true,
              fixed: 'left'
            },
            {
              field: 'line_num',
              title: '线号',
              width: 140,
              sortable: true,
              fixed: 'left',
              editRender: {
                name: 'input'
              }
            },
            {
              field: 'produc_num',
              title: '工程号',
              width: 110,
              editRender: {
                name: 'input'
              },
              sortable: true,
              fixed: 'left'
            },
            {
              field: 'mache_num',
              title: '设备编号',
              editRender: {
                name: 'input'
              },
              width: 110,
              fixed: 'left'
            },
            {
              field: 'mache_name',
              title: '设备名称',
              width: 100,
              fixed: 'left',
              editRender: {
                name: 'input'
              }
            },
            {
              field: 'keeper',
              title: '管理者',
              editRender: {
                name: 'input'
              },
              width: 120,
              sortable: true,
              fixed: 'left'
            },
            {
              field: 'create_time',
              title: '添加时间',
              editRender: {
                name: 'input'
              },
              width: 130,
              sortable: true,
              fixed: 'left'
            },
            {
              field: 'status',
              title: '状态',
              editRender: {
                name: '$select',
                options: [
                  {
                    value: 1,
                    label: '正常'
                  },
                  {
                    value: 2,
                    label: '维修'
                  },
                  {
                    value: 3,
                    label: '保养'
                  },
                  {
                    value: 4,
                    label: '调试'
                  },
                  {
                    value: 5,
                    label: '停用'
                  }
                ]
              },
              width: 100,
              sortable: true,
              fixed: 'left'
            }
          ]
        }
        this.refreshTable()
      }
    },
    async refreshTable (status = '') {
      this.svGridOptions.loading = true
      await apiMecheInfo(status)
        .then(result => {
          if (result.code === 0) {
            if (status === '') {
              this.count.forEach((v, i) => {
                this.count[i].count = 0
              })
              result.result.forEach((value, index) => {
                this.count[value.status - 1].count += 1
              })
            }
            this.svGridOptions.data = result.result.map(e => {
              const row = XEUtils.clone(e, true)
              const status = row.status
              switch (status) {
                case 1:
                  row.status = '正常'
                  break
                case 2:
                  row.status = '维修'
                  break
                case 3:
                  row.status = '保养'
                  break
                case 4:
                  row.status = '调试'
                  break
                case 5:
                  row.status = '停用'
                  break
              }
              return row
            })
            this.svGridOptions.params.originData = this.svGridOptions.data.map(e => XEUtils.clone(e))
          }
        })
        .catch(() => {})
      this.svGridOptions.loading = false
    },
    mecheStatus (status) {
      this.refreshTable({
        status
      })
    },
    async fittingInfo () {
      this.svGridOptions.loading = true
      await apiFitting()
        .then(result => {
          if (result.code === 0) {
            this.svGridOptions.data = result.result.map(e => {
              const row = XEUtils.clone(e, true)
              return row
            })
            this.svGridOptions.params.originData = this.svGridOptions.data.map(e => XEUtils.clone(e))
          }
        })
        .catch(() => {})
      this.svGridOptions.loading = false
    }
  },
  mounted () {
    this.refreshTable()
  }
}
</script>

<style>
.box {
  width: 100%;
  padding: 10px 10px;
}

.box ul li {
  float: left;
  display: block;
  width: 100px;
  font-size: 20px;
  text-align: center;
  padding: 15px;
  color: white;
  margin: 0 10px;
  border-radius: 10px;
  cursor: pointer;
}
</style>
