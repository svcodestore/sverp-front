/*
 * @Author: yanbuw1911
 * @Date: 2020-12-22 07:39:06
 * @LastEditTime: 2020-12-22 08:59:22
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\locales\lang\en-US\SYS.js
 */
const menuManagement = {
  'sys.menuManagement.col.node': 'Node',
  'sys.menuManagement.col.pnode': 'Pnode',
  'sys.menuManagement.col.name': 'Name',
  'sys.menuManagement.col.alias': 'Alias',
  'sys.menuManagement.col.seq': 'Seq',
  'sys.menuManagement.col.path': 'Path',
  'sys.menuManagement.col.redrt': 'Redirect',
  'sys.menuManagement.col.comp': 'Component',
  'sys.menuManagement.col.icon': 'Icon',
  'sys.menuManagement.col.stat': 'Status'
}

const userManagement = {
  'sys.userManagement.validate.idRequired': 'Required',
  'sys.userManagement.validate.idPattern': '4-16 numbers or letters',
  'sys.userManagement.validate.pwdRequired': 'Required',
  'sys.userManagement.validate.nameRepeat': 'Name repeated',
  'sys.userManagement.col.usrid': 'User ID',
  'sys.userManagement.col.staffnum': 'Staff No.',
  'sys.userManagement.col.allowDel': 'Allow Delete',
  'sys.userManagement.col.title': 'Title',
  'sys.userManagement.col.boss': 'Boss',
  'sys.userManagement.col.loginTime': 'Logon Time',
  'sys.userManagement.col.loginIP': 'Logon IP'
}

export default {
  ...menuManagement,
  ...userManagement
}
