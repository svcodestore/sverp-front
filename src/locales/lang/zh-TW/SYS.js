/*
 * @Author: yanbuw1911
 * @Date: 2020-12-21 16:43:44
 * @LastEditTime: 2020-12-22 08:52:55
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\locales\lang\zh-TW\SYS.js
 */
const menuManagement = {
  'sys.menuManagement.col.node': '節點',
  'sys.menuManagement.col.pnode': '父節點',
  'sys.menuManagement.col.seq': '排序',
  'sys.menuManagement.col.path': '路徑',
  'sys.menuManagement.col.redrt': '重定向',
  'sys.menuManagement.col.comp': '組件',
  'sys.menuManagement.col.icon': '圖標'
}

const userManagement = {
  'sys.userManagement.validate.idRequired': '請輸入賬號',
  'sys.userManagement.validate.idPattern': '4-16位字母數字',
  'sys.userManagement.validate.pwdRequired': '密碼不能為空',
  'sys.userManagement.validate.nameRepeat': '重複用戶名',
  'sys.userManagement.col.usrid': '用戶標識',
  'sys.userManagement.col.staffnum': '工號',
  'sys.userManagement.col.allowDel': '允許刪除',
  'sys.userManagement.col.title': '職位',
  'sys.userManagement.col.boss': '上司',
  'sys.userManagement.col.loginTime': '登錄時間',
  'sys.userManagement.col.loginIP': '登錄IP'
}

export default {
  ...menuManagement,
  ...userManagement
}
