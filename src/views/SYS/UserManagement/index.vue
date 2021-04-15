<template>
  <div>
    <a-input-search
      style="width: 180px;margin-bottom: 10px;"
      :loading="searchLoading"
      :max-length="16"
      @search="handleSearch"
      @focus="showInfoTbl = false"
    />
    <sv-grid ref="svGrid" v-bind="svGridOptions" v-on="svGridEvents" v-show="showInfoTbl"></sv-grid>
  </div>
</template>

<script>
import { getGroups, getUserInfo, saveUserOpt } from '@/api/user'
import md5 from 'md5'
import XEUtils from 'xe-utils'
let groups = []

export default {
  data () {
    return {
      svGridOptions: {
        loading: false,
        data: [],
        params: {},
        operatorFields: {
          creator: 'con_creator',
          modifier: 'con_modifier'
        },
        addItem: {
          defaultValue: {
            con_status: 0,
            con_is_del: 1,
            con_lang: 'zh_CN'
          },
          focusField: 'con_id'
        },
        handleInsert: this.handleInsert,
        handleUpdate: this.handleUpdate,
        editConfig: {
          activeMethod: this.activeCellMethod
        },
        editRules: {
          con_id: [
            { required: true, message: this.$t('sys.userManagement.validate.idRequired') },
            { pattern: '[0-9a-zA-Z]{4,16}', message: this.$t('sys.userManagement.validate.idPattern') },
            { validator: this.idValidator }
          ],
          con_password: [{ required: true, message: this.$t('sys.userManagement.validate.pwdRequired') }],
          con_mobile: [{ validator: this.mobileValidator }],
          con_email: [{ validator: this.emailValidator }]
        },
        keyboardConfig: {
          editMethod: this.editMethod
        },
        handleSaveOpt: saveUserOpt,
        columns: []
      },
      svGridEvents: {
        refresh: this.refreshTable
      },
      searchLoading: false,
      showInfoTbl: false
    }
  },
  methods: {
    async refreshTable ({ searchKeyword: usrid }) {
      this.svGridOptions.loading = true
      await getUserInfo(usrid)
        .then(result => {
          if (result.result) {
            this.svGridOptions.data = result.data
          }
          this.svGridOptions.loading = false
        })
        .catch(() => {})
    },
    async handleSearch (usrid) {
      if (!usrid) return

      this.searchLoading = true

      XEUtils.throttle(
        await getUserInfo(usrid)
          .then(result => {
            if (result.result) {
              this.svGridOptions.data = result.data

              this.svGridOptions.params.searchKeyword = usrid
              this.showInfoTbl = true
            }
          })
          .catch(() => {}),
        300
      )

      this.searchLoading = false
    },
    editMethod ({ row, column }) {
      this.$refs.svGrid.setActiveCell(row, column.property)
      return false
    },
    activeCellMethod ({ row, rowIndex, column, columnIndex }) {
      if (row.con_id && column.property === 'con_id' && !/^row_/.test(row.id)) {
        return false
      }

      return true
    },
    handleUpdate (updateItem, columns, originData) {
      const usrid = this.$store.state.user.info.con_id
      const originRecord = originData.find(e => e.id === updateItem.id)
      const updateFields = {}
      columns.forEach(key => {
        if (Array.isArray(updateItem[key])) {
          if (updateItem[key].toString() !== originRecord[key].toString()) {
            updateFields[key] = updateItem[key].join(',')
          }
        } else {
          if (updateItem[key] !== originRecord[key]) {
            if (key === 'con_password') {
              updateFields[key] = updateItem[key] && md5(updateItem[key])
            } else {
              updateFields[key] = updateItem[key]
            }
          }
        }
      })
      updateFields['con_modifier'] = usrid

      return updateFields
    },
    handleInsert (insertItem) {
      insertItem.con_password = insertItem.con_password && md5(insertItem.con_password)

      delete insertItem.con_join_date
      delete insertItem.con_mod_date
      delete insertItem.sue_last_login_time
      delete insertItem.sue_last_loginip
      delete insertItem.creator
      delete insertItem.modifier

      return insertItem
    },
    idValidator () {
      const idList = this.$refs.svGrid.getTableData().visibleData.map(item => item.con_id)
      if (idList.length !== [...new Set(idList)].length) {
        return new Error(this.$t('sys.userManagement.validate.nameRepeat'))
      }
    },
    mobileValidator ({ cellValue }) {
      if (!cellValue) return

      if (!/^[0-9]{11}$/.test(cellValue)) {
        return new Error('手机号码格式不正确')
      }
    },
    emailValidator ({ cellValue }) {
      if (!cellValue) return

      if (!/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(cellValue)) {
        return new Error('邮箱格式不正确')
      }
    }
  },
  async beforeCreate () {
    await getGroups()
      .then(res => res.result && (groups = res.data.filter(d => d.sgd_is_dept === 1)))
      .catch(() => {})
    this.svGridOptions.columns = [
      {
        field: 'con_id',
        title: '用户标识',
        editRender: { name: 'input' },
        width: 100
      },
      {
        field: 'con_name',
        title: '名称',
        editRender: { name: 'input' },
        width: 70
      },
      {
        field: 'con_alias',
        title: '别名',
        editRender: { name: 'input' },
        width: 70
      },
      {
        field: 'con_password',
        title: '密码',
        editRender: {
          name: 'input'
        }
      },
      {
        field: 'con_staffnum',
        title: '工号',
        editRender: { name: 'input' },
        width: 70
      },
      {
        field: 'con_dept',
        title: '部门',
        width: 70,
        editRender: {
          name: '$select',
          options: groups
            .filter(group => group.sgd_is_dept === 1)
            .map(group => ({ label: group.sgd_alias, value: group.sgd_code }))
        }
      },
      {
        field: 'con_email',
        title: '邮箱',
        editRender: { name: 'input' }
      },
      {
        field: 'con_title',
        title: '职位',
        editRender: {
          name: '$select',
          options: [
            {
              value: 'software developer',
              label: '软件开发'
            },
            {
              value: 'hardware maintainer',
              label: '硬件维护'
            }
          ]
        }
      },
      {
        field: 'con_mobile',
        title: '手机',
        editRender: { name: 'input' }
      },
      {
        field: 'con_manager',
        title: '上司'
      },
      {
        field: 'con_lang',
        title: '语言',
        editRender: {
          name: '$select',
          options: [
            {
              value: 'zh_CN',
              label: '中文'
            },
            {
              value: 'zh_TW',
              label: '中文台湾'
            },
            {
              value: 'en_US',
              label: '英文'
            }
          ]
        }
      },
      {
        field: 'con_status',
        title: '状态',
        editRender: {
          name: '$select',
          options: [
            {
              value: 0,
              label: this.$t('svgrid.colGroup.disable')
            },
            {
              value: 1,
              label: this.$t('svgrid.colGroup.enable')
            }
          ]
        }
      },
      {
        field: 'con_is_del',
        title: '允许删除',
        editRender: {
          name: '$select',
          options: [
            {
              value: 0,
              label: this.$t('svgrid.colGroup.disallow')
            },
            {
              value: 1,
              label: this.$t('svgrid.colGroup.allow')
            }
          ]
        }
      },
      {
        field: 'sue_last_login_time',
        title: '登录时间',
        width: 110
      },
      {
        field: 'sue_last_loginip',
        title: '登录IP'
      },
      {
        field: 'con_join_date',
        title: '创建时间',
        width: 110
      },
      {
        field: 'con_mod_date',
        title: '修改时间',
        width: 110
      },
      {
        field: 'creator',
        title: '创建人'
      },
      {
        field: 'modifier',
        title: '修改人'
      }
    ]
  }
}
</script>
