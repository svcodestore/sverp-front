/*
 * @Author: yanbuw1911
 * @Date: 2020-12-07 14:27:12
 * @LastEditTime: 2021-07-01 13:47:29
 * @LastEditors: yanbuw1911
 * @Description: 参考 vxe-grid
 * @FilePath: /sverp-front/src/components/SV/SvGrid/props.js
 */
const gridProps = {
  id: { type: String, default: () => 'svGrid' },
  columns: { type: Array, default: () => [] },
  data: { type: Array, default: () => [] },
  height: { type: [Number, String], default: () => 500 },
  autoResize: { type: Boolean, default: () => true },
  syncResize: { type: [Boolean, String, Number], default: () => true },
  resizable: { type: Boolean, default: () => true },
  stripe: { type: Boolean, default: () => true },
  border: {
    type: [Boolean, String],
    default: () => true,
    validator: function (value) {
      return ['inner', 'outer', 'none', 'full', true].includes(value)
    }
  },
  round: { type: Boolean, default: () => true },
  showHeader: { type: Boolean, default: () => true },
  highlightCurrentRow: { type: Boolean, default: () => true },
  highlightHoverRow: { type: Boolean, default: () => true },
  showOverflow: { type: [Boolean, String], default: () => true },
  showHeaderOverflow: { type: [Boolean, String], default: () => true },
  rowId: { type: String, default: () => 'id' },
  keepSource: { type: Boolean, default: () => true },
  mouseConfig: { type: Object, default: () => ({ selected: true }) },
  keyboardConfig: {
    type: Object,
    default: () => ({ isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true })
  },
  editConfig: {
    type: Object,
    default: () => ({
      trigger: 'dblclick',
      mode: 'cell',
      showStatus: true,
      showUpdateStatus: true,
      showInsertStatus: true,
      showAsterisk: true
    })
  },
  maxHeight: [Number, String],
  size: String,
  loading: Boolean,
  align: String,
  headerAlign: String,
  footerAlign: String,
  highlightCurrentColumn: Boolean,
  highlightHoverColumn: Boolean,
  highlightCell: Boolean, // draft
  rowClassName: [String, Function],
  cellClassName: [String, Function],
  headerRowClassName: [String, Function],
  headerCellClassName: [String, Function],
  footerRowClassName: [String, Function],
  footerCellClassName: [String, Function],
  showFooter: Boolean,
  footerMethod: Function,
  mergeCells: Array,
  mergeFooterItems: Array,
  showFooterOverflow: [Boolean, String],
  columnKey: { type: Boolean, default: () => true },
  rowKey: { type: Boolean, default: () => true },
  columnConfig: Object,
  seqConfig: Object,
  sortConfig: Object,
  filterConfig: Object,
  exportConfig: Object,
  importConfig: Object,
  printConfig: { type: Object, default: () => ({}) },
  radioConfig: Object,
  checkConfig: Object,
  tooltipConfig: Object,
  expandConfig: Object,
  treeConfig: Object,
  menuConfig: Object,
  validConfig: Object,
  editRules: Object,
  emptyText: String,
  emptyRender: Object,
  customConfig: Object,
  scrollX: Object,
  scrollY: Object,
  params: Object,
  formConfig: Object,
  toolbarConfig: Object,
  pagerConfig: Object,
  proxyConfig: Object,
  zoomConfig: Object,
  spanMethod: Function
}

const svGridProps = {
  title: {
    type: String,
    default: () => ''
  },
  desc: {
    type: String,
    default: () => ''
  },
  btnSize: {
    type: String,
    default: 'default',
    validator: function (value) {
      return ['large', 'default', 'small'].includes(value)
    }
  },
  refreshBtn: {
    type: Boolean,
    default: () => true
  },
  zoomBtn: {
    type: Boolean,
    default: () => true
  },
  colSetBtn: {
    type: Boolean,
    default: () => false
  },
  isAllowEdit: {
    type: Boolean,
    default: () => true
  },
  isAllowAdd: {
    type: Boolean,
    default: () => true
  },
  isAllowDel: {
    type: Boolean,
    default: () => true
  },
  rowDraggable: {
    type: Object,
    default: () => ({
      enable: false,
      mode: 'row'
    })
  },
  colDraggable: {
    type: Object,
    default: () => ({ enable: true })
  },
  addItem: { type: [Object, Function], default: () => ({}) },
  operatorFields: { type: Object, default: () => ({}) },
  handleInsert: { type: Function, default: null },
  handleUpdate: { type: [Object, Function], default: null },
  handleSaveOpt: {
    type: Function,
    default: null
  },
  searchBar: {
    type: Boolean,
    default: () => true
  },
  editActivedEvt: {
    type: Function,
    default: () => () => {}
  },
  toolDropdown: {
    type: Boolean,
    default: () => false
  }
}

export { gridProps, svGridProps }
