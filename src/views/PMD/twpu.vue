<!--
 * @Date: 2021-04-30 14:22:54
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-04-30 14:27:20
 * @FilePath: \sverp-front\src\views\PMD\twpu.vue
-->
<template>
  <div>
    <view-board :companys="companys"></view-board>
  </div>
</template>
<script>
import viewboard from '../PD/viewboard'
export default {
  components: {
    'view-board': viewboard
  },
  data () {
    return {
      companys: [
        { value: 'A022', name: '杰仕通' }
      ]
    }
  }
}
</script>
