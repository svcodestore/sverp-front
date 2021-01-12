/*
 * @Author: yanbuw1911
 * @Date: 2020-12-09 09:56:28
 * @LastEditTime: 2021-01-12 13:11:13
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\locales\lang\en-US\index.js
 */
import antdEnUS from 'ant-design-vue/es/locale-provider/en_US'
import momentEU from 'moment/locale/eu'

import sys from './SYS'
import home from './home'

const components = {
  antLocale: antdEnUS,
  momentName: 'eu',
  momentLocale: momentEU
}

const menuNodes = {
  MIS: 'Management Information System',
  FIN: 'Finance Department',
  BS: 'Business Segment Department',
  TPM: 'Total Productive Maintenance',
  'R&D': 'Research and Development Department',
  PD: 'Purchase Department',
  PMD: 'Property Management Department',
  PROD: 'Production Department',
  HRD: 'Human Resources Department',
  AD: 'Adminstrator Department',
  MIS_IDX: 'Home',
  FIN_IDX: 'Home',
  BS_IDX: 'Home',
  TPM_IDX: 'Machine List',
  'R&D_IDX': 'Home',
  PD_IDX: 'Home',
  PMD_IDX: 'Home',
  PROD_IDX: 'Home',
  HRD_IDX: 'Home',
  AD_IDX: 'Home',
  SYS: 'System Management',
  SYS_IDX: 'Home',
  SYS_MENU_MANAGE: 'Menu Management',
  SYS_USR_MANAGE: 'User Management',
  HOME: 'Home',
  DASHBOARD: 'DASHBOARD',
  DASHBOARD_SOFT_REQUIRE: 'Software Requirement',
  DASHBOARD_TEST: 'Playground',
  TPM_RECORDS: 'Records of Repair',
  TPM_NOTICE: 'Notifications of Repair',
  PROD_AUTOSCHD: 'Auto Schedule',
  SYS_PRVG: 'Privilege Management',
  TPM_NOTIFIER: 'Notifier',
  HRD_MATERIAL_MANAGE: 'Material Management',
  PERSONAL_CENTER: 'Personal Center',
  PERSONAL_SETTING: 'Personal Setting',
  'svgrid.toolbar.search': 'input a keyword to search'
}

const svGrid = {
  refresh: 'refresh',
  undo: 'undo',
  add: 'add',
  del: 'delete',
  save: 'save',
  gridOptConfirmText: 'Are you sure to save the modification?',
  confirm: 'Yes',
  cancel: 'Cancel',
  record: ' records',
  zoom: 'zoom',
  saveSucc: 'Saved successfully.',
  saveFail: 'Save failed.',
  dataFmtErr: 'The data format is not as expected.',
  displayedCol: 'displayed columns',
  'svgrid.col.name': 'Name',
  'svgrid.col.alias': 'Alias',
  'svgrid.col.pwd': 'Password',
  'svgrid.col.dept': 'Dept',
  'svgrid.col.group': 'Group',
  'svgrid.col.email': 'Email',
  'svgrid.col.mobile': 'Mobile',
  'svgrid.col.lang': 'Language',
  'svgrid.col.status': 'Status',
  'svgrid.col.creator': 'Creator',
  'svgrid.col.modifier': 'Modifier',
  'svgrid.col.joinDate': 'Created Time',
  'svgrid.col.modDate': 'Modified Time',
  'svgrid.colGroup.yes': 'Yes',
  'svgrid.colGroup.no': 'No',
  'svgrid.colGroup.enable': 'Enable',
  'svgrid.colGroup.disable': 'Disable',
  'svgrid.colGroup.allow': 'Allow',
  'svgrid.colGroup.disallow': 'Disallow',
  'svgrid.validate.required': 'Required',
  'svgrid.validate.repeat': 'Repeat'
}

const locale = {
  message: '-',
  'menu.home': 'Home',
  'menu.dashboard': 'Dashboard',
  'menu.dashboard.analysis': 'Analysis',
  'menu.dashboard.monitor': 'Monitor',
  'menu.dashboard.workplace': 'Workplace',

  'layouts.usermenu.dialog.title': 'Message',
  'layouts.usermenu.dialog.content': 'Do you really log-out.',

  'app.setting.pagestyle': 'Page style setting',
  'app.setting.pagestyle.light': 'Light style',
  'app.setting.pagestyle.dark': 'Dark style',
  'app.setting.pagestyle.realdark': 'RealDark style',
  'app.setting.themecolor': 'Theme Color',
  'app.setting.navigationmode': 'Navigation Mode',
  'app.setting.content-width': 'Content Width',
  'app.setting.fixedheader': 'Fixed Header',
  'app.setting.fixedsidebar': 'Fixed Sidebar',
  'app.setting.sidemenu': 'Side Menu Layout',
  'app.setting.topmenu': 'Top Menu Layout',
  'app.setting.content-width.fixed': 'Fixed',
  'app.setting.content-width.fluid': 'Fluid',
  'app.setting.othersettings': 'Other Settings',
  'app.setting.weakmode': 'Weak Mode',
  'app.setting.copy': 'Copy Setting',
  'app.setting.loading': 'Loading theme',
  'app.setting.copyinfo': 'copy success，please replace defaultSettings in src/models/setting.js',
  'app.setting.production.hint': 'Setting panel shows in development environment only, please manually modify',
  'navBar.lang': 'Choose Language',
  'navBar.usageManual': 'Manual',
  SV: 'Star Vincci',
  login: 'Login',
  removed: 'Removed',
  added: 'Added',
  addToQN: 'Add to quick navigation',
  ...menuNodes,
  ...svGrid,
  ...home,
  ...sys
}

export default {
  ...components,
  ...locale
}
