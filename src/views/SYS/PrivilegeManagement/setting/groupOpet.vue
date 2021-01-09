<!--
 * @Author: yanbuw1911
 * @Date: 2020-12-09 15:16:29
 * @LastEditTime: 2020-12-16 11:13:31
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\views\SYS\PrivilegeManagement\setting\groupOpet.vue
-->
<template>
  <div>
    <sv-grid v-on="gridEvts" v-bind="gridOptions">
      <template #group="{row, column}">
        {{
          groups.find(g => g.id == row[column.property])
            ? groups.find(g => g.id == row[column.property]).sgd_alias
            : row[column.property]
        }}
      </template>
      <template #opet="{row, column}">
        {{
          opetMenuMap.find(o => o.id == row[column.property])
            ? opetMenuMap.find(o => o.id == row[column.property]).som_map_name
            : row[column.property]
        }}
      </template>
      <template #groupEdit="{row, column}">
        <a-auto-complete
          class="autocomplete"
          style="width: 100%;"
          :defaultOpen="true"
          :dropdown-style="{ width: '100%' }"
          v-model="row[column.property]"
          :filterOption="filterOption"
        >
          <template #dataSource>
            <a-select-option v-for="group in groups" :key="String(group.id)">
              {{ `${group.id}. ${group.sgd_code} ${group.sgd_alias}` }}
            </a-select-option>
          </template>
        </a-auto-complete>
      </template>
      <template #opetEdit="{row, column}">
        <a-auto-complete
          class="autocomplete"
          style="width: 100%;"
          :defaultOpen="true"
          :dropdown-style="{ width: '100%' }"
          v-model="row[column.property]"
          :filterOption="filterOption"
        >
          <template #dataSource>
            <a-select-option v-for="opet in opetMenuMap" :key="String(opet.id)">
              {{ `${opet.id}. ${opet.som_map_name} ${opet.som_desc}` }}
            </a-select-option>
          </template>
        </a-auto-complete>
      </template>
    </sv-grid>
  </div>
</template>

<script>
import { getGroupOpetMap, saveGroupOpetMapOpt, getOpetMenuMap, getGroups } from '@/api/privilege'
export default {
  data () {
    return {
      groups: [],
      opetMenuMap: [],
      gridOptions: {
        loading: false,
        data: [],
        handleSaveOpt: saveGroupOpetMapOpt,
        editRules: {
          map_do_oid: [
            {
              required: true,
              message: '请填写内容'
            },
            {
              validator: this.opetValidator
            }
          ],
          map_do_did: [
            {
              required: true,
              message: '请填写内容'
            },
            { validator: this.groupValidator }
          ]
        },
        columns: [
          {
            field: 'map_do_did',
            title: '组别',
            editRender: { autofocus: '.autocomplete input' },
            slots: { default: 'group', edit: 'groupEdit' }
          },
          {
            field: 'map_do_oid',
            title: '操作',
            editRender: { autofocus: '.autocomplete input' },
            slots: { default: 'opet', edit: 'opetEdit' }
          }
        ]
      },
      gridEvts: {
        refresh: this.getData
      }
    }
  },
  methods: {
    async getData () {
      this.gridOptions.loading = true

      await getGroups()
        .then(res => res.result && (this.groups = res.data))
        .catch(() => {})

      await getOpetMenuMap()
        .then(res => res.result && (this.opetMenuMap = res.data))
        .catch(() => {})

      await getGroupOpetMap()
        .then(res => res.result && (this.gridOptions.data = res.data))
        .catch(() => {})
      this.gridOptions.loading = false
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    },
    opetValidator ({ cellValue }) {
      if (!this.opetMenuMap.find(o => String(o.id) === cellValue)) {
        return new Error('非法数据')
      }
    },
    groupValidator ({ cellValue }) {
      if (!this.groups.find(r => String(r.id) === cellValue)) {
        return new Error('非法数据')
      }
    }
  },
  async created () {
    await this.getData()
  }
}
</script>
