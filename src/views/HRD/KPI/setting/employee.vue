<!--
 * @Author: yanbuw1911
 * @Date: 2021-04-29 10:56:03
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-05-14 14:51:32
 * @Description: 员工信息
 * @FilePath: /sverp-front/src/views/HRD/KPI/setting/employee.vue
-->
<template>
  <div>
    <sv-grid v-bind="svgridOptions" v-on="svgridEvts">
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

export default {
  filters: {
    fmtDate (val) {
      return moment(val).format('YYYY年MM日DD号')
    }
  },
  data () {
    return {
      svgridOptions: {
        title: '员工信息表格',
        data: [],
        loading: false,
        columns: [
          {
            field: 'dept',
            title: '部门'
          },
          {
            field: 'grp',
            title: '分组'
          },
          {
            field: 'subGrp',
            title: '二级分组'
          },
          {
            field: 'position',
            title: '职位'
          },
          {
            field: 'staffNo',
            title: '工号'
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
            }
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
        refresh: this.getData
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
      const data = this.svgridOptions.data.map(e => {
        const o = Object.assign({}, e)
        delete o.id
        return o
      })
      workBook.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data)
      XLSX.writeFile(workBook, `KPI 员工信息${new Date().getTime()}.xlsx`, wopts)
    },
    async getData () {
      this.svgridOptions.loading = true
      await this.$axios
        .get('http://192.168.123.51:9600/webApi/test/dbfreader')
        .then(res => {
          this.svgridOptions.data = res.sort((a, b) => b.staffNo - a.staffNo)
        })
        .catch(() => {
          this.svgridOptions.loading = false
        })
      this.svgridOptions.loading = false
    }
  },
  async mounted () {
    await this.getData()
  }
}
</script>
