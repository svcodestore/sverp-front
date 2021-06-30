<!--
 * @Author: yanbuw1911
 * @Date: 2021-06-15 09:53:14
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-06-30 16:54:11
 * @Description: Do not edit
 * @FilePath: /sverp-front/src/views/BS/index.vue
-->
<template>
  <div>
    <a-row :gutter="10">
      <a-col :span="5" v-bind="resposiveCol">
        <a-space>
          客户单号：<a-input
            v-model="params.KhPONo"
            class="param-item"
            @change="isShowGrid = false"
            @keyup.enter="handleSearch"
          ></a-input>
        </a-space>
      </a-col>
      <a-col :span="5" v-bind="resposiveCol">
        <a-space>
          存货编号：<a-input
            v-model="params.sp_No"
            class="param-item"
            @change="isShowGrid = false"
            @keyup.enter="handleSearch"
          ></a-input>
        </a-space>
      </a-col>
      <a-col :span="5" v-bind="resposiveCol">
        <a-space>
          客商编号：<a-input
            v-model="params.khNo"
            class="param-item"
            @change="isShowGrid = false"
            @keyup.enter="handleSearch"
          ></a-input>
        </a-space>
      </a-col>
      <a-col :span="5" v-bind="resposiveCol">
        <a-space>
          地点公司：
          <a-select v-model="params.company" class="param-item" @change="isShowGrid = false">
            <a-select-option key="1" value="1">斯达文星</a-select-option>
            <a-select-option key="2" value="2">杰士通</a-select-option>
          </a-select>
        </a-space>
      </a-col>
      <a-col :span="4">
        <a-space>
          <a-button
            v-if="isAdvancedQuery"
            :disabled="!params.KhPONo && !params.sp_No && !params.khNo"
            @click="addQueryCond"
          >
            添加条件
          </a-button>
          <a-button-group>
            <a-button
              type="primary"
              :disabled="!params.KhPONo && !params.sp_No && !params.khNo"
              @click="handleSearch"
              :loading="searchLoading"
            >
              {{ queryText }}
            </a-button>

            <a-dropdown placement="bottomCenter">
              <a-button><a-icon type="ellipsis"/></a-button>
              <a-menu slot="overlay">
                <a-menu-item @click="changeQueryMode">
                  {{ menuQueryText }}
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-button-group>
        </a-space>
      </a-col>
    </a-row>
    <div v-if="!isShowGrid">
      <p v-for="(item, index) in queryCond" :key="index">
        <a-button type="link" @click="handleDelCond(item)"><a-icon type="close"/></a-button>
        {{ item.KhPONo ? '客户单号： ' + item.KhPONo : '' }}
        {{ item.sp_No ? '存货编号： ' + item.sp_No : '' }}
        {{ item.khNo ? '客商编号： ' + item.khNo : '' }}
        {{ '地点公司：' + (item.company > 1 ? '杰士通' : '斯达文星') }}
      </p>
    </div>
    <sv-grid ref="grid" v-bind="gridOptions" v-if="isShowGrid">
      <template #dingDanShuLiang="{row,column}">
        {{ row[column.property] | fmtNum }}
      </template>
      <template #leiJiChuHuo="{row,column}">
        {{ row[column.property] | fmtNum }}
      </template>
      <template #danCiChuHuo="{row,column}">
        {{ row[column.property] | fmtNum }}
      </template>
    </sv-grid>
  </div>
</template>

<script>
import { getOrders2 } from '@/api/order'
import moment from 'moment'
import { objArrUniq } from '@/utils/util'

