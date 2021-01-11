<!--
 * @Author: yanbuw1911
 * @Date: 2021-01-07 11:11:38
 * @LastEditTime: 2021-01-11 08:17:34
 * @LastEditors: yanbuw1911
 * @Description: 商品用料
 * @FilePath: \client\src\views\HRD\MaterialManagement\materialUsed\index.vue
-->
<template>
  <div>
    <a-row class="material-container">
      <a-col :span="8">
        <sv-grid v-bind="materialOptions" v-on="materialEvents" ref="materialCategory"></sv-grid>
      </a-col>
      <a-col :span="2"></a-col>
      <a-col :span="12">
        <sv-grid v-bind="subMaterialOptions" v-on="subMaterialEvents"></sv-grid>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getMaterialCategory, getMaterialList, saveMaterialUsedOpt } from '@/api/hrd'
export default {
  data () {
    return {
      materialCurrRow: null,
      materialOptions: {
        zoomBtn: false,
        loading: false,
        data: [],
        allowDel: false,
        addItem: {
          focusField: 'hmu_material_name'
        },
        handleInsert: this.handleMaterialCategoryInsert,
        handleSaveOpt: saveMaterialUsedOpt,
        columns: [
          {
            type: 'seq',
            width: 50
          },
          {
            title: '种类名称',
            field: 'hmu_material_name',
            editRender: { name: 'input' }
          },
          {
            type: 'number',
            title: '种类编码',
            field: 'hmu_material_code',
            editRender: { name: 'input' }
          }
        ]
      },
      materialEvents: {
        refresh: this.getMaterialCategory,
        'current-change': this.handleMaterialChange
      },
      subMaterialOptions: {
        zoomBtn: false,
        loading: false,
        data: [],
        addItem: {
          focusField: 'hmu_material_name'
        },
        handleInsert: this.handleMaterialInsert,
        handleSaveOpt: saveMaterialUsedOpt,
        columns: [
          {
            type: 'seq',
            width: 50
          },
          {
            type: 'number',
            title: '种类编码',
            field: 'hmu_material_code',
            editRender: { name: 'input' }
          },
          {
            title: '种类名称',
            field: 'hmu_material_name',
            editRender: { name: 'input' }
          },
          {
            type: 'number',
            title: '规格型号',
            field: 'hmu_material_model',
            editRender: { name: 'input' }
          },
          {
            title: '计量单位',
            field: 'hmu_material_unit',
            editRender: { name: 'input' }
          }
        ]
      },
      subMaterialEvents: {
        refresh: this.getMaterialList
      }
    }
  },
  methods: {
    async getMaterialCategory () {
      this.materialOptions.loading = true
      await getMaterialCategory()
        .then(res => {
          res.result && (this.materialOptions.data = res.data)
          this.$refs.materialCategory.setCurrentRow(res.data[0])
        })
        .catch(() => {})
      this.materialOptions.loading = false
    },
    async getMaterialList (categoryId = this.materialCurrRow && this.materialCurrRow.id) {
      this.subMaterialOptions.loading = true
      await getMaterialList(categoryId)
        .then(res => res.result && (this.subMaterialOptions.data = res.data))
        .catch(() => {})
      this.subMaterialOptions.loading = false
    },
    handleMaterialChange ({ row }) {
      this.materialCurrRow = row
      this.getMaterialList(row ? row.id : '')
    },
    handleMaterialCategoryInsert (insertItem) {
      insertItem.hmu_material_parent = 0
      insertItem.hmu_material_model = 0

      return insertItem
    },
    handleMaterialInsert (insertItem) {
      insertItem.hmu_material_parent = this.materialCurrRow.id

      return insertItem
    }
  },
  async mounted () {
    await this.getMaterialCategory()
    this.getMaterialList(this.materialOptions.data[0].id)
  }
}
</script>

<style>
.material-container {
  width: 100%;
  display: flex;
  flex-flow: row;
}
</style>
