<template>
  <div id="app">
    <vxe-grid ref="xGrid" v-bind="gridOptions">
      <template v-slot:status="{ row, column }">
        {{ formatStatus(row[column.property]) }}
      </template>
      <template v-slot:create_at="{ row, column }">
        {{ formatDate(row[column.property]) }}
      </template>
      <template v-slot:predict="{ row, column }">
        {{ formatDate(row[column.property]) }}
      </template>
      <template v-slot:phases="{ row, column }">
        <div v-html="formatPhases(row[column.property])"></div>
      </template>
      <template v-slot:gantt="{ row }">
        <vxe-button size="mini" @click="ganttView(row.id)">
          查看
        </vxe-button>
      </template>
      <template v-slot:toolbar>
        <vxe-button @click="init()">刷新</vxe-button>
        <vxe-button @click="$refs.xGrid.zoom()">缩放</vxe-button>
        <vxe-button @click="exportExcel">导出</vxe-button>
        <vxe-button @click="exportPDF">打印</vxe-button>
        <vxe-pulldown ref="xDown1">
          <template v-slot>
            <vxe-button @click="$refs.xDown1.togglePanel()">展示列</vxe-button>
          </template>
          <template v-slot:dropdown>
            <template v-for="(column, index) in columns">
              <vxe-checkbox
                v-model="column.visible"
                :key="index"
                @change="$refs.xGrid.refreshColumn()"
              >{{ column.title }}</vxe-checkbox
              >
            </template>
          </template>
        </vxe-pulldown>
        <div style="font-size: 16px;margin: 5px 14px; letter-spacing: 3px;">
          {{
            ` ${
              $refs.xGrid ? $refs.xGrid.getTableData().tableData.length : "0"
            }条记录  `
          }}
        </div>
      </template>
    </vxe-grid>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import FileSaver from 'file-saver'

