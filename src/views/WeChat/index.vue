<template>
  <div>
    <a-card title="微信信息推送设置">
      <a-row>
        <a-col :span="12" class="left-info" v-show="!userInfo.wx_uid">
          <h2>扫码绑定消息推送服务</h2>
          <img :src="qrcodeUrl" alt="动态二维码，过时无效" />
          <p>请扫描二维码，并关注“新消息服务”</p>
        </a-col>
        <a-col :span="12" class="right-info" v-show="userInfo.wx_uid">
          <h2>绑定信息</h2>
          <ul>
            <li>系统用户名： {{ conId }}</li>
            <li>微信名: {{ userInfo.wx_username }}</li>
            <li>
              <img :src="userInfo.head_img" alt="微信头像" />
            </li>
          </ul>
        </a-col>
      </a-row>
    </a-card>
    <a-card title="绑定流程">
      <p>微信扫描二维码</p>
      <p>点击"关注"即可</p>
      <p><img src="./howto.jpg" alt="点击关注" /></p>
    </a-card>
  </div>
</template>

<script>
import wechat from '@/api/wechat'
export default {
  data () {
    return {
      conId: null,
      userInfo: {
        wx_username: '',
        head_img: '',
        wx_uid: ''
      },
      qrcodeUrl: '',
      intervalId: null
    }
  },
  methods: {
    freshQrcode () {
      if (this.intervalId) {
        clearInterval(this.intervalId)
      }
      wechat.subscribeQRCode(this.conId).then(res => {
        this.qrcodeUrl = res.url
        // 监测扫码, 内网服务器无法获取事件推送，主动获取外站中转的扫码信息
        this.intervalId = setInterval(() => {
          this.checkScan()
        }, 5000)
      })
    },
    checkScan () {
      wechat.checkScan(this.conId).then(res => {
        if (res) {
          clearInterval(this.intervalId)
          this.getUserInfo()
        }
      })
    },
    getUserInfo () {
      wechat.getUserInfo(this.conId).then(res => {
        if (res == null) {
          this.freshQrcode()
        } else {
          this.userInfo = res
        }
      })
    }
  },
  created () {
    this.conId = this.$store.getters.userInfo.con_id
    this.getUserInfo()
  },
  destroyed () {
    clearInterval(this.intervalId)
  }
}
</script>

<style scoped>
.right-info li {
  line-height: 200%;
}
</style>
