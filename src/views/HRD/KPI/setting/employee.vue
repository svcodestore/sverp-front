<!--
 * @Author: yanbuw1911
 * @Date: 2021-04-29 10:56:03
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-05-07 14:27:53
 * @Description: 员工信息
 * @FilePath: /sverp-front/src/views/HRD/KPI/setting/employee.vue
-->
<template>
  <div @dragenter="handleDragenter" @dragleave="handleDragleave" @dragover="handleDragover" @drop="handleDrop">
    <sv-grid v-bind="svgridOptions" v-on="svgridEvts">
      <template #svgridToolbar>
        <a-upload
          accept=".xls, .xlsx"
          name="file"
          @change="handleFileChange"
          :showUploadList="false"
          :before-upload="() => false"
          style="margin: 0 5px;"
        >
          <a-button shape="circle" :title="$t('upload')">
            <a-icon type="upload" />
          </a-button>
        </a-upload>
        <a-button shape="circle" :title="$t('export')" :disabled="!svgridOptions.data.length" @click="handleExport">
          <a-icon type="export" />
        </a-button>
      </template>
    </sv-grid>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import { updateKpiInfoWorkers, getKpiInfoWorkers } from '@/api/hrd'
import moment from 'moment'

export default {
  data () {
    return {
      svgridOptions: {
        showHeader: false,
        title: '员工信息表格',
        data: [],
        loading: false,
        columns: [],
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
    handleDragenter (e) {
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragleave (e) {
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover (e) {
      e.stopPropagation()
      e.preventDefault()
    },
    handleDrop (e) {
      e.stopPropagation()
      e.preventDefault()
      const fileData = e.dataTransfer.files
      this.handleUpload(fileData[0])
    },
    handleMenuClick ({ menu }) {
      switch (menu.code) {
        case 'export':
          this.handleExport()
          break
        case 'upload':
          this.handleUpload()
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
    handleFileChange ({ file }) {
      this.handleUpload(file)
    },
    handleXlsx2Arr (file) {
      return new Promise((resolve, reject) => {
        try {
          const reader = new FileReader()
          reader.onload = e => {
            try {
              const data = e.target.result
              const wb = XLSX.read(data, { type: 'binary' })
              const arr = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
              this.svgridOptions.columns = Object.keys(arr[0]).map(e => ({
                title: e.trim(),
                field: e.trim()
              }))
              this.svgridOptions.data = arr.map(item => {
                const o = {}
                Object.values(item).forEach((e, i) => {
                  o[this.svgridOptions.columns[i].field] = e
                })
                return o
              })
              reader.onloadend = () => {
                resolve(this.svgridOptions.data)
              }
            } catch (error) {
              reject(error)
            }
          }
          reader.readAsBinaryString(file)
        } catch (error) {
          reject(error)
        }
      })
    },
    async handleUpload (file) {
      if (/\.xlsx?$/.test(file.type)) {
        this.svgridOptions.loading = true
        await this.handleXlsx2Arr(file)
          .then(async data => {
            await updateKpiInfoWorkers(data).then(({ result }) => {
              if (result) {
                this.$message.success('上传更新成功')
                this.svgridOptions.desc = '上次更新于 ' + moment().format('YYYY-MM-DD HH:mm:ss')
              } else {
                this.$message.error('上传更新失败')
              }
            })
          })
          .catch(() => {
            this.$message.error('数据读取失败，请检查格式是否正确')
          })

        this.svgridOptions.loading = false
      } else {
        this.$message.info('文件类型应为 xls,xlsx')
      }
    },
    async getData () {
      this.svgridOptions.loading = true
      await getKpiInfoWorkers().then(res => {
        if (res.length !== 0) {
          this.svgridOptions.desc = '上次更新于 ' + Object.keys(res)[0]
          this.svgridOptions.data = Object.values(res)[0]
          this.svgridOptions.columns = Object.keys(this.svgridOptions.data[0])
            .filter(e => e !== 'id')
            .map(e => ({
              title: e,
              field: e
            }))
        }
      })
      this.svgridOptions.loading = false
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
