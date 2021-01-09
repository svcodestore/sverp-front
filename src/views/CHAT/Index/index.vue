<!--
 * @Date: 2020-12-30 15:09:50
 * @LastEditors: yu chen
 * @LastEditTime: 2021-01-04 16:48:02
 * @FilePath: \webapp\src\views\CHAT\INDEX\index.vue
-->
<template>
  <div>
    <div>
      <vxe-button @click="connect()">连接</vxe-button>
      <vxe-input type="text"></vxe-input>
      <vxe-button>say</vxe-button>
    </div>
  </div>
</template>
<script>
var ws
function connect () {
  ws = new WebSocket('ws://www.sverp.com:7272')
  ws.onopen = function () {
    const msg = '{"type":"say","msg":"hello"}'
    ws.send(msg)
  }
  ws.onmessage = function (e) {
    console.log(e.data)
    var data = JSON.parse(e.data)
    switch (data['type']) {
      case 'ping':
        ws.send('{"type":"pong"}')
        break
      case 'login':
        console.log('登录成功')
        break
      case 'say':
        console.log(e)
        break
      case 'logout':
        console.log('logout')
    }
  }
  ws.onclose = function () {
    console.log('连接关闭，定时重连')
    connect()
  }
  ws.onerror = function () {
    console.log('出现错误')
  }
}
export default {
  data () {},
  methods: {
    connect () {
      console.log('success')
    }
  },
  created () {
    connect()
  }
}
</script>
