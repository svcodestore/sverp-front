<!--
 * @Author: yanbuw1911
 * @Date: 2020-12-07 14:19:34
 * @LastEditTime: 2021-06-25 16:25:13
 * @LastEditors: yanbuw1911
 * @Description: 可编辑表格组件，提供格式化数据格式与后台交互。参考 vxe-table。
 * @FilePath: /sverp-front/src/components/SV/SvGrid/grid.vue
-->
<template>
  <vxe-grid ref="xGrid" v-bind="attrs" v-on="events">
    <template #toolbar>
      <slot name="toolbar">
        <div class="toolbar-container" @contextmenu="toolbarInvisible" v-if="showToolbar">
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
          <slot name="svgridToolbar"></slot>
          <div v-if="title" class="toolbar-item toolbar-item-table-title">
            <a-tooltip placement="top" :title="desc" v-if="desc">
              <span>{{ title }}</span>
            </a-tooltip>
            <span v-else>{{ title }}</span>
          </div>
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
                    <!-- 没有 title 则显示序号名称 -->
                    {{ col.title || '#' }}
                  </a-checkbox>
                </div>
              </template>
            </vxe-pulldown>
            <a-dropdown :trigger="['click']" v-if="toolDropdown">
              <a-button shape="circle" title="更多" style="margin-left: 2px;">
                <a-icon type="more" />
              </a-button>
              <a-menu slot="overlay">
                <a-menu-item key="print" @click="openPrint(printConfig)">
                  <a-icon type="printer" /> 打印内容
                </a-menu-item>
                <a-sub-menu key="export">
                  <template #title><a-icon type="export" /> 导出数据 </template>
                  <a-menu-item key="excel" @click="exportAsXlsx"><a-icon type="file-excel" /> EXCEL</a-menu-item>
                  <!-- <a-menu-item key="pdf" @click="exportAsPdf"><a-icon type="file-pdf" /> PDF</a-menu-item> -->
                  <a-menu-item key="more" @click="openExport"><a-icon type="ellipsis" /> 更多格式</a-menu-item>
                </a-sub-menu>
                <slot name="rightmenu"></slot>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
        <div class="toolbar-container-invisible" @click="showToolbar = true" v-else></div>
      </slot>
    </template>
    <template v-for="slotname in colSlot" #[slotname]="{ row, column }">
      <slot :name="slotname" v-bind="{ row, column }"></slot>
    </template>
  </vxe-grid>
</template>

<script>
/* eslint-disable no-unused-expressions */
import { toString, clone, toArrayTree, findTree } from 'xe-utils'
import { gridProps, svGridProps } from './props'

import moment from 'moment'
// import { jsPDF } from 'jspdf'
import XLSX from 'xlsx'
import Sortable from 'sortablejs'

