<!--
 * @Author: yanbuw1911
 * @Date: 2021-05-12 11:03:30
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-05-12 16:58:05
 * @Description: 职务设置
 * @FilePath: /sverp-front/src/views/HRD/KPI/setting/postion/postSetting.vue
-->
<template>
  <div>
    <a-row :gutter="20">
      <a-col :span="12">
        <sv-grid v-bind="titleGridOptions" v-on="titleGridEvents"></sv-grid>
      </a-col>
      <a-col :span="12">
        <sv-grid v-bind="postGridOptions" v-on="postGridEvents"></sv-grid>
      </a-col>
    </a-row>
    <a-row>
      <sv-grid ref="xTree" v-bind="deptGridOptions" v-on="deptGridEvents"></sv-grid>
    </a-row>
  </div>
</template>

<script>
import { getDepts, saveDeptsOpt, getTitles, saveTitlesOpt, getPositions, savePositionsOpt } from '@/api/hrd'

export default {
  data () {
    return {
      titleGridOptions: {
        height: 350,
        title: '头衔设置',
        loading: false,
        data: [],
        handleSaveOpt: saveTitlesOpt,
        columns: [
          {
            type: 'seq',
            width: 50
          },
          {
            field: 'cpt_title',
            title: '头衔',
            editRender: { name: 'input' },
            sortable: true
          }
        ]
      },
      titleGridEvents: {
        refresh: this.getTitlesData
      },
      postGridOptions: {
        height: 350,
        title: '职位设置',
        loading: false,
        data: [],
        handleSaveOpt: savePositionsOpt,
        columns: [
          {
            type: 'seq',
            width: 50
          },
          {
            field: 'cph_position',
            title: '职位',
            editRender: { name: 'input' },
            sortable: true
          }
        ]
      },
      postGridEvents: {
        refresh: this.getPositionsData
      },
      deptGridOptions: {
        height: 450,
        title: '职位分组设置',
        desc: '不同的分组下可以有相同的职位',
        loading: false,
        data: [],
        addItem: {
          defaultValue: {
            pid: 0
          },
          focusField: 'pid'
        },
        handleInsert: this.handleInsert,
        handleSaveOpt: saveDeptsOpt,
        treeConfig: {
          children: 'children',
          expandAll: true
        },
        editRules: {
          pid: [
            { required: true, message: '上级 ID 必须填写' },
            { pattern: /^\d{1,6}$/, message: '格式不正确' }
          ],
          cdw_name: [{ required: true, message: '部门名称必须填写' }]
        },
        columns: [
          {
            field: 'id',
            title: 'ID',
            width: 80,
            treeNode: true
          },
          {
            field: 'pid',
            title: '上级 ID',
            editRender: { name: 'input' },
            width: 120,
            sortable: true
          },
          {
            field: 'cdw_name',
            title: '部门名称',
            editRender: { name: 'input' },
            sortable: true
          },
          {
            field: 'cdw_remark',
            title: '备注',
            editRender: { name: 'input' },
            sortable: true
          }
        ]
      },
      deptGridEvents: {
        refresh: this.getDeptsData
      }
    }
  },
  methods: {
    async getTitlesData () {
      this.titleGridOptions.loading = true
      await getTitles().then(({ result, data }) => {
        result && (this.titleGridOptions.data = data)
      })
      this.titleGridOptions.loading = false
    },
    async getPositionsData () {
      this.postGridOptions.loading = true
      await getPositions().then(({ result, data }) => {
        result && (this.postGridOptions.data = data)
      })
      this.postGridOptions.loading = false
    },
    async getDeptsData () {
      this.deptGridOptions.loading = true
      await getDepts().then(({ result, data }) => {
        result && (this.deptGridOptions.data = data)
      })
      this.$refs.xTree.setAllTreeExpand(true)
      this.deptGridOptions.loading = false
    },
    handleInsert (insertItem) {
      const pid = Number(insertItem.pid)
      const pitem = this.deptGridOptions.data.find(e => e.id === pid)
      if (pitem) {
        if (insertItem.cdw_name === pitem.cdw_name) {
          insertItem.cdw_code = pitem.cdw_code + '_S'
        } else {
          insertItem.cdw_code = pitem.cdw_code + '_S' + (Math.random() * 100000).toFixed(0)
        }
      } else {
        insertItem.cdw_code = insertItem.cdw_name
      }

      return insertItem
    }
  },
  mounted () {
    this.getTitlesData()
    this.getPositionsData()
    this.getDeptsData()
  }
}
</script>
