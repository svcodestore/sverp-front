/*
 * @Author: yanbuw1911
 * @Date: 2020-12-09 09:56:33
 * @LastEditTime: 2021-01-12 11:32:40
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\locales\lang\zh-TW\index.js
 */
import antd from 'ant-design-vue/es/locale-provider/zh_CN'
import momentCN from 'moment/locale/zh-cn'

import sys from './SYS'
import home from './home'

const components = {
  antLocale: antd,
  momentName: 'zh-cn',
  momentLocale: momentCN
}

const menuNodes = {
  MIS: '電腦部',
  FIN: '財務部',
  BS: '業務部',
  TPM: 'TPM',
  'R&D': '研發部',
  PD: '採購部',
  PMD: '物管部',
  PROD: '生管部',
  HRD: '人資部',
  AD: '行政部',
  MIS_IDX: '電腦部主頁',
  FIN_IDX: '財務部主頁',
  BS_IDX: '業務部主頁',
  TPM_IDX: '設備列表',
  'R&D_IDX': '研發部主頁',
  PD_IDX: '採購部主頁',
  PMD_IDX: '物管部主頁',
  PROD_IDX: '生管部主頁',
  HRD_IDX: '人資部主頁',
  AD_IDX: '行政部主頁',
  SYS: '系統管理',
  SYS_IDX: '系統管理主頁',
  SYS_MENU_MANAGE: '菜單管理',
  SYS_USR_MANAGE: '用戶管理',
  HOME: '主頁',
  DASHBOARD: '儀錶盤',
  DASHBOARD_SOFT_REQUIRE: '軟件需求提案',
  DASHBOARD_TEST: '測試',
  TPM_RECORDS: '維修記錄',
  TPM_NOTICE: '維修通知',
  PROD_AUTOSCHD: '自動排程',
  SYS_PRVG: '權限管理',
  TPM_NOTIFIER: '通知人員',
  HRD_MATERIAL_MANAGE: '前台物料庫存管理',
  PERSONAL_CENTER: '個人中心',
  PERSONAL_SETTING: '個人設定'
}

const svGrid = {
  refresh: '刷新',
  undo: '還原',
  add: '新增',
  del: '刪除',
  save: '保存',
  gridOptConfirmText: '確認保存修改操作？',
  confirm: '確認',
  cancel: '還回',
  record: '條記錄',
  zoom: '縮放',
  saveSucc: '保存成功',
  saveFail: '保存失敗',
  dataFmtErr: '數據格式不符合預期',
  displayedCol: '展示列',
  'svgrid.col.name': '名稱',
  'svgrid.col.alias': '別名',
  'svgrid.col.pwd': '密碼',
  'svgrid.col.dept': '部門',
  'svgrid.col.group': '組',
  'svgrid.col.email': '郵箱',
  'svgrid.col.mobile': '手機',
  'svgrid.col.lang': '語言',
  'svgrid.col.status': '狀態',
  'svgrid.col.creator': '創建人',
  'svgrid.col.modifier': '修改人',
  'svgrid.col.joinDate': '創建時間',
  'svgrid.col.modDate': '修改時間',
  'svgrid.colGroup.yes': '是',
  'svgrid.colGroup.no': '否',
  'svgrid.colGroup.enable': '啟用',
  'svgrid.colGroup.disable': '停用',
  'svgrid.colGroup.allow': '允許',
  'svgrid.colGroup.disallow': '禁止',
  'svgrid.validate.required': '不能為空',
  'svgrid.validate.repeat': '重複',
  'svgrid.toolbar.search': '搜索表格內容...'
}

const locale = {
  'menu.home': '主頁',
  'menu.dashboard': '儀錶盤',
  'navBar.lang': '選擇語言',
  'navBar.usageManual': '使用指南',
  SV: '斯達文星',
  login: '登錄',
  removed: '已移除',
  added: '已添加',
  addToQN: '添加到快捷導航',
  ...menuNodes,
  ...svGrid,
  ...home,
  ...sys
}

export default {
  ...components,
  ...locale
}
