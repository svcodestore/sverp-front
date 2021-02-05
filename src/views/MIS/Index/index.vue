<!--
 * @Author: yanbuw1911
 * @Date: 2021-02-05 08:52:49
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-02-05 08:55:28
 * @Description:
 * @FilePath: /sverp-front/src/views/MIS/Index/index.vue
-->
<template>
  <div>
    <a-button @click="sysUpdate">更新系统</a-button>
  </div>
</template>

<script>
import { sysUpdate } from '@/api/mis'

export default {
  methods: {
    async sysUpdate () {
      await sysUpdate().then(res => {
        console.log(res)
      })
    }
  }
}
</script>
