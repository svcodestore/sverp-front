<!--
 * @Author: yanbuw1911
 * @Date: 2020-12-31 13:36:59
 * @LastEditTime: 2021-01-05 09:00:45
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\views\MIS\Tools\index.vue
-->
<template>
  <div class="tools-container">
    <div class="tool-img2-base64">
      <a-upload name="file" accept="jpg,png" :before-upload="beforeUpload" :showUploadList="false">
        <a-button>图片转Base64</a-button>
      </a-upload>
      <a-button
        v-if="showImgBase64"
        style="margin: 0 5px 5px 5px;"
        type="primary"
        shape="circle"
        @click="showImgBase64 = false"
      >
        <a-icon type="close" />
      </a-button>
      <a-textarea
        v-if="showImgBase64"
        v-model="imgBase64"
        placeholder="Controlled autosize"
        :auto-size="{ minRows: 3, maxRows: 30 }"
      />
    </div>
    <div class="tool-big-file-upload">
      <big-file-upload></big-file-upload>
    </div>
  </div>
</template>

<script>
import BigFileUpload from '@/components/tools/BigFileUpload'

function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

// eslint-disable-next-line no-unused-vars
function transformFile (file) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const canvas = document.createElement('canvas')
      const img = document.createElement('img')
      img.src = reader.result
      img.onload = () => {
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        ctx.fillStyle = 'red'
        ctx.textBaseline = 'middle'
        ctx.fillText('Ant Design', 20, 20)
        canvas.toBlob(resolve)
      }
    }
  })
}

export default {
  data () {
    return {
      imgBase64: null,
      showImgBase64: false
    }
  },
  methods: {
    beforeUpload (file) {
      !this.showImgBase64 && (this.showImgBase64 = true)

      getBase64(file).then(res => (this.imgBase64 = res))
      // transformFile(file).then(res => getBase64(res).then(res => console.log(res)))

      return false
    }
  },
  components: {
    BigFileUpload
  }
}
</script>

<style lang="less" scoped>
.tools-container {
  display: flex;
}
</style>
