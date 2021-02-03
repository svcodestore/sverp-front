<!--
 * @Date: 2020-12-30 15:09:50
 * @LastEditors: yu chen
 * @LastEditTime: 2021-02-03 10:49:08
 * @FilePath: \sverp-front\src\views\CHAT\Index\index.vue
-->
<template>
  <div>
    <div class="box-chat">
      <div class="box-left"></div>
      <ul class="box-content" id="userList" style="line-style:none">
        <li @click="userName(item.name)" v-for="(item, index) in this.$store.state.userLists" :key="index">
          <div class="box-content-left">
            <img style="width:100%" :src="item.imgUrl" alt="" />
          </div>
          <div class="box-content-right">
            <p class="box-content-content-left">{{ item.name }}</p>
            <p class="box-content-content-right">
              {{ item.desc }}
            </p>
          </div>
        </li>
      </ul>
      <div class="box-right">
        <div class="box-right-header" :v-model="name">{{ name }}</div>
        <div class="box-right-center">
          <ul id="ul"></ul>
        </div>
        <div class="box-right-footer">
          <div class="box-right-footer-fast">
            <img src="../../../assets/bq.png" @click="emoticons" />
            <img src="../../../assets/wj.png" @click="upload" />
            <img src="../../../assets/jd.png" @click="crop" />
            <img src="../../../assets/qp.png" @click="chatRecord" />
          </div>
          <textarea v-model="list" class="box-right-footer-center"></textarea>
          <button @click="sendMsg" class="box-right-footer-footer">发送</button>
        </div>
      </div>
      <div v-show="emoticonShow" class="emoticonsClass">
        <ul style="line-style:none">
          <li @click="emoji(index)" v-for="(item, index) in imgUrls" :key="index"><img :src="item.name" alt="" /></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { apiSendMsg, apiChatRecord, replaceStr } from '@/api/chat'
