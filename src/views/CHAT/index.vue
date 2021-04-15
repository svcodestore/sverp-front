<!--
 * @Date: 2020-12-30 15:04:17
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-03-30 16:26:47
 * @FilePath: /sverp-front/src/views/CHAT/index.vue
-->
<template>
  <div>
    <a-tabs defaultActiveKey="1">
      <a-tab-pane key="1" tab="聊天">
        <chat-index></chat-index>
      </a-tab-pane>
      <a-tab-pane key="2" tab="群聊">
        <group-chat></group-chat>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import chat from './Index/'
import GroupChat from './GroupChat/'
import { apiSendMsg, apiUnreadCount } from '@/api/chat'

if (!localStorage.getItem('Access-Token')) {
  var webSocket = new WebSocket('ws://192.168.123.51:7272')
  heartBeat()
}
function heartBeat () {
  setInterval(function () {
    webSocket.send("{ 'type': 'pong' }")
  }, 5000)
}

export default {
  data () {
    return {
      webSocket: null
    }
  },
  components: {
    'chat-index': chat,
    'group-chat': GroupChat
  },
  methods: {
    async unreadCount (uid) {
      await apiUnreadCount({ uid }).then(result => {
        if (result.code === 0) {
          console.log(result.result)
        }
      })
    },
    initWebSocket (e) {
      this.webSocket = e
      this.webSocket.onopen = this.websocketonopen
      this.webSocket.onmessage = this.websocketonmessage
      this.webSocket.onerror = this.websocketonerror
      this.webSocket.onclose = this.websocketclose
    },
    websocketonmessage (e) {
      const data = JSON.parse(e.data)
      switch (data.type) {
        case 'ping':
          console.log(data.type)
          break
        case 'init':
          localStorage.setItem('client_id', data.client_id)
          break
        case 'login':
          this.$store.state.userLists = data.uidAll
          this.$store.state.userCounts = data.uidCount
          if (localStorage.getItem('userid')) {
            const userid = localStorage
              .getItem('userid')
              .replace('"', '')
              .replace('"', '')
            if (userid === data.client_name) {
              localStorage.setItem('headerimgUrl', data.imgUrl)
            }
          }
          break
        case 'say':
          this.$store.state.unReadCount += 1
          if (data.content) {
            localStorage.setItem('responMsg', data.uid + '：' + data.content)
            // localStorage.setItem('to_uid', data.uid)
            // localStorage.setItem('to_headerImg', data.to_headerImg)
            if (localStorage.getItem('temMsg')) {
              this.msg = JSON.parse(localStorage.getItem('temMsg'))
              this.msg.push({ name: data.uid, msg: data.content, img: data.to_headerImg })
              localStorage.setItem('temMsg', JSON.stringify(this.msg))
            } else {
              this.msg = []
              this.msg.push({ name: data.uid, msg: data.content, img: data.to_headerImg })
              localStorage.setItem(
                'temMsg',
                JSON.stringify([{ name: data.uid, msg: data.content, img: data.to_headerImg }])
              )
            }
          }
          break
        case 'all':
          if (data.content) {
            localStorage.setItem('responMsg', data.uid + '对所有人说：' + data.content)
          }
          break
        case 'logout':
          this.$store.state.userLists = data.uidAll
          this.$store.state.userCounts = data.uidCount
          break
      }
    },
    websocketonopen () {
      console.log('连接成功')
    },
    websocketonerror () {
      console.log('WebSocketError')
    },
    websocketclose () {
      console.log('连接已关闭...')
    }
  },
  async created () {
    this.initWebSocket(webSocket)
    const name = localStorage
      .getItem('userid')
      .replace('"', '')
      .replace('"', '')
    const clientId = localStorage.getItem('client_id')
    if (name && clientId) {
      await apiSendMsg({ type: 'init', client_id: clientId, client_name: name })
        .then(res => {
          if (res.code === 0) {
            console.log('checkLogin success')
          } else {
            console.log('checkLogin error')
          }
        })
        .catch(() => {})
    }
  }
}
</script>
