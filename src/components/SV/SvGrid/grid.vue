<!--
 * @Author: yanbuw1911
 * @Date: 2020-12-07 14:19:34
 * @LastEditTime: 2021-01-21 13:56:31
 * @LastEditors: yanbuw1911
 * @Description: 可编辑表格组件，提供格式化数据格式与后台交互。参考 vxe-table。
 * @FilePath: \client\src\components\SV\SvGrid\grid.vue
-->
<template>
  <vxe-grid ref="xGrid" v-bind="attrs" v-on="events">
    <template #toolbar>
      <slot name="toolbar">
        <div style="display: flex; margin-bottom: 2px;">
          <a-button shape="circle" :title="$t('refresh')" :size="btnSize" v-if="refreshBtn" @click="_handleRefreshGrid">
            <a-icon type="reload" />
          </a-button>
          <div class="toolbar-operate-btn" v-if="isEditable && isAllowEdit && (isAllowAdd || isAllowDel)">
            <a-button shape="circle" :title="$t('undo')" :size="btnSize" @click="$refs.xGrid.revertData()">
              <a-icon type="undo" />
            </a-button>
            <a-button
              type="primary"
              shape="circle"
              :title="$t('add')"
              :size="btnSize"
              @click="_handleAddItem"
              v-if="isAllowAdd"
            >
              <a-icon type="plus" />
            </a-button>
            <a-button
              type="danger"
              shape="circle"
              :title="$t('del')"
              :size="btnSize"
              :disabled="!currRow"
              @click="_handleDelItem"
              v-if="isAllowDel"
            >
              <a-icon type="delete" />
            </a-button>
            <a-popconfirm
              :title="$t('gridOptConfirmText')"
              :ok-text="$t('confirm')"
              :cancel-text="$t('cancel')"
              placement="rightTop"
              :disabled="popconfirmDisabled"
              @confirm="_submitOptData"
              @cancel="popconfirmDisabled = true"
            >
              <a-button
                shape="circle"
                :title="$t('save')"
                :size="btnSize"
                :loading="saveBtnLoading"
                :disabled="!handleSaveOpt"
                @click="_handleSaveData"
              >
                <a-icon v-show="!saveBtnLoading" type="save" />
              </a-button>
            </a-popconfirm>
          </div>
          <div v-if="title" class="toolbar-item toolbar-item-table-title">
            <a-tooltip placement="top" :title="desc" v-if="desc">
              <span>{{ title }}</span>
            </a-tooltip>
            <span v-else>{{ title }}</span>
          </div>
          <slot name="svgridToolbar"></slot>
          <div class="toolbar-item toolbar-item-right">
            <a-input
              class="svgrid-search-bar"
              v-if="isShowSearch"
              :placeholder="$t('svgrid.toolbar.search')"
              v-model.trim="filterStr"
            />
            <span>{{ `${$refs.xGrid ? $refs.xGrid.getTableData().visibleData.length : '0'}${$t('record')}` }}</span>
            <a-button shape="circle" :title="$t('zoom')" :size="btnSize" v-if="zoomBtn" @click="_zoom">
              <a-icon type="zoom-out" v-if="isMaxSize" />
              <a-icon type="zoom-in" v-else />
            </a-button>
            <vxe-pulldown ref="xDown">
              <template v-slot>
                <a-button
                  @click="showPanel"
                  shape="circle"
                  style="margin-left: 2px;"
                  :title="$t('displayedCol')"
                  :size="btnSize"
                  v-if="colSetBtn || isManyColumn"
                >
                  <a-icon type="menu" />
                </a-button>
              </template>
              <template v-slot:dropdown>
                <div class="visible-columns">
                  <a-checkbox
                    v-model="col.visible"
                    v-for="(col, idx) in getTableColumn().fullColumn"
                    :key="idx"
                    @change="refreshColumn"
                  >
                    {{ col.title }}
                  </a-checkbox>
                </div>
              </template>
            </vxe-pulldown>
          </div>
        </div>
      </slot>
    </template>
    <template v-for="slotname in colSlot" #[slotname]="{ row, column }">
      <slot :name="slotname" v-bind="{ row, column }"></slot>
    </template>
  </vxe-grid>
</template>

<script>
/* eslint-disable no-unused-expressions */
import XEUtils from 'xe-utils'
import { gridProps, svGridProps } from './props'