export default {
  props: {
    ...svGridProps,
    ...gridProps
  },
  data () {
    return {
      showToolbar: true,
      showRowDropHelpTip: false,
      isMaxSize: false,
      currRow: null,
      popconfirmDisabled: true,
      saveBtnLoading: false,
      originData: [],
      isManyColumn: false,
      filterStr: ''
    }
  },
  watch: {
    data (now) {
      // 记录表格初始数据
      this.originData = now.map(e => clone(e, true))
    }
  },
  computed: {
    // 表格属性
    attrs () {
      const { gridData, wrappedColumns, defaultAttrs } = this

      const o = {}
      Object.keys(gridProps).forEach(prop => {
        if (this[prop] !== void 0) {
          o[prop] = this[prop]
        }
      })

      return Object.assign(o, {
        columns: wrappedColumns,
        data: gridData,
        ...defaultAttrs
      })
    },
    gridData () {
      const { filteredData, treeConfig } = this

      return treeConfig
        ? toArrayTree(
            filteredData,
            Object.assign({ key: 'id', parentKey: 'pid', children: 'children' }, treeConfig.options)
          )
        : filteredData
    },
    // 过滤后的数据
    filteredData () {
      const { data, filterStr, columns } = this

      if (!filterStr) return data

      return data.filter(item =>
        this.getColumnsField(columns)
          .flat(Infinity)
          .some(
            key =>
              toString(item[key])
                .toLowerCase()
                .indexOf(filterStr) > -1 ||
              toString(item[key])
                .toUpperCase()
                .indexOf(filterStr) > -1
          )
      )
    },
    // 默认表格属性
    defaultAttrs () {
      const { height, mergedEditConfig, mergedMouseConfig, mergedKeyboardConfig } = this
      const defaultAttrs = {
        height: height === null ? null : height || 500,
        editConfig: mergedEditConfig,
        mouseConfig: mergedMouseConfig,
        keyboardConfig: mergedKeyboardConfig
      }

      return defaultAttrs
    },
    mergedEditConfig () {
      return Object.assign({ trigger: 'dblclick', mode: 'cell' }, this.editConfig)
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
      this.setWrapColumn(this.columns)
      this.rowDraggable.enable &&
        this.rowDraggable.mode === 'cell' &&
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.columns.unshift({
          width: 40,
          slots: {
            default: () => {
              return [<a-icon type="drag" class="svgrid-drag-icon" />]
            },
            header: () => {
              return [
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>按住图标来拖动排序</span>
                  </template>
                  <a-icon type="question-circle" />
                </a-tooltip>
              ]
            }
          }
        })

      return this.columns
    },
    events () {
      const evt = {
        'current-change': this._currentChange,
        'cell-dblclick': this._cellDblClick,
        'edit-actived': this.editActivedEvt,
        'menu-click': this._menuClick,
        'filter-change': this._filterChange
      }

      return evt
    },
    // 处理 slot
    colSlot () {
      const slots = []

      this.setColumnSlot(this.columns, slots)

      return slots
    },
    /* 是否为可编辑表格 */
    isEditable () {
      return this.isEneableEdit(this.wrappedColumns)
    },
    isShowSearch () {
      return this.searchBar && this.data.length > 7
    }
  },
  methods: {
    toolbarInvisible (e) {
      e.preventDefault()
      this.showToolbar = false
    },
    setColumnSlot (columns, slots) {
      columns?.forEach(col => {
        if (col.children) {
          this.setColumnSlot(col.children, slots)
        } else if (col.slots) {
          const { header, footer, content, filter, edit } = col.slots
          col.slots.default && slots.push(col.slots.default)
          header && slots.push(header)
          footer && slots.push(footer)
          content && slots.push(content)
          filter && slots.push(filter)
          edit && slots.push(edit)
        }
      })
    },
    setWrapColumn (columns) {
      columns?.forEach((col, idx) => {
        // 如果有单选下拉框则添加下拉选项到列过滤器
        if (col.children) {
          this.setWrapColumn(col.children)
        } else {
          if (col.editRender?.name === '$select' && !col.editRender?.props?.multiple) {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.columns[idx].filters = col.editRender.options
          }

          // 默认开启进入编辑模式，自动选中内容
          if (col.editRender && col.editRender.autoselect === void 0) {
            col.editRender.autoselect = true
          }
        }
      })
    },
    isEneableEdit (columns) {
      let flag = false

      flag ||=
        columns &&
        columns.findIndex(col => {
          return !!col.editRender || (col.children && this.isEneableEdit(col.children))
        }) > -1

      return flag
    },
    getColumnsField (columns) {
      return columns.map(col => (col.children ? this.getColumnsField(col.children) : col.field))
    },
    /**
     * @description: 动态列筛选条件
     */
    dynamicColumnFilters (fieldOrColumn, filters) {
      const xGrid = this.$refs.xGrid
      const column = typeof fieldOrColumn === 'string' ? xGrid.getColumnByField(fieldOrColumn) : fieldOrColumn
      // 修改筛选列表，并默认设置为选中状态
      xGrid.setFilter(column, filters)
      // 修改条件之后，需要手动调用 updateData 处理表格数据
      xGrid.updateData()
    },
    print (options) {
      return this.$refs.xGrid.print(options)
    },
    openPrint (options) {
      return this.$refs.xGrid.openPrint(options)
    },
    beforePrintMethod () {
      return this.$refs.xGrid.beforePrintMethod()
    },
    exportData (options) {
      return this.$refs.xGrid.exportData(options)
    },
    openExport (options) {
      return this.$refs.xGrid.openExport(options)
    },
    exportAsXlsx () {
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
      const data = this.$refs.xGrid.getTableData().visibleData.map(e => {
        const o = Object.assign({}, e)
        delete o.id
        return o
      })

      workBook.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data, { skipHeader: true })
      XLSX.writeFile(workBook, `${moment().format('YYYY-MM-DD HH:mm:SSS')}.xlsx`, wopts)
    },
    exportAsPdf () {
      /* eslint new-cap: ["error", { "newIsCap": false }] */
      // const doc = new jsPDF()
      // const simkai = require('@/assets/simkai.ttf')
      // doc.addFileToVFS('simkai.ttf', simkai)
      // doc.addFont('simkai.ttf', 'simkai', 'normal')
      // doc.setFont('simkai')
      // doc.text('你好，世界！', 10, 10)
      // doc.save('a4.pdf')
    },
    /**
     * @description: 手动处理数据（对于手动更改了排序、筛选...等条件后需要重新处理数据时可能会用到）
     */
    updateData () {
      this.$refs.xGrid.updateData()
    },
    /**
     * @description: 用于 filters，修改筛选列表（在筛选条件更新之后可以调用 updateData 函数处理表格数据）
     */
    setFilter (fieldOrColumn, options) {
      this.$refs.xGrid.setFilter(fieldOrColumn, options)
    },
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
     * @description: 用于 tree-config，设置所有树节点的展开与否
     * @param Boolean checked
     */
    setAllTreeExpand (checked) {
      this.$refs.xGrid.setAllTreeExpand(checked)
    },
    /**
     * @description: 用于 tree-config，手动清空树形节点的展开状态，数据会恢复成未展开的状态
     * @param any row
     */
    clearTreeExpand (row) {
      this.$refs.xGrid.clearTreeExpand(row)
    },
    /**
     * @description: 用于 tree-config.lazy，手动清空懒加载树节点的状态，数据会恢复成未展开的状态，当再次展开时会重新加载
     * @param any row
     */
    clearTreeExpandLoaded (row) {
      this.$refs.xGrid.clearTreeExpandLoaded(row)
    },
    _filterChange ({ column, property, values, datas, filterList, $event }) {
      this.$emit('filter-change', { column, property, values, datas, filterList, $event })
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
          const originRecord = originData.find(e => e.id === updateRecord.id) || {}
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
    _menuClick ({ menu, type, row, rowIndex, column, columnIndex, $event }) {
      this.$emit('menu-click', { menu, type, row, rowIndex, column, columnIndex, $event })
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
            o.icon = <a-icon type="smile" style="color: #108ee9" />
          } else {
            o.message = this.$t('saveFail')
            o.icon = <a-icon type="frown" style="color: #108ee9" />
          }
          this.$notification.open(o)
        })
        .catch(error => {
          this.$notification.error({
            message: error.response.status,
            description: error.response.data.message,
            icon: <a-icon type="frown" style="color: #108ee9" />
          })
        })
    },
    columnDrop () {
      this.$nextTick(() => {
        const $table = this.$refs.xGrid
        this.colDropSortable = Sortable.create(
          $table.$el.querySelector('.body--wrapper>.vxe-table--header .vxe-header--row'),
          {
            handle: '.vxe-header--column:not(.col--fixed)',
            animation: 150,
            onEnd: ({ item, newIndex, oldIndex }) => {
              const { fullColumn, tableColumn } = $table.getTableColumn()
              const targetThElem = item
              const wrapperElem = targetThElem.parentNode
              const newColumn = fullColumn[newIndex]
              if (newColumn.fixed) {
                // 错误的移动
                if (newIndex > oldIndex) {
                  wrapperElem.insertBefore(targetThElem, wrapperElem.children[oldIndex])
                } else {
                  wrapperElem.insertBefore(wrapperElem.children[oldIndex], targetThElem)
                }
                return this.$message('固定列不允许拖动！')
              }
              // 转换真实索引
              const oldColumnIndex = $table.getColumnIndex(tableColumn[oldIndex])
              const newColumnIndex = $table.getColumnIndex(tableColumn[newIndex])
              // 移动到目标列
              const currRow = fullColumn.splice(oldColumnIndex, 1)[0]
              fullColumn.splice(newColumnIndex, 0, currRow)
              $table.loadColumn(fullColumn)
            }
          }
        )
      })
    },
    rowDrop () {
      this.$nextTick(() => {
        const xTable = this.$refs.xGrid
        let clsname
        switch (this.rowDraggable.mode) {
          case 'row':
            clsname = '.vxe-body--row'
            break
          case 'cell':
            clsname = '.svgrid-drag-icon'
            break
          default:
            clsname = '.vxe-body--row'
            break
        }
        this.rowDropSortable = Sortable.create(xTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
          handle: clsname,
          animation: 150,
          onEnd: ({ newIndex, oldIndex }) => {
            const currRow = this.gridData.splice(oldIndex, 1)[0]
            this.data.splice(newIndex, 0, currRow)
          }
        })
      })
    },
    treeDrop () {
      this.$nextTick(() => {
        const xTable = this.$refs.xGrid
        let clsname
        switch (this.rowDraggable.mode) {
          case 'row':
            clsname = '.vxe-body--row'
            break
          case 'cell':
            clsname = '.svgrid-drag-icon'
            break
          default:
            clsname = '.vxe-body--row'
            break
        }
        this.treeDropSortable = Sortable.create(xTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
          handle: clsname,
          animation: 150,
          onEnd: ({ item, oldIndex }) => {
            const options = { children: 'children' }
            const targetTrElem = item
            const wrapperElem = targetTrElem.parentNode
            const prevTrElem = targetTrElem.previousElementSibling
            const tableTreeData = this.gridData
            const selfRow = xTable.getRowNode(targetTrElem).item
            const selfNode = findTree(tableTreeData, row => row === selfRow, options)
            if (prevTrElem) {
              // 移动到节点
              const prevRow = xTable.getRowNode(prevTrElem).item
              const prevNode = findTree(tableTreeData, row => row === prevRow, options)
              if (findTree(selfRow[options.children], row => prevRow === row, options)) {
                // 错误的移动
                const oldTrElem = wrapperElem.children[oldIndex]
                wrapperElem.insertBefore(targetTrElem, oldTrElem)
                return this.$message('不允许自己给自己拖动！')
              }
              const currRow = selfNode.items.splice(selfNode.index, 1)[0]
              if (xTable.isTreeExpandByRow(prevRow)) {
                // 移动到当前的子节点
                prevRow[options.children].splice(0, 0, currRow)
              } else {
                // 移动到相邻节点
                prevNode.items.splice(prevNode.index + (selfNode.index < prevNode.index ? 0 : 1), 0, currRow)
              }
            } else {
              // 移动到第一行
              const currRow = selfNode.items.splice(selfNode.index, 1)[0]
              tableTreeData.unshift(currRow)
            }
            // 如果变动了树层级，需要刷新数据
            this.gridData = [...tableTreeData]
          }
        })
      })
    }
  },
  created () {
    this.colDraggable.enable && this.columnDrop()
    this.rowDraggable.enable && (this.treeConfig ? this.treeDrop() : this.rowDrop())
  },
  beforeDestroy () {
    if (this.colDraggable.enable && this.colDropSortable) {
      this.colDropSortable.destroy()
    }
    if (this.rowDraggable.enable && this.rowDropSortable) {
      this.rowDropSortable.destroy()
    }
    if (this.rowDraggable.enable && this.treeDropSortable) {
      this.treeDropSortable.destroy()
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
