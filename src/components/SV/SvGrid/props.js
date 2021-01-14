/*
 * @Author: yanbuw1911
 * @Date: 2020-12-07 14:27:12
 * @LastEditTime: 2021-01-14 13:23:36
 * @LastEditors: yanbuw1911
 * @Description: 参考 vxe-grid
 * @FilePath: \client\src\components\SV\SvGrid\props.js
 */
const gridProps = {
  id: { type: String, default: () => '' },
  columns: { type: Array, default: () => [] },
  data: { type: Array, default: () => [] },
  height: { type: [Number, String], default: () => 500 },
  masHeight: [Number, String],
  autoResize: Boolean,
  syncResize: [Boolean, String, Number],
  resizable: Boolean,
  stripe: Boolean,
  border: [Boolean, String],
  round: Boolean,
  size: String,
  loading: Boolean,
  align: String,
  headerAlign: String,
  footerAlign: String,
  showHeader: Boolean,
  highlightCurrentRow: Boolean,
  highlightHoverRow: Boolean,
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
  rowId: String,
  keepSource: Boolean,
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
  mouseConfig: Object,
  keyboardConfig: Object,
  editConfig: Object,
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
    type: null,
    default: null
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
