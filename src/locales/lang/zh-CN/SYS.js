/*
 * @Author: yanbuw1911
 * @Date: 2020-12-21 16:43:44
 * @LastEditTime: 2020-12-22 08:47:11
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\locales\lang\zh-CN\SYS.js
 */
const menuManagement = {
  'sys.menuManagement.col.node': '节点',
  'sys.menuManagement.col.pnode': '父节点',
  'sys.menuManagement.col.seq': '排序',
  'sys.menuManagement.col.path': '路径',
  'sys.menuManagement.col.redrt': '重定向',
  'sys.menuManagement.col.comp': '组件',
  'sys.menuManagement.col.icon': '图标'
}

const userManagement = {
  'sys.userManagement.validate.idRequired': '请输入账号',
  'sys.userManagement.validate.idPattern': '4-16位字母数字',
  'sys.userManagement.validate.pwdRequired': '密码不能为空',
  'sys.userManagement.validate.nameRepeat': '重复用户名',
  'sys.userManagement.col.usrid': '用户标识',
  'sys.userManagement.col.staffnum': '工号',
  'sys.userManagement.col.allowDel': '允许删除',
  'sys.userManagement.col.title': '职位',
  'sys.userManagement.col.boss': '上司',
  'sys.userManagement.col.loginTime': '登录时间',
  'sys.userManagement.col.loginIP': '登录IP'
}

export default {
  ...menuManagement,
  ...userManagement
}
