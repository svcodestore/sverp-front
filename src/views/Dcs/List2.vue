<!--
 * @Date: 2021-05-14 09:29:43
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-05-14 09:34:49
 * @FilePath: \sverp-front\src\views\Dcs\List1.vue
-->
<template>
  <doc-list :dirId="dirId"></doc-list>
</template>

<script>
import docList from './DocList'
export default {
  components: {
    'doc-list': docList
  },
  data () {
    return {
      dirId: 2
    }
  }
}
</script>
