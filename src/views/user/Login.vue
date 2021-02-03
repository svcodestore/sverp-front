<template>
  <div class="main">
    <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
      <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" :message="loginErrorMsg" />
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="账户:"
          v-decorator="[
            'username',
            {
              rules: [
                { required: true, message: '请输入ID' },
                { min: 4, max: 16, message: '请输入4-16位ID' }
              ],
              validateTrigger: ['change', 'blur']
            }
          ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input-password
          size="large"
          placeholder="密码:"
          v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur' }]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input-password>
      </a-form-item>

      <!-- <a-form-item>
        <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">自动登录</a-checkbox>
        <router-link
          :to="{ name: 'recover', params: { user: 'aaa'} }"
          class="forge-password"
          style="float: right;"
        >忘记密码</router-link>
      </a-form-item> -->

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >
          确定
        </a-button>
      </a-form-item>

      <!-- <div class="user-login-other">
        <span>其他登录方式</span>
        <a>
          <a-icon class="item-icon" type="wechat"></a-icon>
        </a>
        <router-link class="register" :to="{ name: 'register' }">注册账户</router-link>
      </div> -->
    </a-form>
  </div>
</template>

<script>
import md5 from 'md5'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { apiSendMsg } from '@/api/chat'
var webSocket = new WebSocket('ws://192.168.123.51:7272')
heartBeat()
function heartBeat () {
  setInterval(function () {
    webSocket.send("{ 'type': 'pong' }")
  }, 5000)
}
export default {
  data () {
    return {
      webSocket: null,
      isLoginError: false,
      loginErrorMsg: '请求出现错误，请稍后再试',
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        smsSendBtn: false
      }
    }
  },
  methods: {
    ...mapActions(['Login', 'Logout', 'GenerateRoutes']),
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = ['username', 'password']

      validateFields(validateFieldsKey, { force: true }, async (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          loginParams.password = md5(values.password)
          await Login(loginParams)
            .then(res => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    async loginSuccess (data) {
      const name = localStorage
        .getItem('userid')
        .replace('"', '')
        .replace('"', '')
      const clientId = localStorage.getItem('client_id')
      if (data.userMenus) {
        await this.GenerateRoutes(data.userinfo.id)
          .then(routes => {
            this.$router.addRoutes(routes)
            this.$router.push({ path: '/' })
          })
          .catch(() => {})
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
        setTimeout(() => {
          this.$notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`,
            duration: 2
          })
        }, 700)
      } else {
        this.$notification.info({ message: '暂无菜单节点', description: '请联系管理员' })
      }
      this.isLoginError = false
    },
    requestFailed (err) {
      this.isLoginError = true

      // 已由axios封装处理
      if ((err !== false && err.response === void 0) || (err.response || {}).status === 500) return

      this.$notification['error']({
        message: (err.response || {}).status || '错误',
        description:
          (err === false && (this.loginErrorMsg = '账号密码错误')) ||
          // ((err.response || {}).data || {}).message ||
          (err.response || {}).statusText ||
          this.loginErrorMsg,
        duration: 2
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
          if (localStorage.getItem('userid').replace('"', '').replace('"', '') === data.client_name) {
            localStorage.setItem('headerimgUrl', data.imgUrl)
          }
          break
        case 'say':
          if (data.content) {
            // this.$store.state.responMsg = data.content
            localStorage.setItem('responMsg', data.uid + '：' + data.content)
            localStorage.setItem('to_headerImg', data.to_headerImg)
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
  created () {
    document.title = `${this.$t('login')} - ${this.$t('SV')}`
    this.initWebSocket(webSocket)
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
