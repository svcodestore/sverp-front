<!--
 * @Author: yanbuw1911
 * @Date: 2020-12-09 16:35:33
 * @LastEditTime: 2021-01-12 13:21:31
 * @LastEditors: yanbuw1911
 * @Description: 系统手册
 * @FilePath: \client\src\components\GlobalHeader\Manual.vue
-->
<template>
  <a-badge :dot="show">
    <a :href="manUrl" target="_blank" :title="$t('navBar.usageManual')">
      <a-icon type="book" />
    </a>
  </a-badge>
</template>

<script>
export default {
  data () {
    return {
      show: true
    }
  },
  computed: {
    manUrl () {
      return process.env.VUE_APP_MANUAL_USAGE_URL
    }
  }
}
</script>

<style lang="less" scoped>
a {
  color: #000;
}

a:active {
  color: rgb(0, 102, 255);
}
</style>
