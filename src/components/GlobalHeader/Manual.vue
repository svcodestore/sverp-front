<!--
 * @Author: yanbuw1911
 * @Date: 2020-12-09 16:35:33
 * @LastEditTime: 2020-12-10 07:48:52
 * @LastEditors: yanbuw1911
 * @Description: 系统手册
 * @FilePath: \client\src\components\GlobalHeader\Manual.vue
-->
<template>
  <a-badge :dot="show">
    <a href="http://192.168.123.51:8600/docs/manual" target="_blank" title="手册">
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
