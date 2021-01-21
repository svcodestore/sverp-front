<template>
  <div>
    <sv-grid ref="svGrid" v-bind="svGridOptions" v-on="svGridEvents"></sv-grid>
  </div>
</template>

<script>
import { getAllMenuList, saveMenuOpt } from '@/api/menu'

export default {
  data () {
    return {
      svGridOptions: {
        loading: false,
        data: [],
        operatorFields: {
          creator: 'mnu_creator',
          modifier: 'mnu_modifier'
        },
        addItem: {
          defaultValue: {
            mnu_status: 0,
            mnu_join_date: null,
            mnu_mod_date: null
          },
          focusField: 'pid'
        },
        handleInsert: this.handleInsert,
        handleUpdate: {
          mnu_modifier: this.$store.state.user.info.con_id
        },
        handleSaveOpt: saveMenuOpt,
        columns: [
          {
            field: 'id',
            title: 'ID',
            width: 60,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'pid',
            title: 'PID',
            editRender: { name: 'input' },
            width: 90,
            sortable: true,
            fixed: 'left'
          },
          {
            field: 'mnu_code',
            title: '节点',
            editRender: { name: 'input' },
            sortable: true,
            filters: [],
            fixed: 'left',
            width: 110
          },
          {
            field: 'mnu_parent',
            title: '父节点',
            editRender: {
              name: 'input'
            },
            sortable: true,
            filters: [],
            fixed: 'left',
            width: 130
          },
          {
            field: 'mnu_name',
            title: '名称',
            editRender: { name: 'input' },
            width: 110,
            sortable: true
          },
          {
            field: 'mnu_alias',
            title: '别名',
            editRender: { name: 'input' }
          },
          {
            field: 'mnu_seq',
            title: '排序',
            editRender: { name: 'input' },
            sortable: true
          },
          {
            field: 'mnu_path',
            title: '路径',
            editRender: { name: 'input' },
            width: 160
          },
          {
            field: 'mnu_redirect',
            title: '重定向',
            editRender: { name: 'input' }
          },
          {
            field: 'mnu_component',
            title: '组件',
            editRender: { name: 'input' },
            width: 160
          },
          {
            field: 'mnu_icon',
            title: '图标',
            editRender: { name: 'input' },
            width: 90
          },
          {
            field: 'mnu_status',
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
            },
            width: 90
          },
          {
            field: 'mnu_join_date',
            title: '创建时间',
            width: 110,
            sortable: true
          },
          {
            field: 'mnu_mod_date',
            title: '修改时间',
            width: 110,
            sortable: true
          },
          {
            field: 'creator',
            title: '创建人',
            width: 120,
            sortable: true
          },
          {
            field: 'modifier',
            title: '修改人',
            width: 120,
            sortable: true
          }
        ]
      },
      svGridEvents: {
        refresh: this.getMenu
      }
    }
  },
  methods: {
    async getMenu () {
      this.svGridOptions.loading = true
      await getAllMenuList()
        .then(res => {
          if (res.result) {
            this.svGridOptions.data = res.data
          }
        })
        .catch(() => {})
      this.svGridOptions.loading = false
    },
    handleInsert (insertItem) {
      if (!insertItem.mnu_icon) {
        delete insertItem.mnu_icon
      }

      delete insertItem.mnu_join_date
      delete insertItem.mnu_mod_date
      delete insertItem.creator
      delete insertItem.modifier

      return insertItem
    }
  },
  mounted () {
    this.getMenu()
  }
}
</script>