export default {
  filters: {
    fmtNum (val) {
      if (!val) {
        return val
      }

      return val.replace(/\d{1,3}(?=(\d{3})+(\.|$))/g, '$&,')
    }
  },
  data () {
    return {
      isAdvancedQuery: false,
      queryText: '查询',
      menuQueryText: '高级查询',
      queryCond: [],
      searchLoading: false,
      resposiveCol: { xs: 24, sm: 24, md: 12, lg: 8, xl: 5 },
      params: {
        KhPONo: '',
        sp_No: '',
        khNo: '',
        company: '1'
      },
      isShowGrid: false,
      gridOptions: {
        align: 'center',
        loading: false,
        refreshBtn: false,
        toolDropdown: true,
        data: [],
        columns: [
          {
            type: 'seq',
            width: 50
          },
          {
            field: 'SC_Name',
            title: '类别',
            sortable: true
          },
          {
            field: 'dingDanShiJian',
            title: '订单时间',
            sortable: true,
            filters: [],
            filterMethod: this.columnDateFilter
          },
          {
            field: 'jiHuaJiaoQi',
            title: '计划交期',
            sortable: true,
            filters: [],
            filterMethod: this.columnDateFilter
          },
          {
            field: 'KhPONo',
            title: '客单号',
            sortable: true
          },
          {
            field: 'smSOBPlusmyField12',
            title: '客商编号',
            sortable: true
          },
          {
            field: 'cunHuoBianHao',
            title: '存货编号',
            sortable: true
          },
          {
            field: 'dingDanShuLiang',
            title: '订单数',
            slots: {
              default: 'dingDanShuLiang'
            },
            sortable: true
          },
          {
            field: 'leiJiChuHuo',
            title: '累积出货',
            slots: {
              default: 'leiJiChuHuo'
            },
            sortable: true
          },
          {
            field: 'danCiChuHuo',
            title: '单次出货',
            slots: {
              default: 'danCiChuHuo'
            },
            sortable: true
          },
          {
            field: 'danCiChuHuoShiJian',
            title: '出库日期',
            sortable: true,
            filters: [],
            filterMethod: this.columnDateFilter
          },
          {
            field: 'chuHuoDanHao',
            title: '出库单号',
            sortable: true
          }
        ]
      }
    }
  },
  methods: {
    changeQueryMode () {
      this.isShowGrid = false
      this.isAdvancedQuery = !this.isAdvancedQuery
      this.queryText = this.isAdvancedQuery ? '高级查询' : '查询'
      this.menuQueryText = !this.isAdvancedQuery ? '高级查询' : '查询'
    },
    addQueryCond () {
      if (this.isShowGrid) {
        this.isShowGrid = false
      }
      const cond = {
        company: this.params.company
      }
      this.params.KhPONo && (cond['KhPONo'] = this.params.KhPONo)
      this.params.sp_No && (cond['sp_No'] = this.params.sp_No)
      this.params.khNo && (cond['khNo'] = this.params.khNo)
      this.queryCond.push(cond)
      this.queryCond = objArrUniq(this.queryCond)
    },
    handleDelCond (item) {
      this.queryCond = this.queryCond.filter(e => JSON.stringify(e) !== JSON.stringify(item))
    },
    async handleSearch () {
      this.searchLoading = true
      this.gridOptions.loading = true

      if (this.queryCond.length && this.isAdvancedQuery) {
        const requestList = this.queryCond.map(params => getOrders2(params))
        await Promise.all(requestList).then(res => {
          let arr = []
          res.forEach(item => {
            if (item.result && item.data.length) {
              arr.push(...item.data)
            }
          })
          arr = objArrUniq(arr)
          if (arr.length) {
            this.gridOptions.data = arr.map(item => {
              item.dingDanShiJian && (item.dingDanShiJian = moment(item.dingDanShiJian).format('YYYY-MM-DD'))
              item.jiHuaJiaoQi && (item.jiHuaJiaoQi = moment(item.jiHuaJiaoQi).format('YYYY-MM-DD'))
              item.danCiChuHuoShiJian &&
                (item.danCiChuHuoShiJian = moment(item.danCiChuHuoShiJian).format('YYYY-MM-DD'))
              item.dingDanShuLiang && (item.dingDanShuLiang = Number(item.dingDanShuLiang).toFixed())
              item.leiJiChuHuo && (item.leiJiChuHuo = Number(item.leiJiChuHuo).toFixed())
              item.danCiChuHuo && (item.danCiChuHuo = Number(item.danCiChuHuo).toFixed())

              return item
            })
            this.isShowGrid = true
            this.setColumnFilter(this.gridOptions.data)
          } else {
            this.$message.info('暂无数据')
          }
        })
      } else {
        // eslint-disable-next-line camelcase
        const { KhPONo, sp_No, khNo } = this.params
        // eslint-disable-next-line camelcase
        if (!KhPONo && !sp_No && !khNo) return

        await getOrders2(this.params).then(({ result, data }) => {
          if (result) {
            if (data.length) {
              this.gridOptions.data = data.map(item => {
                item.dingDanShiJian && (item.dingDanShiJian = moment(item.dingDanShiJian).format('YYYY-MM-DD'))
                item.jiHuaJiaoQi && (item.jiHuaJiaoQi = moment(item.jiHuaJiaoQi).format('YYYY-MM-DD'))
                item.danCiChuHuoShiJian &&
                  (item.danCiChuHuoShiJian = moment(item.danCiChuHuoShiJian).format('YYYY-MM-DD'))
                item.dingDanShuLiang && (item.dingDanShuLiang = Number(item.dingDanShuLiang).toFixed())
                item.leiJiChuHuo && (item.leiJiChuHuo = Number(item.leiJiChuHuo).toFixed())
                item.danCiChuHuo && (item.danCiChuHuo = Number(item.danCiChuHuo).toFixed())

                return item
              })
              this.isShowGrid = true
              this.setColumnFilter(this.gridOptions.data)
            } else {
              this.$message.info('暂无数据')
            }
          }
        })
      }
      this.searchLoading = false
      this.gridOptions.loading = false
    },
    setColumnFilter (data) {
      this.$nextTick().then(() => {
        this.gridOptions.columns
          .filter(col => Object.keys(col).find(key => key === 'filters'))
          .forEach(item => {
            const arr1 = data.map(e => e[item.field] && moment(e[item.field]).format('YYYY'))
            const arr2 = data.map(e => e[item.field] && moment(e[item.field]).format('YYYY-MM'))

            this.$refs.grid.dynamicColumnFilters(
              item.field,
              [...new Set([...arr1, ...arr2])].map(e => ({
                label: e,
                value: e
              }))
            )
          })
      })
    },
    columnDateFilter ({ value, row, column }) {
      if (value) {
        return row[column.property].indexOf(value) > -1
      } else {
        // eslint-disable-next-line eqeqeq
        return row[column.property] == value
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .param-item {
  width: 150px !important;
}
</style>
