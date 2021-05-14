/*
 * @Author: yanbuw1911
 * @Date: 2020-12-09 09:56:05
 * @LastEditTime: 2021-05-11 08:49:18
 * @LastEditors: Mok.CH
 * @Description:
 * @FilePath: \sverp-front\src\locales\lang\zh-CN\index.js
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
  MIS: '电脑部',
  FIN: '财务部',
  BS: '业务部',
  TPM: 'TPM',
  'R&D': '研发部',
  PD: '采购部',
  PMD: '物管部',
  PROD: '生管部',
  HRD: '人资部',
  AD: '行政部',
  MIS_IDX: 'MIS主页',
  FIN_IDX: '财务部主页',
  BS_IDX: '业务部主页',
  TPM_IDX: '设备列表',
  'R&D_IDX': '研发部主页',
  PD_IDX: '采购看板',
  PMD_IDX: '仓库入库看板',
  PMD_TW: '台中五金回料看板',
  PROD_IDX: '生管部主页',
  HRD_IDX: '人资部主页',
  AD_IDX: '行政部主页',
  SYS: '系统管理',
  SYS_IDX: '系统管理主页',
  SYS_MENU_MANAGE: '菜单管理',
  SYS_USR_MANAGE: '用户管理',
  HOME: '主页',
  DASHBOARD: '仪表盘',
  DASHBOARD_SOFT_REQUIRE: '软件需求提案',
  DASHBOARD_TEST: '测试',
  TPM_RECORDS: '维修记录',
  TPM_NOTICE: '维修通知',
  PROD_AUTOSCHD: '自动排程',
  SYS_PRVG: '权限管理',
  TPM_NOTIFIER: '通知人员',
  HRD_MATERIAL_MANAGE: '前台物料库存管理',
  PERSONAL_CENTER: '个人中心',
  PERSONAL_SETTING: '个人设置',
  CHAT: '聊天室',
  CHAT_IDX: '聊天主页',
  PROD_PROCEDURES: '工站管理',
  TPM_QADD: '快速报修',
  TPM_FITTINGS: '配件管理',
  TPM_MYREPORTS: '我的报修(TPM)',
  TPM_MYREPORTS_OTHER: '我的报修(其它)',
  TPM_MYORDERS: '我的工单',
  HRD_KPI: 'KPI（关键绩效指标）',
  HRD_KPI_SETTING: 'KPI 设置',
  HRD_KPI_VIEW: 'KPI 总览',
  DCS: '文控系统',
  DCS_PROCESS: '认证计划',
  DCS_LIST1: '流程作业指导书',
  DCS_LIST2: '工序标准作业票',
  DCS_LIST3: '设备操作规范',
  DCS_LIST4: '品管作业指导书'
}

const svGrid = {
  export: '导出',
  import: '导入',
  upload: '上传',
  download: '下载',
  print: '打印',
  refresh: '刷新',
  undo: '还原',
  add: '新增',
  del: '删除',
  save: '保存',
  gridOptConfirmText: '确认保存修改操作？',
  confirm: '确认',
  cancel: '返回',
  record: '条记录',
  zoom: '缩放',
  saveSucc: '保存成功',
  saveFail: '保存失败',
  dataFmtErr: '数据格式不符合预期',
  displayedCol: '展示列',
  'svgrid.col.name': '名称',
  'svgrid.col.alias': '别名',
  'svgrid.col.pwd': '密码',
  'svgrid.col.dept': '部门',
  'svgrid.col.group': '组',
  'svgrid.col.email': '邮箱',
  'svgrid.col.mobile': '手机',
  'svgrid.col.lang': '语言',
  'svgrid.col.status': '状态',
  'svgrid.col.creator': '创建人',
  'svgrid.col.modifier': '修改人',
  'svgrid.col.joinDate': '创建时间',
  'svgrid.col.modDate': '修改时间',
  'svgrid.colGroup.yes': '是',
  'svgrid.colGroup.no': '否',
  'svgrid.colGroup.enable': '启用',
  'svgrid.colGroup.disable': '停用',
  'svgrid.colGroup.allow': '允许',
  'svgrid.colGroup.disallow': '禁止',
  'svgrid.validate.required': '不能为空',
  'svgrid.validate.repeat': '重复',
  'svgrid.toolbar.search': '输入关键字搜索 ......'
}

const locale = {
  'menu.home': '主页',
  'menu.dashboard': '仪表盘',
  'navBar.lang': '选择语言',
  'navBar.usageManual': '使用手册',
  SV: '斯达文星',
  login: '登录',
  removed: '已移除',
  added: '已添加',
  addToQN: '添加到快捷导航',
  ...menuNodes,
  ...svGrid,
  ...home,
  ...sys
}

export default {
  ...components,
  ...locale
}
