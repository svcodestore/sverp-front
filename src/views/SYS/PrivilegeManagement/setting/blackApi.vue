<!--
 * @Author: yanbuw1911
 * @Date: 2020-12-14 10:50:30
 * @LastEditTime: 2021-01-22 17:10:34
 * @LastEditors: yanbuw1911
 * @Description: 设置用户、组、角色的黑名单接口（API）
 * @FilePath: \client\src\views\SYS\PrivilegeManagement\setting\blackApi.vue
-->
<template>
  <div>
    <sv-grid v-bind="apiGridOptions" v-on="apiGridEvents"></sv-grid>
    <sv-grid v-bind="blackApiGridOptions" v-on="blackApiGridEvents">
      <template #user="{row, column}">
        {{
          users.find(u => u.con_id == row[column.property])
            ? users.find(u => u.con_id == row[column.property]).con_name
            : row[column.property]
        }}
      </template>

      <template #userEdit="{row, column}">
        <a-auto-complete
          class="autocomplete"
          style="width: 100%;"
          :defaultOpen="true"
          :dropdown-style="{ width: '100%' }"
          v-model="row[column.property]"
          :filterOption="filterOption"
        >
          <template #dataSource>
            <a-select-option v-for="user in users" :key="user.con_id">
              {{ user.con_name }}
            </a-select-option>
          </template>
        </a-auto-complete>
      </template>
    </sv-grid>
  </div>
</template>

<script>
import { getApiList, getBlackApiList, saveBlackApiOpt } from '@/api/privilege'
import { getUsers } from '@/api/user'
export default {
  data () {
    return {
      users: [],
      apiGridOptions: {
        title: '接口列表',
        height: 300,
        loading: false,
        data: [],
        columns: [
          {
            title: '请求路径',
            field: 'path',
            width: 220,
            sortable: true
          },
          {
            title: '接口文档',
            field: 'doc',
            sortable: true
          }
        ]
      },
      apiGridEvents: {
        refresh: this.getData
      },
      blackApiGridOptions: {
        title: '黑名单列表',
        loading: false,
        data: [],
        handleSaveOpt: saveBlackApiOpt,
        editRules: {
          sua_usrid: [{ required: true, message: '请填写内容' }, { validator: this.userValidator }],
          sua_black_api: [{ required: true, message: '请填写内容' }]
        },
        columns: [
          {
            title: '用户',
            width: 220,
            field: 'sua_usrid',
            editRender: { autofocus: '.autocomplete input' },
            slots: { default: 'user', edit: 'userEdit' },
            sortable: true
          },
          {
            title: '接口',
            field: 'sua_black_api',
            editRender: {
              name: '$select',
              optionGroups: []
            },
            sortable: true
          }
        ]
      },
      blackApiGridEvents: {
        refresh: this.getData
      }
    }
  },
  methods: {
    async getData () {
      this.apiGridOptions.loading = true
      await getApiList()
        .then(data => (this.apiGridOptions.data = data))
        .catch(() => {})
      this.apiGridOptions.loading = false

      const apiModules = this.apiGridOptions.data.map(api => api.path.split('/')[1])
      this.blackApiGridOptions.columns[1].editRender.optionGroups = apiModules
        .filter((m, i) => apiModules.indexOf(m) === i)
        .sort()
        .map(m => ({
          label: m,
          options: this.apiGridOptions.data
            .filter(api => api.path.split('/')[1] === m)
            .map(api => ({ label: api.path, value: api.path }))
        }))

      this.blackApiGridOptions.loading = true

      await getUsers()
        .then(res => res.result && (this.users = res.data))
        .catch(() => {})

      await getBlackApiList()
        .then(res => res.result && (this.blackApiGridOptions.data = res.data))
        .catch(err => {
          console.log(err)
        })
      this.blackApiGridOptions.loading = false
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    },
    userValidator ({ cellValue }) {
      if (!this.users.find(u => u.con_id === cellValue)) {
        return new Error('非法数据')
      }
    }
  },
  async created () {
    await this.getData()
  }
}
</script>
