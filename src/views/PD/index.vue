<!--
 * @Date: 2021-04-30 11:04:18
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-04-30 14:15:18
 * @FilePath: \sverp-front\src\views\PD\index.vue
-->
<template>
  <div>
    <view-board></view-board>
  </div>
</template>

<script>
import viewboard from './viewboard'

export default {
  components: {
    'view-board': viewboard
  }
}
</script>
