/*
 * @Date: 2021-01-13 17:05:11
 * @LastEditors: yu chen
 * @LastEditTime: 2021-02-04 14:59:33
 * @FilePath: \sverp-front\src\api\chat.js
 */
import request from '@/utils/request'
import { stringify } from 'qs'
const chatApi = {
  apiChat: '/Chat/apiChat',
  apiChatRecord: '/Chat/apiChatRecord',
  apiUnreadCount: '/Chat/apiUnreadCount'
}
export function apiSendMsg (param) {
  return request({
    url: chatApi.apiChat,
    method: 'post',
    data: stringify(param)
  })
}
export function apiChatRecord (param) {
  return request({
    url: chatApi.apiChatRecord,
    method: 'post',
    data: stringify(param)
  })
}
export function apiUnreadCount (param) {
  return request({
    url: chatApi.apiUnreadCount,
    method: 'post',
    data: stringify(param)
  })
}
export function replaceStr (str) {
  return str
    .replace(/【左撇嘴】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img0.png" class="sizeImg" alt="">')
    .replace(/【右撇嘴】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img1.png" class="sizeImg" alt="">')
    .replace(/【奸笑】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img2.png" class="sizeImg" alt="">')
    .replace(/【想哭】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img3.png" class="sizeImg" alt="">')
    .replace(/【口罩】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img4.png" class="sizeImg" alt="">')
    .replace(/【含蓄】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img5.png" class="sizeImg" alt="">')
    .replace(/【惊恐】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img6.png" class="sizeImg" alt="">')
    .replace(
      /【老年人的目光】/g,
      '<img src="http://192.168.123.51:8088/static/emoticons/img7.png" class="sizeImg" alt="">'
    )
    .replace(/【酷】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img8.png" class="sizeImg" alt="">')
    .replace(/【委屈】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img9.png" class="sizeImg" alt="">')
    .replace(/【笑哭】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img12.png" class="sizeImg" alt="">')
    .replace(/【不错】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img13.png" class="sizeImg" alt="">')
    .replace(/【耶】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img14.png" class="sizeImg" alt="">')
    .replace(/【尴尬】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img15.png" class="sizeImg" alt="">')
    .replace(/【狂躁】/, '<img src="http://192.168.123.51:8088/static/emoticons/img16.png" class="sizeImg" alt="">')
    .replace(/【哎】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img17.png" class="sizeImg" alt="">')
    .replace(/【抱拳】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img18.png" class="sizeImg" alt="">')
    .replace(/【流汗】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img19.png" class="sizeImg" alt="">')
    .replace(/【哭笑】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img22.png" class="sizeImg" alt="">')
    .replace(/【嗯嗯】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img23.png" class="sizeImg" alt="">')
    .replace(/【小鸡】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img24.png" class="sizeImg" alt="">')
    .replace(/【微笑】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img25.png" class="sizeImg" alt="">')
    .replace(/【气愤】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img26.png" class="sizeImg" alt="">')
    .replace(/【恶心】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img27.png" class="sizeImg" alt="">')
    .replace(/【大笑】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img28.png" class="sizeImg" alt="">')
    .replace(/【狗】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img29.png" class="sizeImg" alt="">')
    .replace(/【抠鼻】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img30.png" class="sizeImg" alt="">')
    .replace(/【哈哈】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img33.png" class="sizeImg" alt="">')
    .replace(/【调皮】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img34.png" class="sizeImg" alt="">')
    .replace(/【嘻嘻】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img35.png" class="sizeImg" alt="">')
    .replace(/【惊讶】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img36.png" class="sizeImg" alt="">')
    .replace(/【难过】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img37.png" class="sizeImg" alt="">')
    .replace(/【色】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img38.png" class="sizeImg" alt="">')
    .replace(/【绿帽】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img39.png" class="sizeImg" alt="">')
    .replace(/【疑问】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img40.png" class="sizeImg" alt="">')
    .replace(/【鼓掌】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img41.png" class="sizeImg" alt="">')
    .replace(/【娇羞】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img42.png" class="sizeImg" alt="">')
    .replace(/【闭嘴】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img43.png" class="sizeImg" alt="">')
    .replace(/【哼】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img44.png" class="sizeImg" alt="">')
    .replace(/【睡觉】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img45.png" class="sizeImg" alt="">')
    .replace(/【偷笑】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img46.png" class="sizeImg" alt="">')
    .replace(/【可爱】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img47.png" class="sizeImg" alt="">')
    .replace(/【白眼】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img48.png" class="sizeImg" alt="">')
    .replace(/【傲慢】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img49.png" class="sizeImg" alt="">')
    .replace(/【困】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img50.png" class="sizeImg" alt="">')
    .replace(/【鼻涕】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img51.png" class="sizeImg" alt="">')
    .replace(/【ok】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img52.png" class="sizeImg" alt="">')
    .replace(/【嘿嘿】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img53.png" class="sizeImg" alt="">')
    .replace(/【难过】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img56.png" class="sizeImg" alt="">')
    .replace(/【奋斗】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img57.png" class="sizeImg" alt="">')
    .replace(/【大骂】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img58.png" class="sizeImg" alt="">')
    .replace(/【吃瓜】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img59.png" class="sizeImg" alt="">')
    .replace(/【努力】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img60.png" class="sizeImg" alt="">')
    .replace(/【汗】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img61.png" class="sizeImg" alt="">')
    .replace(/【大惊】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img62.png" class="sizeImg" alt="">')
    .replace(/【打脸】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img63.png" class="sizeImg" alt="">')
    .replace(/【握手】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img66.png" class="sizeImg" alt="">')
    .replace(/【皮】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img67.png" class="sizeImg" alt="">')
    .replace(/【哇塞】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img68.png" class="sizeImg" alt="">')
    .replace(/【嘘声】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img69.png" class="sizeImg" alt="">')
    .replace(/【晕】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img70.png" class="sizeImg" alt="">')
    .replace(/【黑】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img71.png" class="sizeImg" alt="">')
    .replace(/【骷髅】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img72.png" class="sizeImg" alt="">')
    .replace(/【打】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img73.png" class="sizeImg" alt="">')
    .replace(/【拜拜】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img74.png" class="sizeImg" alt="">')
    .replace(/【炫耀】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img75.png" class="sizeImg" alt="">')
    .replace(/【猪】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img76.png" class="sizeImg" alt="">')
    .replace(/【剪刀】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img77.png" class="sizeImg" alt="">')
    .replace(/【疯了吧】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img78.png" class="sizeImg" alt="">')
    .replace(/【困】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img79.png" class="sizeImg" alt="">')
    .replace(/【鄙视】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img80.png" class="sizeImg" alt="">')
    .replace(/【委屈屈】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img81.png" class="sizeImg" alt="">')
    .replace(/【呜呜】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img82.png" class="sizeImg" alt="">')
    .replace(/【想哭】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img83.png" class="sizeImg" alt="">')
    .replace(/【阴险】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img84.png" class="sizeImg" alt="">')
    .replace(/【亲亲】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img85.png" class="sizeImg" alt="">')
    .replace(/【可怜】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img86.png" class="sizeImg" alt="">')
    .replace(/【玫瑰】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img87.png" class="sizeImg" alt="">')
    .replace(/【告辞】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img88.png" class="sizeImg" alt="">')
    .replace(/【惊呆】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img89.png" class="sizeImg" alt="">')
    .replace(/【凋谢】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img90.png" class="sizeImg" alt="">')
    .replace(/【红唇】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img91.png" class="sizeImg" alt="">')
    .replace(/【红心】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img92.png" class="sizeImg" alt="">')
    .replace(/【心碎】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img93.png" class="sizeImg" alt="">')
    .replace(/【蛋糕】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img94.png" class="sizeImg" alt="">')
    .replace(/【炸弹】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img96.png" class="sizeImg" alt="">')
    .replace(/【便便】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img97.png" class="sizeImg" alt="">')
    .replace(/【夜晚】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img98.png" class="sizeImg" alt="">')
    .replace(/【勾引】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img99.png" class="sizeImg" alt="">')
    .replace(/【祭拜】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img100.png" class="sizeImg" alt="">')
    .replace(/【抱拳】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img101.png" class="sizeImg" alt="">')
    .replace(/【okey】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img102.png" class="sizeImg" alt="">')
    .replace(/【菜刀】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img103.png" class="sizeImg" alt="">')
    .replace(/【太阳】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img104.png" class="sizeImg" alt="">')
    .replace(/【滑】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img105.png" class="sizeImg" alt="">')
    .replace(/【发抖】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img107.png" class="sizeImg" alt="">')
    .replace(/【抱抱】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img108.png" class="sizeImg" alt="">')
    .replace(/【怄火】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img109.png" class="sizeImg" alt="">')
    .replace(/【开心】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img110.png" class="sizeImg" alt="">')
    .replace(/【西瓜】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img111.png" class="sizeImg" alt="">')
    .replace(/【礼物】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img112.png" class="sizeImg" alt="">')
    .replace(/【庆祝】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img113.png" class="sizeImg" alt="">')
    .replace(/【鬼】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img114.png" class="sizeImg" alt="">')
    .replace(/【红包】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img115.png" class="sizeImg" alt="">')
    .replace(/【肌肉】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img116.png" class="sizeImg" alt="">')
    .replace(/【啤酒】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img117.png" class="sizeImg" alt="">')
    .replace(/【赞】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img118.png" class="sizeImg" alt="">')
    .replace(/【菜】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img119.png" class="sizeImg" alt="">')
    .replace(/【咖啡】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img120.png" class="sizeImg" alt="">')
    .replace(/【米饭】/g, '<img src="http://192.168.123.51:8088/static/emoticons/img121.png" class="sizeImg" alt="">')
}
