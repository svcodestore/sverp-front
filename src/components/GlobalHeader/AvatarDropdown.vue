<!--
 * @Author: yanbuw1911
 * @Date: 2020-10-27 17:02:14
 * @LastEditTime: 2021-01-26 10:44:35
 * @LastEditors: yu chen
 * @Description:
 * @FilePath: \sverp-front\src\components\GlobalHeader\AvatarDropdown.vue
-->
<template>
  <a-dropdown v-if="currentUser && currentUser.name" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <a-avatar
        size="small"
        src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
        class="antd-pro-global-header-index-avatar"
      />
      <span>{{ currentUser.name }}</span>
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <a-menu-item v-if="menu" key="center" @click="handleToCenter">
          <a-icon type="user" />
          {{ $t('PERSONAL_CENTER') }}
        </a-menu-item>
        <a-menu-item v-if="menu" key="settings" @click="handleToSettings">
          <a-icon type="setting" />
          {{ $t('PERSONAL_SETTING') }}
        </a-menu-item>
        <a-menu-item v-if="menu" key="msgBox">
          <a-icon>
            <svg
              t="1610435291446"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4575"
              width="14"
              height="14"
            >
              <path
                d="M257.987 481.174c0 28.218 22.876 51.094 51.094 51.094s51.094-22.876 51.094-51.094-22.876-51.094-51.094-51.094-51.094 22.876-51.094 51.094zM459.935 481.174c0 28.218 22.876 51.094 51.094 51.094s51.094-22.876 51.094-51.094-22.876-51.094-51.094-51.094-51.094 22.876-51.094 51.094zM661.883 481.174c0 28.218 22.876 51.094 51.094 51.094s51.094-22.876 51.094-51.094-22.876-51.094-51.094-51.094-51.094 22.876-51.094 51.094z"
                p-id="4576"
              ></path>
              <path
                d="M891.502 337.966c-20.995-43.449-50.851-82.527-88.959-115.902-77.551-68.084-180.346-105.465-289.451-105.465-109.227 0-212.021 37.501-289.451 105.465-38.108 33.375-67.963 72.332-88.959 115.902-21.845 45.39-32.89 93.571-32.89 143.209 0 58.254 15.899 116.144 45.875 167.602 26.214 44.905 63.351 85.075 107.892 116.873v120.756c0 10.437 5.583 20.025 14.563 25.244 4.491 2.548 9.588 3.884 14.563 3.884s10.073-1.334 14.563-3.884l127.795-73.789c28.157 5.34 57.162 8.01 86.047 8.01 109.227 0 212.021-37.501 289.451-105.465 38.108-33.375 67.963-72.332 88.959-115.902 21.845-45.39 32.89-93.571 32.89-143.209 0.122-49.759-11.044-97.94-32.89-143.329z m-378.41 449.649c-28.641 0-57.283-3.035-84.955-8.98-7.039-1.456-14.442-0.364-20.631 3.277l-93.693 54.128v-85.682c0-9.83-4.976-18.932-13.107-24.394-89.444-58.619-140.781-147.82-140.781-244.789 0-168.938 158.379-306.32 353.166-306.32 194.666 0 353.166 137.383 353.166 306.32s-158.5 306.442-353.166 306.442z"
                p-id="4577"
              ></path>
            </svg>
          </a-icon>
          {{ $t('home.account.msgBox') }}
        </a-menu-item>
        <a-menu-divider v-if="menu" />
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout" />
          {{ $t('home.account.logout') }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { apiSendMsg } from '@/api/chat'
export default {
  name: 'AvatarDropdown',
  props: {
    currentUser: {
      type: Object,
      default: () => null
    },
    menu: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleToCenter () {
      this.$router.push({ path: '/account/center' })
    },
    handleToSettings () {
      this.$router.push({ path: '/account/settings' })
    },
    handleLogout (e) {
      Modal.confirm({
        title: '登出',
        content: '确定登出系统？',
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          this.loginout()
        },
        onCancel () {}
      })
    },
    async loginout () {
      const clientName = localStorage.getItem('userid')
      const clientId = localStorage.getItem('client_id')
      const type = 'loginout'
      await apiSendMsg({ clientName, clientId, type })
        .then(result => {
          if (result.code === 0) {
            localStorage.removeItem('client_id')
            console.log('sign out')
            return this.$store.dispatch('Logout').then(() => {
              this.$router.push({ name: 'login' })
              location.reload()
            })
          } else {
            console.log('sign out error')
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
