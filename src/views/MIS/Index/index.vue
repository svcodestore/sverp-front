<!--
 * @Author: yanbuw1911
 * @Date: 2021-02-05 08:52:49
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-03-03 14:41:18
 * @Description:
 * @FilePath: /sverp-front/src/views/MIS/Index/index.vue
-->
<template>
  <div class="container">
    <a-space>
      <a-button @click="sysUpdate" :loading="loadingSys">更新系统</a-button>
      <a-button @click="restartWeb" :loading="loadingWeb">重启 Web 服务</a-button>
      <a-button @click="restartNode" :loading="loadingNode">重启 Node 服务</a-button>
      <a-button @click="startNode" :loading="loadingN1">开启 Node 服务</a-button>
      <a-button @click="stopNode" :loading="loadingN2">停止 Node 服务</a-button>
    </a-space>
    <a-divider>响应日志</a-divider>
    <div class="serv-log"></div>
  </div>
</template>

<script>
import axios from 'axios'
import { startNodeWeb, stopNodeWeb, restartNodeWeb } from '@/api/mis'

export default {
  data: () => ({
    loadingSys: false,
    loadingWeb: false,
    loadingNode: false,
    loadingN1: false,
    loadingN2: false,
    scrollEl: null
  }),
  methods: {
    getSpentTime (start) {
      return (new Date().getTime() - start) / 1000
    },
    scrollToTop () {
      this.$nextTick(() => {
        this.scrollEl.scrollTop = this.scrollEl.scrollHeight
      })
    },
    async sysUpdate () {
      const start = new Date().getTime()
      this.loadingSys = true

      await axios.post('http://192.168.123.51:3030/update').then(res => {
        this.scrollEl.innerHTML += res.data
      })
      this.scrollEl.innerHTML += `<br>Spent: ${this.getSpentTime(start)}s<br><br>`
      this.scrollToTop()
      this.loadingSys = false
    },
    async restartWeb () {
      const start = new Date().getTime()
      this.loadingWeb = true
      await axios.post('http://192.168.123.51:3030/nginx/stop').then(res => {
        this.scrollEl.innerHTML += res.data
      })
      await axios.post('http://192.168.123.51:3030/nginx/start').then(res => {
        this.scrollEl.innerHTML += '<br>' + res.data
      })
      this.scrollEl.innerHTML += `<br>Spent: ${this.getSpentTime(start)}s<br><br>`
      this.scrollToTop()
      this.loadingWeb = false
    },
    async restartNode () {
      const start = new Date().getTime()
      this.loadingNode = true
      await restartNodeWeb().then(res => {
        this.scrollEl.innerHTML += res.data
      })
      this.scrollEl.innerHTML += `<br>Spent: ${this.getSpentTime(start)}s<br><br>`
      this.scrollToTop()
      this.loadingNode = false
    },
    async startNode () {
      const start = new Date().getTime()
      this.loadingN1 = true
      await startNodeWeb().then(res => {
        this.scrollEl.innerHTML += res.data
      })
      this.scrollEl.innerHTML += `<br>Spent: ${this.getSpentTime(start)}s<br><br>`
      this.scrollToTop()
      this.loadingN1 = false
    },
    async stopNode () {
      const start = new Date().getTime()
      this.loadingN2 = true
      await stopNodeWeb().then(res => {
        this.scrollEl.innerHTML += res.data
      })
      this.scrollEl.innerHTML += `<br>Spent: ${this.getSpentTime(start)}s<br><br>`
      this.scrollToTop()
      this.loadingN2 = false
    }
  },
  mounted () {
    this.scrollEl = document.querySelector('.serv-log')
  }
}
</script>

<style lang="less" scoped>
.container {
  max-width: 100vw;
  min-width: 600px;

  .serv-log {
    height: 500px;
    min-height: 300px;
    overflow: auto;
  }
}
</style>
