<!--
 * @Date: 2021-05-11 16:24:02
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-06-28 08:22:40
 * @FilePath: /sverp-front/src/views/Dcs/showPdf.vue
-->
<template>
  <div class="pdf">
    <div style="width: 800px; margin: 0 auto">
      <div class="pdf-tab">
        <el-button @click.stop="prePage">上一页</el-button>
        <el-button @click.stop="nextPage">下一页</el-button>
        <!-- <el-button @click.stop="clock">顺时针</el-button>
                <el-button @click.stop="counterClock">逆时针</el-button> -->
        <!-- <el-button @click.stop="pdfPrintAll">全部打印</el-button>
                <el-button @click.stop="pdfPrint">部分打印</el-button>   -->
      </div>
      <div>{{ pageNum }}/{{ pageTotalNum }}</div>
      <div>进度：{{ loadedRatio }}</div>
      <div>页面加载成功: {{ curPageNum }}</div>
    </div>
    <div style="width: 800px; margin: 0 auto">
      <pdf
        ref="pdf"
        :src="pdfUrl"
        :page="pageNum"
        :rotate="pageRotate"
        @password="password"
        @progress="loadedRatio = $event"
        @page-loaded="pageLoaded($event)"
        @num-pages="pageTotalNum = $event"
        @error="pdfError($event)"
        @link-clicked="page = $event"
      >
      </pdf>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
// import storage from 'store'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  name: 'Pdf',
  props: {
    fileId: {
      default: null,
      type: Number
    },
    pdfUrl: {
      default: '',
      type: [String, Object]
    }
  },
  components: {
    pdf
  },
  data () {
    return {
      file: null,
      pageNum: 1,
      pageTotalNum: 1,
      pageRotate: 0,
      loadedRatio: 0,
      curPageNum: 0
    }
  },
  created () {
    this.userInfo = this.$store.getters.userInfo
  },
  methods: {
    prePage () {
      var p = this.pageNum
      p = p > 1 ? p - 1 : this.pageTotalNum
      this.pageNum = p
    },
    nextPage () {
      var p = this.pageNum
      p = p < this.pageTotalNum ? p + 1 : 1
      this.pageNum = p
    },
    clock () {
      this.pageRotate += 90
    },
    counterClock () {
      this.pageRotate -= 90
    },
    password (updatePassword, reason) {
      updatePassword(prompt('password is "123456"'))
    },
    pageLoaded (e) {
      this.curPageNum = e
    },
    pdfError (error) {
      if (error) {
        this.$message({
          message: '预览失败',
          type: 'error'
        })
      }
    },
    pdfPrintAll () {
      this.$refs.pdf.print()
    },
    pdfPrint () {
      this.$refs.pdf.print(100, [1, 2])
    }
  }
  // computed: {
  //   pdfUrl () {
  //     console.log(123)
  //     if (this.file === null) {
  //       return ''
  //     }
  //     // 通过下载文件的接口 pdf文件数据
  //     const baseUrl = process.env.VUE_APP_API_BASE_URL
  //     const url = baseUrl + '/dcs/downloadFile?fileId=' + this.fileId + '&userId=' + this.userInfo.id

  //     const headers = {
  //       'Access-Token': storage.get(ACCESS_TOKEN)
  //     }
  //     return pdf.createLoadingTask({
  //       url: url,
  //       httpHeaders: headers
  //     })
  //   }
  // }
}
</script>