export default {
  props: {
    ...svGridProps,
    ...gridProps
  },
  data () {
    return {
      isMaxSize: false,
      currRow: null,
      popconfirmDisabled: true,
      saveBtnLoading: false,
      originData: null,
      isManyColumn: false,
      filterStr: ''
    }
  },
  watch: {
    data (now) {
      // 记录表格初始数据
      this.originData = now.map(e => XEUtils.clone(e, true))
    }
  },
  computed: {
    // 表格属性
    attrs () {
      const { filteredData, wrappedColumns, loading, editRules, rowClassName, align } = this

      return {
        class: this.class,
        loading,
        columns: wrappedColumns,
        data: filteredData,
        editRules,
        rowClassName,
        align,
        ...this.defaultAttrs
      }
    },
    // 过滤后的数据
    filteredData () {
      const { data, filterStr, columns } = this

      if (!filterStr) return data

      return data.filter(item =>
        columns
          .map(col => col.field)
          .some(
            key =>
              XEUtils.toString(item[key])
                .toLowerCase()
                .indexOf(filterStr) > -1
          )
      )
    },
    // 默认表格属性
    defaultAttrs () {
      const {
        border,
        height,
        showHeaderOverflow,
        showOverflow,
        mergedEditConfig,
        mergedMouseConfig,
        mergedKeyboardConfig
      } = this
      const defaultAttrs = {
        id: 'svGrid',
        height: height === null ? null : height || 500,
        rowId: 'id',
        stripe: true,
        round: true,
        autoResize: true,
        syncResize: true,
        highlightHoverRow: true,
        highlightCurrentRow: true,
        border: border || true,
        resizable: true,
        showHeaderOverflow,
        showOverflow,
        keepSource: true,
        editConfig: mergedEditConfig,
        mouseConfig: mergedMouseConfig,
        keyboardConfig: mergedKeyboardConfig
      }

      return defaultAttrs
    },
    mergedEditConfig () {
      return Object.assign({ trigger: 'dblclick', mode: 'cell', showStatus: true }, this.editConfig)
    },
    mergedMouseConfig () {
      return Object.assign({ selected: true }, this.mouseConfig)
    },
    mergedKeyboardConfig () {
      return Object.assign(
        { isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true },
        this.keyboardConfig
      )
    },
    // 包装父组件传过来的列属性配置
    wrappedColumns () {
      this.columns?.forEach((col, idx) => {
        // 如果有单选下拉框则添加下拉选项到列过滤器
        if (col.editRender?.name === '$select' && !col.editRender?.props?.multiple) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.columns[idx].filters = col.editRender.options
        }
      })

      return this.columns
    },
    events () {
      const evt = {
        'current-change': this._currentChange,
        'cell-dblclick': this._cellDblClick,
        'edit-actived': this.editActivedEvt
      }

      return evt
    },
    // 处理 slot
    colSlot () {
      const slots = []

      this.columns?.forEach(col => {
        if (col.slots) {
          const { header, footer, content, filter, edit } = col.slots
          col.slots.default && slots.push(col.slots.default)
          header && slots.push(header)
          footer && slots.push(footer)
          content && slots.push(content)
          filter && slots.push(filter)
          edit && slots.push(edit)
        }
      })

      return slots
    },
    // 是否为可编辑表格
    isEditable () {
      return this.wrappedColumns && this.wrappedColumns.findIndex(col => !!col.editRender) > -1
    },
    isShowSearch () {
      return this.searchBar || this.data.length > 7
    }
  },
  methods: {
    /**
     * @description: 显示动态列设置下拉框
     */
    showPanel () {
      this.$refs.xDown.showPanel()
    },
    /**
     * @description: 获取表格数据
     */
    getTableData () {
      return this.$refs.xGrid.getTableData()
    },
    /**
     * @description: 获取表格可显示的列
     */
    getColumns () {
      return this.$refs.xGrid.getColumns()
    },
    /**
     * @description: 获取表格的列
     */
    getTableColumn () {
      return this.$refs.xGrid.getTableColumn()
    },
    getColumnByField (field) {
      return this.$refs.xGrid.getColumnByField(field)
    },
    /**
     * @description: 刷新列，用于列的动态展示
     */
    refreshColumn () {
      this.$refs.xGrid.refreshColumn()
    },
    /**
     * @description: 设置当前行
     * @param Object row 哪一行数据
     */
    setCurrentRow (row) {
      this.$refs.xGrid.setCurrentRow(row)
    },
    /**
     * @description: 编辑模式下，聚焦单元格
     * @param Object row 哪一行数据
     * @param String field 哪个字段
     */
    setActiveCell (row, field) {
      this.$refs.xGrid.setActiveCell(row, field)
    },
    /**
     * @description: 获取格式化的修改数据，用于直接跟后台对接
     * @return false | Object
     */
    getGridOpt () {
      const {
        $store: {
          state: {
            user: {
              info: { con_id: usrid }
            }
          }
        },
        $refs: { xGrid },
        operatorFields: { creator, modifier },
        originData,
        handleInsert, // 处理新增数据的回调，用于处理新增数据的结构
        handleUpdate // 处理修改数据的回调，用于处理新增数据的结构
      } = this

      if (!originData) return false

      const { getInsertRecords, getRemoveRecords, getUpdateRecords } = xGrid
      const insertRecords = getInsertRecords()
      const removeRecords = getRemoveRecords()
      const updateRecords = getUpdateRecords()

      // 收集表格新增数据并格式化
      const fmtInsertRecords = {
        A: insertRecords.map(insertItem => {
          const o = {}
          for (const key in insertItem) {
            if (Array.isArray(insertItem[key])) {
              o[key] = insertItem[key].join(',')
            } else {
              o[key] = insertItem[key]
            }
          }
          // 自动设置创建者，修改者为当前登录账号
          creator && (o[creator] = usrid)
          modifier && (o[modifier] = usrid)
          delete o.id

          // 如果传入回调函数则交给回调自行处理
          if (typeof handleInsert === 'function') {
            return handleInsert(o)
          }

          return o
        })
      }

      // 收集表格删除数据并格式化
      const fmtRmRecords = { D: { id: removeRecords.map(e => e.id) } }

      // 获取表格修改数据并格式化
      const fmtUpdateRecords = { U: [] }
      const columns = Array.from(xGrid.getTableColumn().collectColumn).map(e => e.property)
      updateRecords.forEach(updateRecord => {
        let updateFields = {}

        if (typeof handleUpdate === 'function') {
          updateFields = handleUpdate(updateRecord, columns, originData)
        } else {
          const originRecord = originData.find(e => e.id === updateRecord.id)
          columns.forEach(key => {
            // 处理下拉框多选
            if (Array.isArray(updateRecord[key])) {
              if ((updateRecord[key] || []).toString() !== (originRecord[key] || []).toString()) {
                updateFields[key] = updateRecord[key].join(',')
              }
            } else {
              if (updateRecord[key] !== originRecord[key]) {
                updateFields[key] = updateRecord[key]
              }
            }
          })
          // 处理父组件传过来的 handleUpdate，如果是对象则合并
          if (typeof handleUpdate === 'object' && !Array.isArray(handleUpdate)) {
            updateFields = Object.assign(updateFields, handleUpdate)
          }
        }

        // 自动设置修改者为当前登录账号
        modifier && (updateFields[modifier] = usrid)
        if (Object.keys(updateFields).length !== 1 || !modifier) {
          fmtUpdateRecords.U.push({ [updateRecord.id]: updateFields })
        }
      })

      if (!fmtInsertRecords.A.length && !fmtRmRecords.D.id.length && !fmtUpdateRecords.U.length) {
        return false
      }
      const optData = Object.assign({}, fmtInsertRecords, fmtRmRecords, fmtUpdateRecords)

      return optData
    },
    /**
     * @description: 验证单元格是否符合验证规则
     * @return Promise
     */
    async fullValidate () {
      let err
      await this.$refs.xGrid.fullValidate().catch(errMap => {
        if (errMap) {
          err = errMap
        }
      })

      return Promise.reject(err)
    },
    /**
     * @description: antd vue, tooltip 自动调整
     */
    _getPopupContainer (trigger) {
      return trigger.parentElement
    },
    /**
     * @description: 表格全屏转换
     */
    _zoom () {
      this.isMaxSize = !this.isMaxSize
      this.$refs.xGrid.zoom()
    },
    /**
     * @description: 刷新
     */
    _handleRefreshGrid () {
      this.$emit('refresh', this.params)
    },
    /**
     * @description: 新增一条有默认值的记录
     */
    _handleAddItem () {
      const {
        $refs: { xGrid },
        addItem: { defaultValue, focusField }
      } = this

      xGrid.insert(defaultValue || {}).then(({ row }) => {
        focusField && xGrid.setActiveCell(row, focusField)
      })
    },
    /**
     * @description: 删除一条记录
     */
    _handleDelItem () {
      const {
        $refs: { xGrid },
        currRow
      } = this
      xGrid.remove(currRow)
    },
    /**
     * @description: 表格当前行发生变化事件
     */
    _currentChange ({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }) {
      this.currRow = row
      this.$emit('current-change', { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event })
    },
    /**
     * @description: 表格单元格双击事件
     */
    _cellDblClick ({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }) {
      this.$emit('cell-dblclick', { row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event })
    },
    /**
     * @description: 校验表格数据
     */
    async _handleSaveData () {
      this.popconfirmDisabled = true

      const errMap = await this.$refs.xGrid.fullValidate().catch(errMap => errMap)
      if (errMap) {
        this.$message.error(this.$t('dataFmtErr'))
        return
      }
      console.log(this.getGridOpt(), 'table modification')
      if (!this.getGridOpt()) return
      this.popconfirmDisabled = false
    },
    /**
     * @description: 提交表格修改数据给后台
     */
    async _submitOptData () {
      await this.handleSaveOpt(this.getGridOpt())
        ?.then(res => {
          const o = {}
          if (res.result) {
            this.currRow = null
            this._handleRefreshGrid()
            o.message = this.$t('saveSucc')
            o.icon = <a-icon type='smile' style='color: #108ee9' />
          } else {
            o.message = this.$t('saveFail')
            o.icon = <a-icon type='frown' style='color: #108ee9' />
          }
          this.$notification.open(o)
        })
        .catch(error => {
          this.$notification.error({
            message: error.response.status,
            description: error.response.data.message,
            icon: <a-icon type='frown' style='color: #108ee9' />
          })
        })
    }
  },
  updated () {
    // 超过 8 个列就显示展示列按钮
    this.isManyColumn = this.getTableColumn().fullColumn.length > 8
  }
}
</script>

<style lang="less" scoped>
@import './grid';
</style>