export default {
  data () {
    return {
      userImg: '',
      imgUrls: [
        { name: 'http://192.168.123.51:8088/static/emoticons/img0.png', value: '【左撇嘴】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img1.png', value: '【右撇嘴】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img2.png', value: '【奸笑】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img3.png', value: '【想哭】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img4.png', value: '【口罩】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img5.png', value: '【含蓄】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img6.png', value: '【惊恐】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img7.png', value: '【老年人的目光】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img8.png', value: '【酷】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img9.png', value: '【委屈】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img12.png', value: '【笑哭】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img13.png', value: '【不错】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img14.png', value: '【耶】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img15.png', value: '【尴尬】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img16.png', value: '【狂躁】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img17.png', value: '【哎】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img18.png', value: '【抱拳】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img19.png', value: '【流汗】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img22.png', value: '【哭笑】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img23.png', value: '【嗯嗯】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img24.png', value: '【小鸡】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img25.png', value: '【微笑】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img26.png', value: '【气愤】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img27.png', value: '【恶心】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img28.png', value: '【大笑】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img29.png', value: '【狗】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img30.png', value: '【抠鼻】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img33.png', value: '【哈哈】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img34.png', value: '【调皮】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img35.png', value: '【嘻嘻】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img36.png', value: '【惊讶】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img37.png', value: '【难过】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img38.png', value: '【色】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img39.png', value: '【绿帽】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img40.png', value: '【疑问】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img41.png', value: '【鼓掌】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img42.png', value: '【娇羞】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img43.png', value: '【闭嘴】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img44.png', value: '【哼】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img45.png', value: '【睡觉】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img46.png', value: '【偷笑】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img47.png', value: '【可爱】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img48.png', value: '【白眼】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img49.png', value: '【傲慢】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img50.png', value: '【困】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img51.png', value: '【鼻涕】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img52.png', value: '【ok】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img53.png', value: '【嘿嘿】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img56.png', value: '【难过】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img57.png', value: '【奋斗】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img58.png', value: '【大骂】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img59.png', value: '【吃瓜】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img60.png', value: '【努力】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img61.png', value: '【汗】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img62.png', value: '【大惊】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img63.png', value: '【打脸】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img66.png', value: '【握手】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img67.png', value: '【皮】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img68.png', value: '【哇塞】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img69.png', value: '【嘘声】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img70.png', value: '【晕】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img71.png', value: '【黑】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img72.png', value: '【骷髅】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img73.png', value: '【打】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img74.png', value: '【拜拜】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img75.png', value: '【炫耀】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img76.png', value: '【猪】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img77.png', value: '【剪刀】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img78.png', value: '【疯了吧】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img79.png', value: '【困】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img80.png', value: '【鄙视】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img81.png', value: '【委屈屈】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img82.png', value: '【呜呜】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img83.png', value: '【想哭】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img84.png', value: '【阴险】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img85.png', value: '【亲亲】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img86.png', value: '【可怜】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img87.png', value: '【玫瑰】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img88.png', value: '【告辞】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img89.png', value: '【惊呆】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img90.png', value: '【凋谢】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img91.png', value: '【红唇】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img92.png', value: '【红心】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img93.png', value: '【心碎】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img94.png', value: '【蛋糕】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img96.png', value: '【炸弹】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img97.png', value: '【便便】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img98.png', value: '【夜晚】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img99.png', value: '【勾引】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img100.png', value: '【祭拜】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img101.png', value: '【抱拳】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img102.png', value: '【okey】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img103.png', value: '【菜刀】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img104.png', value: '【太阳】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img105.png', value: '【滑】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img107.png', value: '【发抖】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img108.png', value: '【抱抱】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img109.png', value: '【怄火】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img110.png', value: '【开心】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img111.png', value: '【西瓜】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img112.png', value: '【礼物】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img113.png', value: '【庆祝】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img114.png', value: '【鬼】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img115.png', value: '【红包】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img116.png', value: '【肌肉】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img117.png', value: '【啤酒】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img118.png', value: '【赞】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img119.png', value: '【菜】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img120.png', value: '【咖啡】' },
        { name: 'http://192.168.123.51:8088/static/emoticons/img121.png', value: '【米饭】' }
      ],
      emoticonShow: false,
      name: '',
      list: null,
      uid: null,
      to_uid: null,
      group_id: null,
      to_group_id: null,
      type: 'all',
      record: false,
      clickUser: [],
      user: [
        {
          show: false,
          sayMsg: null,
          header: null,
          toName: null,
          content: null,
          sent: null
        }
      ]
    }
  },
  methods: {
    ejiom () {},
    userCount () {
      setInterval(function () {
        const li = document.getElementById('ul')
        if (localStorage.getItem('responMsg') !== null) {
          this.sayMsg = localStorage.getItem('responMsg')
          this.sayMsg = replaceStr(this.sayMsg)
          li.innerHTML +=
            '<li class="box-say-left"><div class="box-img"><img  src="http://5b0988e595225.cdn.sohucs.com/images/20190324/26b14ff8956b4661a456a7e6751ce085.jpeg"  style="width:100%"  alt="" /></div><div class="say-left">' +
            this.sayMsg +
            '</div></li>'
          localStorage.removeItem('responMsg')
        }
      }, 1000)
    },
    async userName (index) {
      this.to_uid = index.replace('"', '').replace('"', '')
      this.name = this.to_uid
      this.type = 'say'
      const uid = localStorage
        .getItem('userid')
        .replace('"', '')
        .replace('"', '')
      var seft = this
      const toUid = seft.name
      await apiChatRecord({ uid, toUid }).then(result => {
        seft.clickUser.push(seft.name)
        if (result.result) {
          const li = document.getElementById('ul')
          if (li.childNodes.length !== 0) {
            li.innerHTML = ''
          }
          result.result.forEach(function (value, index) {
            const data = JSON.parse(value)
            data.content = replaceStr(data.content)
            // 发送者是自己
            if (uid === data.uid) {
              li.innerHTML +=
                '<li class="box-say-right"><div class="box-img"><img src="http://5b0988e595225.cdn.sohucs.com/images/20190324/26b14ff8956b4661a456a7e6751ce085.jpeg" style="width:100%" alt=""/></div><div class="say-right">' +
                data.content +
                '</div></li>'
            } else {
              li.innerHTML +=
                '<li class="box-say-left"><div class="box-img"><img  src="http://5b0988e595225.cdn.sohucs.com/images/20190324/26b14ff8956b4661a456a7e6751ce085.jpeg"  style="width:100%"  alt="" /></div><div class="say-left">' +
                data.content +
                '</div></li>'
            }
          })
        }
      })
    },
    async sendMsg () {
      const content = this.list
      this.list = replaceStr(this.list)
      const li = document.getElementById('ul')
      const headerUrl = localStorage.getItem('headerImg')
      const clientName = localStorage
        .getItem('userid')
        .replace('"', '')
        .replace('"', '')
      const id = localStorage.getItem('id')
      let param = {}
      if (content !== null && clientName !== null && id !== null) {
        if (this.type === 'say') {
          if (this.to_uid !== null) {
            param = { to_uid: this.name, content: content, type: this.type, uid: clientName }
          } else {
            param = { to_group_id: this.to_group_id, content: content, type: this.type, uid: clientName }
          }
        } else {
          param = { content: content, type: this.type, uid: clientName }
        }
        li.innerHTML +=
          '<li class="box-say-right"><div class="box-img"><img src=' +
          headerUrl +
          ' style="width:100%" alt=""/></div><div class="say-right">' +
          this.list +
          '</div></li>'
        // console.log(param)
        await apiSendMsg(param)
          .then(result => {
            if (result.code === 0) {
              this.list = ''
              console.log('success')
            } else {
              console.log('error')
            }
          })
          .catch(() => {})
      } else {
        console.log('非法请求')
      }
    },
    emoticons () {
      this.emoticonShow = !this.emoticonShow
    },
    upload () {
      console.log('upload')
    },
    crop () {
      console.log('crop')
    },
    chatRecord () {
      console.log('chatRecord')
    },
    emoji (index) {
      this.emoticonShow = false
      switch (index) {
        case 0:
          this.list != null ? (this.list += '【左撇嘴】') : (this.list = '【左撇嘴】')
          break
        case 1:
          this.list != null ? (this.list += '【右撇嘴】') : (this.list = '【右撇嘴】')
          break
        case 2:
          this.list != null ? (this.list += '【奸笑】') : (this.list = '【奸笑】')
          break
        case 3:
          this.list != null ? (this.list += '【想哭】') : (this.list = '【想哭】')
          break
        case 4:
          this.list != null ? (this.list += '【口罩】') : (this.list = '【口罩】')
          break
        case 5:
          this.list != null ? (this.list += '【含蓄】') : (this.list = '【含蓄】')
          break
        case 6:
          this.list != null ? (this.list += '【惊恐】') : (this.list = '【惊恐】')
          break
        case 7:
          this.list != null ? (this.list += '【老年人的目光】') : (this.list = '【老年人的目光】')
          break
        case 8:
          this.list != null ? (this.list += '【酷】') : (this.list = '【酷】')
          break
        case 9:
          this.list != null ? (this.list += '【委屈】') : (this.list = '【委屈】')
          break
        case 10:
          this.list != null ? (this.list += '【笑哭】') : (this.list = '【笑哭】')
          break
        case 11:
          this.list != null ? (this.list += '【不错】') : (this.list = '【不错】')
          break
        case 12:
          this.list != null ? (this.list += '【耶】') : (this.list = '【耶】')
          break
        case 13:
          this.list != null ? (this.list += '【尴尬】') : (this.list = '【尴尬】')
          break
        case 14:
          this.list != null ? (this.list += '【狂躁】') : (this.list = '【狂躁】')
          break
        case 15:
          this.list != null ? (this.list += '【哎】') : (this.list = '【哎】')
          break
        case 16:
          this.list != null ? (this.list += '【抱拳】') : (this.list = '【抱拳】')
          break
        case 17:
          this.list != null ? (this.list += '【流汗】') : (this.list = '【流汗】')
          break
        case 18:
          this.list != null ? (this.list += '【哭笑】') : (this.list = '【哭笑】')
          break
        case 19:
          this.list != null ? (this.list += '【嗯嗯】') : (this.list = '【嗯嗯】')
          break
        case 20:
          this.list != null ? (this.list += '【小鸡】') : (this.list = '【小鸡】')
          break
        case 21:
          this.list != null ? (this.list += '【微笑】') : (this.list = '【微笑】')
          break
        case 22:
          this.list != null ? (this.list += '【气愤】') : (this.list = '【气愤】')
          break
        case 23:
          this.list != null ? (this.list += '【恶心】') : (this.list = '【恶心】')
          break
        case 24:
          this.list != null ? (this.list += '【大笑】') : (this.list = '【大笑】')
          break
        case 25:
          this.list != null ? (this.list += '【狗】') : (this.list = '【狗】')
          break
        case 26:
          this.list != null ? (this.list += '【抠鼻】') : (this.list = '【抠鼻】')
          break
        case 27:
          this.list != null ? (this.list += '【哈哈】') : (this.list = '【哈哈】')
          break
        case 28:
          this.list != null ? (this.list += '【调皮】') : (this.list = '【调皮】')
          break
        case 29:
          this.list != null ? (this.list += '【嘻嘻】') : (this.list = '【嘻嘻】')
          break
        case 30:
          this.list != null ? (this.list += '【惊讶】') : (this.list = '【惊讶】')
          break
        case 31:
          this.list != null ? (this.list += '【难过】') : (this.list = '【难过】')
          break
        case 32:
          this.list != null ? (this.list += '【色】') : (this.list = '【色】')
          break
        case 33:
          this.list != null ? (this.list += '【绿帽】') : (this.list = '【绿帽】')
          break
        case 34:
          this.list != null ? (this.list += '【疑问】') : (this.list = '【疑问】')
          break
        case 35:
          this.list != null ? (this.list += '【鼓掌】') : (this.list = '【鼓掌】')
          break
        case 36:
          this.list != null ? (this.list += '【娇羞】') : (this.list = '【娇羞】')
          break
        case 37:
          this.list != null ? (this.list += '【闭嘴】') : (this.list = '【闭嘴】')
          break
        case 38:
          this.list != null ? (this.list += '【哼】') : (this.list = '【哼】')
          break
        case 39:
          this.list != null ? (this.list += '【睡觉】') : (this.list = '【睡觉】')
          break
        case 40:
          this.list != null ? (this.list += '【偷笑】') : (this.list = '【偷笑】')
          break
        case 41:
          this.list != null ? (this.list += '【可爱】') : (this.list = '【可爱】')
          break
        case 42:
          this.list != null ? (this.list += '【白眼】') : (this.list = '【白眼】')
          break
        case 43:
          this.list != null ? (this.list += '【傲慢】') : (this.list = '【傲慢】')
          break
        case 44:
          this.list != null ? (this.list += '【困】') : (this.list = '【困】')
          break
        case 45:
          this.list != null ? (this.list += '【鼻涕】') : (this.list = '【鼻涕】')
          break
        case 46:
          this.list != null ? (this.list += '【ok】') : (this.list = '【ok】')
          break
        case 47:
          this.list != null ? (this.list += '【嘿嘿】') : (this.list = '【嘿嘿】')
          break
        case 48:
          this.list != null ? (this.list += '【难过】') : (this.list = '【难过】')
          break
        case 49:
          this.list != null ? (this.list += '【奋斗】') : (this.list = '【奋斗】')
          break
        case 50:
          this.list != null ? (this.list += '【大骂】') : (this.list = '【大骂】')
          break
        case 51:
          this.list != null ? (this.list += '【吃瓜】') : (this.list = '【吃瓜】')
          break
        case 52:
          this.list != null ? (this.list += '【努力】') : (this.list = '【努力】')
          break
        case 53:
          this.list != null ? (this.list += '【汗】') : (this.list = '【汗】')
          break
        case 54:
          this.list != null ? (this.list += '【大惊】') : (this.list = '【大惊】')
          break
        case 55:
          this.list != null ? (this.list += '【打脸】') : (this.list = '【打脸】')
          break
        case 56:
          this.list != null ? (this.list += '【握手】') : (this.list = '【握手】')
          break
        case 57:
          this.list != null ? (this.list += '【皮】') : (this.list = '【皮】')
          break
        case 58:
          this.list != null ? (this.list += '【哇塞】') : (this.list = '【哇塞】')
          break
        case 59:
          this.list != null ? (this.list += '【嘘声】') : (this.list = '【嘘声】')
          break
        case 60:
          this.list != null ? (this.list += '【晕】') : (this.list = '【晕】')
          break
        case 61:
          this.list != null ? (this.list += '【黑】') : (this.list = '【黑】')
          break
        case 62:
          this.list != null ? (this.list += '【骷髅】') : (this.list = '【骷髅】')
          break
        case 63:
          this.list != null ? (this.list += '【打】') : (this.list = '【打】')
          break
        case 64:
          this.list != null ? (this.list += '【拜拜】') : (this.list = '【拜拜】')
          break
        case 65:
          this.list != null ? (this.list += '【炫耀】') : (this.list = '【炫耀】')
          break
        case 66:
          this.list != null ? (this.list += '【猪】') : (this.list = '【猪】')
          break
        case 67:
          this.list != null ? (this.list += '【剪刀】') : (this.list = '【剪刀】')
          break
        case 68:
          this.list != null ? (this.list += '【困】') : (this.list = '【困】')
          break
        case 69:
          this.list != null ? (this.list += '【困】') : (this.list = '【难过】')
          break
        case 70:
          this.list != null ? (this.list += '【鄙视】') : (this.list = '【鄙视】')
          break
        case 71:
          this.list != null ? (this.list += '【委屈屈】') : (this.list = '【委屈屈】')
          break
        case 72:
          this.list != null ? (this.list += '【呜呜】') : (this.list = '【呜呜】')
          break
        case 73:
          this.list != null ? (this.list += '【想哭】') : (this.list = '【想哭】')
          break
        case 74:
          this.list != null ? (this.list += '【阴险】') : (this.list = '【阴险】')
          break
        case 75:
          this.list != null ? (this.list += '【亲亲】') : (this.list = '【亲亲】')
          break
        case 76:
          this.list != null ? (this.list += '【可怜】') : (this.list = '【可怜】')
          break
        case 77:
          this.list != null ? (this.list += '【玫瑰】') : (this.list = '【玫瑰】')
          break
        case 78:
          this.list != null ? (this.list += '【告辞】') : (this.list = '【告辞】')
          break
        case 79:
          this.list != null ? (this.list += '【惊呆】') : (this.list = '【惊呆】')
          break
        case 80:
          this.list != null ? (this.list += '【凋谢】') : (this.list = '【凋谢】')
          break
        case 81:
          this.list != null ? (this.list += '【红唇】') : (this.list = '【红唇】')
          break
        case 82:
          this.list != null ? (this.list += '【红心】') : (this.list = '【红心】')
          break
        case 83:
          this.list != null ? (this.list += '【心碎】') : (this.list = '【心碎】')
          break
        case 84:
          this.list != null ? (this.list += '【蛋糕】') : (this.list = '【蛋糕】')
          break
        case 85:
          this.list != null ? (this.list += '【炸弹】') : (this.list = '【炸弹】')
          break
        case 86:
          this.list != null ? (this.list += '【便便】') : (this.list = '【便便】')
          break
        case 87:
          this.list != null ? (this.list += '【夜晚】') : (this.list = '【夜晚】')
          break
        case 88:
          this.list != null ? (this.list += '【勾引】') : (this.list = '【勾引】')
          break
        case 89:
          this.list != null ? (this.list += '【祭拜】') : (this.list = '【祭拜】')
          break
        case 90:
          this.list != null ? (this.list += '【抱拳】') : (this.list = '【抱拳】')
          break
        case 91:
          this.list != null ? (this.list += '【okey】') : (this.list = '【okey】')
          break
        case 92:
          this.list != null ? (this.list += '【菜刀】') : (this.list = '【菜刀】')
          break
        case 93:
          this.list != null ? (this.list += '【太阳】') : (this.list = '【太阳】')
          break
        case 94:
          this.list != null ? (this.list += '【滑】') : (this.list = '【滑】')
          break
        case 95:
          this.list != null ? (this.list += '【发抖】') : (this.list = '【发抖】')
          break
        case 96:
          this.list != null ? (this.list += '【抱抱】') : (this.list = '【抱抱】')
          break
        case 97:
          this.list != null ? (this.list += '【怄火】') : (this.list = '【怄火】')
          break
        case 98:
          this.list != null ? (this.list += '【开心】') : (this.list = '【开心】')
          break
        case 99:
          this.list != null ? (this.list += '【西瓜】') : (this.list = '【西瓜】')
          break
        case 100:
          this.list != null ? (this.list += '【礼物】') : (this.list = '【礼物】')
          break
        case 101:
          this.list != null ? (this.list += '【庆祝】') : (this.list = '【庆祝】')
          break
        case 102:
          this.list != null ? (this.list += '【鬼】') : (this.list = '【鬼】')
          break
        case 103:
          this.list != null ? (this.list += '【红包】') : (this.list = '【红包】')
          break
        case 104:
          this.list != null ? (this.list += '【肌肉】') : (this.list = '【肌肉】')
          break
        case 105:
          this.list != null ? (this.list += '【啤酒】') : (this.list = '【啤酒】')
          break
        case 106:
          this.list != null ? (this.list += '【赞】') : (this.list = '【赞】')
          break
        case 107:
          this.list != null ? (this.list += '【菜】') : (this.list = '【菜】')
          break
        case 108:
          this.list != null ? (this.list += '【咖啡】') : (this.list = '【咖啡】')
          break
        case 109:
          this.list != null ? (this.list += '【米饭】') : (this.list = '【米饭】')
          break
        default:
          break
      }
    }
  },
  created () {
    this.userCount()
  },
  updated () {
    this.$nextTick(() => {
      // setTimeout(() => {
      document.querySelector('.box-right-center').scrollTop = document.querySelector('.box-right-center').scrollHeight
      // }, 13)
    })
  },
  mounted () {
    document.addEventListener('keydown', e => {
      if (e.keyCode === 13 && !e.ctrlKey) {
        this.sendMsg()
      }
      if (e.keyCode === 13 && e.ctrlKey) {
        this.list = this.list + '\n'
      }
    })
  }
}
</script>
<style>
.box-chat {
  display: flex;
  width: 100%;
  height: 600px;
  background: white;
  flex-direction: row;
}
.box-left {
  flex: 0.3;
  background: rgb(44, 44, 47);
}
.box-content {
  flex: 1;
  background: rgb(203, 210, 206);
  margin: 0px;
  padding: 0px;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
.box-content li {
  padding: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  cursor: pointer;
}
.box-content :hover {
  background: white;
}
.box-content-left {
  padding: 10px 5px;
  flex: 1;
}
.box-content-left img {
  border-radius: 11%;
}
.box-content-right {
  padding: 5px;
  flex: 3;
}
.box-content-content-left {
  font-weight: bold;
  padding: 0px;
  margin: 0px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.box-content-content-right {
  font-size: 12px;
  padding: 0px;
  margin: 0px;
  color: #1890ff;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.box-right {
  flex: 3;
  background: white;
  display: flex;
  flex-direction: column;
}
.box-right-header {
  background: white;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 0.7;
  color: black;
  font-size: 18px;
  text-align: center;
  font-weight: bold;
  line-height: 50px;
  border-bottom: 1px solid #d6c8c8;
  padding: 10px;
}
.box-right-center {
  flex: 6;
  overflow-y: scroll;
  overflow-x: hidden;
  border-bottom: 1px solid #d6c8c8;
  padding: 10px;
  background: white;
}
.box-right-center ul {
  margin: 0px;
  padding: 0px;
  list-style: none;
}
.box-right-center ul li {
  width: 100%;
  display: block;
  clear: both;
  position: relative;
  padding: 10px 0;
}
.box-say-left {
  width: 100%;
  min-height: 30px;
}
.box-say-right {
  width: 100%;
  min-height: 30px;
}
.box-img {
  width: 30px;
}
.box-img img {
  border-radius: 5px;
}
.say-left {
  min-height: 30px;
  background: rgb(203, 210, 206);
  padding: 5px;
  border-radius: 7px;
  margin: 0 10px;
  z-index: 1;
  max-width: 40%;
  word-break: break-all;
  word-wrap: break-word;
  line-height: 24px;
}
.say-left::before {
  content: '';
  width: 0;
  height: 0;
  border: 7px solid transparent;
  border-right-color: rgb(203, 210, 206);
  position: absolute;
  left: 27px;
  top: 24px;
}

.say-right {
  padding: 5px;
  min-height: 30px;
  background: rgb(158, 236, 106);
  border-radius: 7px;
  margin: 0 10px;
  max-width: 40%;
  word-break: break-all;
  word-wrap: break-word;
  line-height: 24px;
}
.box-say-left div {
  float: left;
}
.box-say-right div {
  float: right;
}
.box-right-footer {
  flex: 3;
  padding: 10px;
  background: white;
}

.box-right-footer-fast {
  height: 43px;
  width: 100%;
}
.box-right-footer-center {
  width: 100%;
  height: 90px;
  margin: 0px;
  padding: 10px;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
.box-right-footer-footer {
  background: #1890ff;
  border: none;
  border-radius: 5px;
  float: right;
  color: white;
  cursor: pointer;
  width: 63px;
  height: 30px;
}
.box-right-footer-fast img {
  padding: 5px;
  width: 40px;
  float: left;
  display: block;
  cursor: pointer;
}
.emoticonsClass {
  width: 40%;
  height: 43%;
  border: 1px solid rgb(60, 110, 247);
  position: absolute;
  top: 200px;
  left: 229px;
  overflow-y: scroll;
  overflow-x: hidden;
  background: white;
}
.emoticonsClass ul {
  margin: 0px;
  padding: 0px;
}
.emoticonsClass ul li {
  float: left;
  width: 40px;
  height: 40px;
  display: block;
  cursor: pointer;
}
.emoticonsClass ul li img {
  width: 100%;
  height: 100%;
  border: 1px solid rgb(60, 110, 247);
}
.sizeImg {
  width: 30px;
  height: 30px;
}
</style>
