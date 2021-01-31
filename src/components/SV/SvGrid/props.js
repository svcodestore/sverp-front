/*
 * @Author: yanbuw1911
 * @Date: 2020-12-07 14:27:12
 * @LastEditTime: 2021-01-26 14:03:54
 * @LastEditors: yanbuw1911
 * @Description: 参考 vxe-grid
 * @FilePath: \client\src\components\SV\SvGrid\props.js
 */
const gridProps = {
  id: { type: String, default: () => 'svGrid' },
  columns: { type: Array, default: () => [] },
  data: { type: Array, default: () => [] },
  height: { type: [Number, String], default: () => 500 },
  masHeight: [Number, String],
  autoResize: { type: Boolean, default: () => true },
  syncResize: { type: [Boolean, String, Number], default: () => true },
  resizable: { type: Boolean, default: () => true },
  stripe: { type: Boolean, default: () => true },
  border: { type: [Boolean, String], default: () => true },
  round: { type: Boolean, default: () => true },
  size: String,
  loading: Boolean,
  align: String,
  headerAlign: String,
  footerAlign: String,
  showHeader: { type: Boolean, default: () => true },
  highlightCurrentRow: { type: Boolean, default: () => true },
  highlightHoverRow: { type: Boolean, default: () => true },
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
  showOverflow: { type: [Boolean, String], default: () => true },
  showHeaderOverflow: { type: [Boolean, String], default: () => true },
  showFooterOverflow: [Boolean, String],
  columnKey: Boolean,
  rowKey: Boolean,
  rowId: { type: String, default: () => 'id' },
  keepSource: { type: Boolean, default: () => true },
  columnConfig: Object,
  seqConfig: Object,
  sortConfig: Object,
  filterConfig: Object,
  exportConfig: Object,
  importConfig: Object,
  printConfig: Object,
  radioConfig: Object,
  checkConfig: Object,
  tooltipConfig: Object,
  expandConfig: Object,
  treeConfig: Object,
  menuConfig: Object,
  mouseConfig: { type: Object, default: () => ({ selected: true }) },
  keyboardConfig: {
    type: Object,
    default: () => ({ isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true })
  },
  editConfig: { type: Object, default: () => ({ trigger: 'dblclick', mode: 'cell', showStatus: true }) },
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
  zoomConfig: Object
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
    default: () => false
  },
  editActivedEvt: {
    type: Function,
    default: () => () => {}
  }
}

export { gridProps, svGridProps }
