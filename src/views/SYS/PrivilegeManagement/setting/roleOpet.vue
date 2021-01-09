<!--
 * @Author: yanbuw1911
 * @Date: 2020-12-09 15:16:05
 * @LastEditTime: 2020-12-17 14:33:06
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\views\SYS\PrivilegeManagement\setting\roleOpet.vue
-->
<template>
  <div>
    <sv-grid v-on="gridEvts" v-bind="gridOptions">
      <template #role="{row, column}">
        {{
          roles.find(r => r.id == row[column.property])
            ? roles.find(r => r.id == row[column.property]).role_desc
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
      <template #roleEdit="{row, column}">
        <a-auto-complete
          class="autocomplete"
          style="width: 100%;"
          :defaultOpen="true"
          :dropdown-style="{ width: '100%' }"
          v-model="row[column.property]"
          :filterOption="filterOption"
        >
          <template #dataSource>
            <a-select-option v-for="role in roles" :key="String(role.id)">
              {{ `${role.id}. ${role.role_code} ${role.role_desc}` }}
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
import { getRoleOpetMap, saveRoleOpetMapOpt, getOpetMenuMap, getRoles } from '@/api/privilege'
export default {
  data () {
    return {
      roles: [],
      opetMenuMap: [],
      gridOptions: {
        loading: false,
        data: [],
        handleSaveOpt: saveRoleOpetMapOpt,
        editRules: {
          map_ro_rid: [
            {
              required: true,
              message: '请填写内容'
            },
            {
              validator: this.roleValidator
            }
          ],
          map_ro_oid: [
            {
              required: true,
              message: '请填写内容'
            },
            { validator: this.opetValidator }
          ]
        },
        columns: [
          {
            field: 'map_ro_rid',
            title: '角色',
            editRender: { autofocus: '.autocomplete input' },
            slots: { default: 'role', edit: 'roleEdit' }
          },
          {
            field: 'map_ro_oid',
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

      await getRoles()
        .then(res => res.result && (this.roles = res.data))
        .catch(() => {})

      await getOpetMenuMap()
        .then(res => res.result && (this.opetMenuMap = res.data))
        .catch(() => {})

      await getRoleOpetMap()
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
    roleValidator ({ cellValue }) {
      if (!this.roles.find(r => String(r.id) === cellValue)) {
        return new Error('非法数据')
      }
    }
  },
  async created () {
    await this.getData()
  }
}
</script>
