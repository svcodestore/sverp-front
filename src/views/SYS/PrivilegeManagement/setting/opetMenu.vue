<!--
 * @Author: yanbuw1911
 * @Date: 2020-12-09 15:15:33
 * @LastEditTime: 2021-01-11 13:49:01
 * @LastEditors: yanbuw1911
 * @Description: 权限映射菜单设定界面
 * @FilePath: \client\src\views\SYS\PrivilegeManagement\setting\opetMenu.vue
-->
<template>
  <div>
    <sv-grid ref="grid" v-bind="svGridOptions" v-on="svGridEvents">
      <template #assocMenu="{row, column}">
        {{
          menus.find(m => m.id == row[column.property])
            ? menus.find(m => m.id == row[column.property]).mnu_name
            : row[column.property]
        }}
      </template>
      <template #opetNameEdit="{row, column}">
        <a-auto-complete
          class="autocomplete"
          style="width: 100%;"
          :defaultOpen="true"
          :dropdown-style="{ width: '100%' }"
          v-model="row[column.property]"
          :filterOption="filterOption"
          @change="moreRowInfo"
        >
          <template #dataSource>
            <a-select-option v-for="operation in operations" :key="operation.opet_name">
              {{ `${operation.id}. ${operation.opet_name} ${operation.opet_desc} ${operation.opet_code}` }}
            </a-select-option>
          </template>
        </a-auto-complete>
      </template>
      <template #assocMenuEdit="{row, column}">
        <a-auto-complete
          class="autocomplete"
          style="width: 100%;"
          :defaultOpen="true"
          :dropdown-style="{ width: '100%' }"
          v-model="row[column.property]"
          :filterOption="filterOption"
        >
          <template #dataSource>
            <a-select-option v-for="menu in menus" :key="String(menu.id)">
              {{ `${menu.id}. ${menu.mnu_name} ${menu.mnu_path} ${menu.mnu_parent}` }}
            </a-select-option>
          </template>
        </a-auto-complete>
      </template>
    </sv-grid>
  </div>
</template>

<script>
import { getOpetMenuMap, saveOpetMenuMapOpt, getOperations } from '@/api/privilege'
import { getAllMenuList } from '@/api/menu'
export default {
  data () {
    return {
      menus: [],
      operations: [],
      svGridOptions: {
        loading: false,
        data: [],
        addItem: {
          defaultValue: {
            som_status: 1
          },
          focusField: 'som_assoc_menu'
        },
        handleSaveOpt: saveOpetMenuMapOpt,
        editRules: {
          som_opet_name: [
            {
              required: true,
              message: '请填写内容'
            },
            {
              validator: this.opetNameValidator
            }
          ],
          som_assoc_menu: [
            { required: true, message: '请填写内容' },
            { pattern: '[0-9*]', message: '非法数据' }
          ]
        },
        columns: [
          { field: 'id', title: 'ID' },
          {
            field: 'som_map_name',
            title: '名称',
            editRender: { name: 'input' }
          },
          {
            field: 'som_opet_code',
            title: '权限'
          },
          {
            field: 'som_opet_name',
            title: '权限名称',
            editRender: { autofocus: '.autocomplete input' },
            slots: { edit: 'opetNameEdit' }
          },
          {
            field: 'som_assoc_menu',
            title: '关联菜单',
            editRender: { autofocus: '.autocomplete input' },
            slots: { default: 'assocMenu', edit: 'assocMenuEdit' }
          },
          {
            field: 'som_status',
            title: '状态',
            editRender: {
              name: '$select',
              options: [
                { label: '停用', value: 0 },
                { label: '在用', value: 1 }
              ]
            }
          },
          {
            field: 'som_desc',
            title: '描述',
            editRender: { name: 'input' }
          },
          {
            field: 'som_ramark',
            title: '备注',
            editRender: { name: 'input' }
          }
        ]
      },
      svGridEvents: {
        refresh: this.getData
      }
    }
  },
  methods: {
    async getData () {
      this.svGridOptions.loading = true

      await getOperations()
        .then(res => res.result && (this.operations = res.data))
        .catch(() => {})

      await getAllMenuList()
        .then(res => res.result && (this.menus = res.data))
        .catch(() => {})

      await getOpetMenuMap()
        .then(res => res.result && (this.svGridOptions.data = res.data))
        .catch(() => {})
      this.svGridOptions.loading = false
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    },
    moreRowInfo (opetName) {
      const opet = this.operations.find(o => o.opet_name === opetName)
      if (opet) {
        this.$refs.grid.currRow.som_opet_code = opet.opet_code
      }
    },
    opetNameValidator ({ cellValue }) {
      if (!this.operations.find(o => o.opet_name === cellValue)) {
        return new Error('非法数据')
      }
    }
  },
  async created () {
    await this.getData()
  }
}
</script>