export default {
  data () {
    return {
      columns: [],
      gridOptions: {
        scrollY: { gt: -1 },
        loading: false,
        border: true,
        resizable: true,
        showHeaderOverflow: true,
        showOverflow: true,
        keepSource: true,
        id: 'full_edit_1',
        height: 600,
        rowId: 'id',
        data: [],
        checkboxConfig: { labelField: 'id' },
        columns: [
          { type: 'checkbox', title: 'ID', field: 'id', width: 100 },
          {
            field: 'obj_name',
            title: '项目名称'
          },
          {
            field: 'unit',
            title: '需求单位',
            filters: [
              { label: '生产部', value: '生产部' },
              { label: '人资管理部', value: '人资管理部' },
              { label: '营业部', value: '营业部' },
              {
                label: '业务、采购、生管、财务、台中',
                value: '业务、采购、生管、财务、台中'
              },
              { label: '制七', value: '制七' },
              { label: '財務室', value: '財務室' },
              { label: '制十一线', value: '制十一线' },
              { label: '采购/物管/生管', value: '采购/物管/生管' },
              { label: '测试', value: '测试' },
              { label: '生產部', value: '生產部' },
              { label: '采购部', value: '采购部' },
              { label: '人资部', value: '人资部' },
              { label: '业务部', value: '业务部' },
              { label: '财务', value: '财务' },
              { label: '开发部', value: '开发部' },
              { label: '品保', value: '品保' },
              { label: '仓库', value: '仓库' },
              { label: '制九线', value: '制九线' },
              { label: 'TPM中心', value: 'TPM中心' },
              { label: '物管科', value: '物管科' },
              { label: '制八线', value: '制八线' },
              { label: '財務部、營業部', value: '財務部、營業部' },
              { label: '業務部', value: '業務部' },
              { label: '開發刀模管理', value: '開發刀模管理' }
            ]
          },
          {
            field: 'duty',
            title: '项目负责人',
            filters: [
              { label: '杨頔', value: '杨頔' },
              { label: '唐惠興', value: '唐惠興' },
              { label: '康展鵬', value: '康展鵬' },
              { label: '謝獻毅', value: '謝獻毅' },
              { label: '王甲姣和謝從念', value: '王甲姣和謝從念' },
              { label: '王甲姣', value: '王甲姣' },
              { label: '王草凡', value: '王草凡' },
              { label: '杨頔、蒋东鹏', value: '杨頔、蒋东鹏' },
              { label: 'Angela', value: 'Angela' },
              { label: '顏為群', value: '顏為群' },
              { label: '采购/物管/生管', value: '采购/物管/生管' },
              { label: '测试', value: '测试' },
              { label: '吴丹', value: '吴丹' },
              { label: 'SAM', value: 'SAM' },
              { label: '阿珍', value: '阿珍' },
              { label: '伦嘉欣', value: '伦嘉欣' },
              { label: 'Jingle', value: 'Jingle' },
              { label: 'JACKY', value: 'JACKY' },
              { label: '康展鹏', value: '康展鹏' },
              { label: '邓小峰', value: '邓小峰' },
              { label: '黄艳萍', value: '黄艳萍' },
              { label: '柯春军', value: '柯春军' },
              { label: '符超', value: '符超' },
              { label: '黄明中', value: '黄明中' },
              { label: '晃先公', value: '晃先公' },
              { label: '周飞', value: '周飞' },
              { label: 'louis', value: 'louis' },
              { label: 'AMY湯', value: 'AMY湯' }
            ]
          },
          {
            field: 'status',
            title: '项目状态',
            slots: {
              default: 'status'
            },
            filters: [
              { label: '等待处理', value: 0 },
              { label: '需求确认中', value: 1 },
              { label: '等待审批', value: 2 },
              { label: '驳回', value: 3 },
              { label: '开发中', value: 4 },
              { label: '完成', value: 5 },
              { label: '停滞', value: 6 },
              { label: '项目维护中', value: 7 }
            ]
          },
          {
            field: 'create_at',
            title: '提案日期',
            sortable: true,
            slots: {
              default: 'create_at'
            }
          },
          {
            field: 'predict',
            title: '预计完成日期',
            sortable: true,
            slots: {
              default: 'predict'
            }
          },
          {
            field: 'progress',
            title: '当前进度'
          },
          {
            field: 'developer',
            title: '项目开发者',
            filters: [
              { label: 'null', value: null },
              { label: '空', value: '' },
              { label: '蒋东鹏', value: '蒋东鹏' },
              { label: '粟钊毅', value: '粟钊毅' },
              { label: '杨頔', value: '杨頔' },
              { label: '陈俊', value: '陈俊' },
              { label: '黄孟秋', value: '黄孟秋' }
            ]
          },
          {
            field: 'phases',
            title: '工作阶段',
            sortable: true,
            slots: {
              default: 'phases'
            }
          },
          {
            field: 'gantt',
            title: '甘特图',
            slots: {
              default: 'gantt'
            }
          },
          {
            field: 'check',
            title: '项目验收',
            filters: [
              { label: 'null', value: null },
              { label: '杨頔', value: '杨頔' },
              { label: '謝獻毅', value: '謝獻毅' },
              { label: '王甲姣', value: '王甲姣' }
            ]
          },
          {
            field: '',
            title: '日工作确认'
          }
        ]
      }
    }
  },
  methods: {
    formatPhases (item, expt = false) {
      if (item.length > 2) {
        let html = ''
        const arr = item.map((e) => Object.assign({}, e))
        arr.shift()
        arr.forEach((e) => {
          if (expt) {
            html += `${e.name} | ${e.duration} | ${this.formatDate(
              e.start
            )} - ${this.formatDate(e.end)}\n`
            return
          }
          html += `<li style="list-style: decimal-leading-zero; color: #199999;">${
            e.name
          } | ${e.duration} | ${this.formatDate(e.start)} - ${this.formatDate(
            e.end
          )}</li>\n`
        })
        return html
      } else {
        return ''
      }
    },
    ganttView (softid) {
      window.open(
        'http://192.168.123.51/public/cfo/soft/schedule?id=' + softid
      )
    },
    formatDate (time) {
      if (!time) return
      if (String(time).length < 13) time = time * 1000
      const date = new Date(time)
      const Y = date.getFullYear() + '-'
      const M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      // let h = date.getHours() + ":";
      // let m = date.getMinutes() + ":";
      // let s = date.getSeconds();
      // return Y + M + D + h + m + s;
      return Y + M + D
    },
    formatStatus (code) {
      switch (code) {
        case 0:
          return '等待处理'
        case 1:
          return '需求确认中'
        case 2:
          return '等待审批'
        case 3:
          return '驳回'
        case 4:
          return '开发中'
        case 5:
          return '完成'
        case 6:
          return '停滞'
        case 7:
          return '项目维护中'
      }
    },
    getExportData () {
      let tableData = this.$refs.xGrid.getCheckboxRecords()
      if (!tableData.length) { tableData = this.$refs.xGrid.getTableData().tableData }

      const data = []
      const titles = []
      const fields = []

      const cols = this.$refs.xGrid.getColumns()
      cols.forEach((e) => {
        fields.push(e.property)
        titles.push(e.title)
      })
      data.push(titles)

      const content = tableData.map((col) =>
        fields.map((field) => {
          const formatFields = ['create_at', 'status', 'predict']
          if (formatFields.includes(field)) {
            return field === 'status'
              ? this.formatStatus(col[field])
              : this.formatDate(col[field])
          }

          if (field === 'phases') {
            return this.formatPhases(col[field], true)
          }

          return col[field]
        })
      )
      return { titles, content, fields }
    },
    exportExcel () {
      const { titles, content } = this.getExportData()
      const data = [titles, ...content]

      const ws = XLSX.utils.aoa_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'result')
      const wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })

      try {
        const filename = 'MIS立案项目列表_' + Date.now() + '.xlsx'
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          filename
        )
      } catch (error) {
        if (window.console) console.log(error, wbout)
      }
    },
    // 后端导出 PDF
    exportPDF () {
      this.$http
        .post('/cfo/soft/outSoftRequirePDF', this.$qs.stringify(this.getExportData()), { responseType: 'blob' })
        .then((res) => {
          const blob = new Blob([res], { type: 'application/pdf' })
          const url = URL.createObjectURL(blob)
          window.open(url)
        })
        .catch(() => {})
    },
    async init () {
      this.gridOptions.loading = true
      await this.$http
        .get('/cfo/soft/getInitData')
        .then((result) => {
          this.gridOptions.data = result
        })
        .catch(() => {})
      this.columns = Array.from(
        this.$refs.xGrid.getTableColumn().collectColumn
      )
      this.gridOptions.loading = false
    }
  },
  mounted () {
    this.init()
  }
}
</script>
