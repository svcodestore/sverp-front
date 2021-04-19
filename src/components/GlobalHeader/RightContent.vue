<!--
 * @Author: yanbuw1911
 * @Date: 2020-10-27 17:02:14
 * @LastEditTime: 2020-12-09 16:39:09
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\components\GlobalHeader\RightContent.vue
-->
<template>
  <div :class="wrpCls">
    <manual></manual>
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
    <select-lang :class="prefixCls" />
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'
import storage from 'store'
import { LOGIN_USER } from '@/store/mutation-types'
import Manual from './Manual.vue'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    SelectLang,
    Manual
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showMenu: true,
      currentUser: {}
    }
  },
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${this.isMobile || !this.topMenu ? 'light' : this.theme}`]: true
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.currentUser = {
        name: this.$store.state.user.name || storage.get(LOGIN_USER)
      }
    }, 300)
  }
}
</script>
