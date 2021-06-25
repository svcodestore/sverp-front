<!--
 * @Author: yanbuw1911
 * @Date: 2021-04-29 10:56:03
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-05-20 09:29:15
 * @Description: 员工信息
 * @FilePath: /sverp-front/src/views/HRD/KPI/setting/employee.vue
-->
<template>
  <div>
    <a-select
      style="width: 120px; margin: 0 5px 5px 0;"
      v-model="loc"
      @change=";(isShowGrid = false), (svgridOptions.data = [])"
    >
      <a-select-option key="SV" value="SV">SV</a-select-option>
      <a-select-option key="JS" value="JS">JS</a-select-option>
    </a-select>
    <a-button type="primary" shape="circle" title="查询" @click="handleSearch" :loading="svgridOptions.loading">
      <a-icon type="search"></a-icon>
    </a-button>
    <sv-grid ref="svgrid" v-bind="svgridOptions" v-on="svgridEvts" v-show="isShowGrid">
      <template #svgridToolbar>
        <a-button shape="circle" :title="$t('export')" :disabled="!svgridOptions.data.length" @click="handleExport">
          <a-icon type="export" />
        </a-button>
      </template>
      <template #joinDate="{row, column}">
        {{ row[column.property] | fmtDate }}
      </template>
    </sv-grid>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import moment from 'moment'
// import QueryString from 'qs'

import { getStaffs } from '@/api/hrd'

export default {
  filters: {
    fmtDate (val) {
      return moment(val).format('YYYY年MM月DD号')
    }
  },
  data () {
    return {
      loc: 'SV',
      isShowGrid: false,
      svgridOptions: {
        refreshBtn: false,
        title: '员工信息表格',
        data: [],
        loading: false,
        columns: [
          {
            field: 'dept',
            title: '部门',
            filters: []
          },
          {
            field: 'grp',
            title: '分组',
            filters: []
          },
          {
            field: 'subGrp',
            title: '二级分组',
            filters: []
          },
          {
            field: 'position',
            title: '职位',
            filters: []
          },
          {
            field: 'staffNo',
            title: '工号',
            sortable: true
          },
          {
            field: 'name',
            title: '姓名'
          },
          {
            field: 'joinDate',
            title: '入职日期',
            slots: {
              default: 'joinDate'
            },
            sortable: true
          }
        ],
        menuConfig: {
          body: {
            options: [[{ code: 'export', name: 'export', disabled: true }]]
          }
        }
      },
      svgridEvts: {
        'menu-click': this.handleMenuClick,
        'filter-change': this.filterChange
      }
    }
  },
  watch: {
    'svgridOptions.data' (val) {
      if (val.length) {
        this.svgridOptions.menuConfig.body.options[0][0].disabled = false
      }
    }
  },
  methods: {
    async handleSearch () {
      await this.getData()
      this.isShowGrid = true
    },
    handleMenuClick ({ menu }) {
      switch (menu.code) {
        case 'export':
          this.handleExport()
          break
      }
    },
    handleExport () {
      const wopts = {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary'
      }
      const workBook = {
        SheetNames: ['Sheet1'],
        Sheets: {},
        Props: {}
      }
      const data = this.$refs.svgrid.getTableData().visibleData.map(e => {
        const o = Object.assign({}, e)
        delete o.id
        return o
      })
      workBook.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data)
      XLSX.writeFile(workBook, `KPI 员工信息${new Date().getTime()}.xlsx`, wopts)
    },
    async getData () {
      this.svgridOptions.loading = true
      // await this.$axios
      //   .post('http://192.168.123.51:9600/webApi/test/dbfreader', QueryString.stringify({ loc: this.loc }))
      await getStaffs(this.loc)
        .then(res => {
          let data = []
          if (this.loc === 'SV') {
            data = res.sort((a, b) => b.staffNo - a.staffNo)
          } else if (this.loc === 'JS') {
            data = res.sort((a, b) => b.staffNo.substr(2) - a.staffNo.substr(2))
          }
          this.svgridOptions.data = data
          this.setColumnFilter(this.svgridOptions.data)
        })
        .catch(() => {
          this.svgridOptions.loading = false
        })
      this.svgridOptions.loading = false
    },
    setColumnFilter (data) {
      this.svgridOptions.columns
        .filter(col => Object.keys(col).find(key => key === 'filters'))
        .forEach(item => {
          this.$refs.svgrid.dynamicColumnFilters(
            item.field,
            [...new Set(data.map(e => e[item.field]))].map(e => ({
              label: e,
              value: e
            }))
          )
        })
    },
    filterChange () {
      // this.setColumnFilter(this.$refs.svgrid.getTableData().visibleData)
    }
  }
}
</script>
