<!--
 * @Author: yanbuw1911
 * @Date: 2021-01-05 08:55:47
 * @LastEditTime: 2021-01-15 13:58:40
 * @LastEditors: yanbuw1911
 * @Description: 大文件上传
 * @FilePath: \client\src\components\tools\BigFileUpload.vue
-->
<template>
  <div class="tool-big-file-upload" style="background-color: white;">
    <a-upload
      name="file"
      :disabled="container.status !== container.Status.wait"
      :before-upload="beforeUpload"
      @change="handleFileChange"
    >
      <a-button><a-icon type="upload" />大文件上传</a-button>
    </a-upload>
    <div v-if="container.file">
      <a-button @click="handleUpload" :disabled="container.status !== container.Status.wait">
        上传
      </a-button>
      <!-- <a-button @click="handleResume" v-if="container.status === container.Status.pause">恢复</a-button>
      <a-button
        v-else
        :disabled="container.status !== container.Status.uploading || !container.hash"
        @click="handlePause"
      >
        暂停
      </a-button> -->
      <div class="progress-compute">
        <span>
          计算文件 hash：
        </span>
        <a-progress
          :percent="container.hashPercentage"
          :strokeWidth="5"
          :stroke-color="setStrokeColor(container.hashPercentage)"
          :status="setStrokeStatus(container.hashPercentage)"
        />
      </div>
      <div class="progress-compute">
        <span>
          上传总进度：
        </span>
        <a-progress
          :percent="container.fakeUploadPercentage"
          :stroke-color="setStrokeColor(container.fakeUploadPercentage)"
          :strokeWidth="5"
          :status="setStrokeStatus(container.fakeUploadPercentage)"
        />
      </div>
      <a-table
        :columns="columns"
        :dataSource="container.data.slice((page - 1) * 10, page * 10)"
        :pagination="false"
        bordered
      >
        <template slot="size" slot-scope="text, record">
          {{ record.size | transformByte }}
        </template>
        <template slot="percentage" slot-scope="text, record">
          <a-progress
            :percent="record.percentage"
            :status="setStrokeStatus(record.percentage)"
            :stroke-color="setStrokeColor(record.percentage)"
            :strokeWidth="5"
          />
        </template>
      </a-table>
      <a-pagination v-model="page" :total="container.data.length" show-less-items></a-pagination>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    dataIndex: 'hash',
    key: 'hash',
    title: '文件切片 Hash',
    align: 'center',
    width: 310
  },
  {
    dataIndex: 'size',
    key: 'size',
    title: '文件大小（KB）',
    scopedSlots: { customRender: 'size' },
    align: 'center'
  },
  {
    dataIndex: 'percentage',
    key: 'percentage',
    title: '上传进度',
    width: 200,
    scopedSlots: { customRender: 'percentage' },
    align: 'center'
  }
]

const SECTION_SIZE = 10 * 1024 * 1024

const Status = {
  wait: 'wait',
  pause: 'pause',
  uploading: 'uploading'
}

export default {
  filters: {
    transformByte (val) {
      return Number((val / 1024).toFixed(0))
    }
  },
  data () {
    return {
      columns,
      container: {
        stokeColor: {
          '0%': '#aeeeee',
          '100%': '#1099e9'
        },
        Status,
        file: null,
        hash: '',
        worker: null,
        data: [],
        requestList: [],
        fakeUploadPercentage: 0,
        status: Status.wait,
        hashPercentage: 0,
        page: null
      }
    }
  },
  computed: {
    page: {
      get () {
        const unloadedIdx = this.container.data.findIndex(item => item.percentage < 100) + 1
        const page = Math.ceil((unloadedIdx === 0 ? this.container.data.length : unloadedIdx) / 10)

        return !this.container.page ? page : this.container.page
      },
      set (v) {
        this.container.page = v
      }
    },
    uploadPercentage () {
      if (!this.container.file || !this.container.data.length) return 0

      const loaded = this.container.data.map(item => item.size * item.percentage).reduce((acc, cur) => acc + cur)

      return parseInt((loaded / this.container.file.size).toFixed(2))
    }
  },
  watch: {
    uploadPercentage (now) {
      if (now > this.container.fakeUploadPercentage) {
        this.container.fakeUploadPercentage = now
      }
    }
  },
  methods: {
    beforeUpload () {
      return false
    },
    setStrokeColor (percent) {
      return percent < 100 ? this.container.stokeColor : '#52c41a'
    },
    setStrokeStatus (percent) {
      return percent < 100 ? 'active' : 'success'
    },
    handlePause () {
      this.container.status = Status.pause
      this.resetData()
    },
    resetData () {
      this.container.requestList.forEach(xhr => xhr?.abort())
      this.container.requestList = []
      if (this.container.worker) {
        this.container.worker.onmessage = null
      }
    },
    async handleResume () {
      this.container.status = Status.uploading
      const { uploadedList } = await this.verifyUpload(this.container.file.name, this.container.hash)
      await this.uploadChunks(uploadedList)
    },
    // xhr
    request ({ url, method = 'post', data, headers = {}, onProgress = e => e, requestList }) {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = onProgress
        xhr.open(method, url)
        Object.keys(headers).forEach(key => xhr.setRequestHeader(key, headers[key]))
        xhr.send(data)
        xhr.onload = e => {
          // 将请求成功的 xhr 从列表中删除
          if (requestList) {
            const xhrIndex = requestList.findIndex(item => item === xhr)
            requestList.splice(xhrIndex, 1)
          }
          resolve({
            data: e.target.response
          })
        }
        // 暴露当前 xhr 给外部
        // eslint-disable-next-line no-unused-expressions
        requestList?.push(xhr)
      })
    },
    // 生成文件切片
    createFileChunk (file, size = SECTION_SIZE) {
      const fileChunkList = []
      let cur = 0
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) })
        cur += size
      }
      return fileChunkList
    },
    // 生成文件 hash（web-worker）
    calculateHash (fileChunkList) {
      return new Promise(resolve => {
        this.container.worker = new Worker('/hash.js')
        this.container.worker.postMessage({ fileChunkList })
        this.container.worker.onmessage = e => {
          const { percentage, hash } = e.data
          this.container.hashPercentage = parseInt(percentage.toFixed(0))
          if (hash) {
            resolve(hash)
          }
        }
      })
    },
    handleFileChange ({ file }) {
      this.resetData()

      if (file.status === 'removed') {
        this.container.file = null
        return
      }

      this.container.file = file
    },
    async handleUpload () {
      if (!this.container.file) return
      this.container.status = Status.uploading
      const fileChunkList = this.createFileChunk(this.container.file)

      this.container.hash = await this.calculateHash(fileChunkList)

      const { shouldUpload, uploadedList } = await this.verifyUpload(this.container.file.name, this.container.hash)
      if (!shouldUpload) {
        this.$message.success('秒传：上传成功')
        this.container.status = Status.wait
        return
      }

      this.container.data = fileChunkList.map(({ file }, index) => ({
        key: index,
        fileHash: this.container.hash,
        index,
        hash: this.container.hash + ' - ' + (index + 1),
        chunk: file,
        size: file.size,
        percentage: uploadedList.includes(index) ? 100 : 0
      }))

      await this.uploadChunks(uploadedList)
    },
    // 上传切片，同时过滤已上传的切片
    async uploadChunks (uploadedList = []) {
      const requestList = this.container.data
        .filter(({ hash }) => !uploadedList.includes(hash))
        .map(({ chunk, hash, index }) => {
          const formData = new FormData()
          formData.append('chunk', chunk)
          formData.append('hash', hash)
          formData.append('filename', this.container.file.name)
          formData.append('fileHash', this.container.hash)
          return { formData, index }
        })
        .map(async ({ formData, index }) =>
          this.request({
            url: process.env.VUE_APP_BIGFILE_UPLOAD_URL,
            data: formData,
            onProgress: this.createProgressHandler(this.container.data[index]),
            requestList: this.container.requestList
          })
        )
      await Promise.all(requestList)
      // 之前上传的切片数量 + 本次上传的切片数量 = 所有切片数量时
      // 合并切片
      if (uploadedList.length + requestList.length === this.container.data.length) {
        await this.mergeRequest()
      }
    },
    // 通知服务端合并切片
    async mergeRequest () {
      this.container.status = Status.wait

      await this.request({
        url: process.env.VUE_APP_BIGFILE_UPLOAD_URL + '/merge',
        headers: {
          'content-type': 'application/json'
        },
        data: JSON.stringify({
          size: SECTION_SIZE,
          fileHash: this.container.hash,
          filename: this.container.file.name
        })
      })

      this.$message.success('上传成功')
    },
    // 根据 hash 验证文件是否曾经已经被上传过
    // 没有才进行上传
    async verifyUpload (filename, fileHash) {
      const { data } = await this.request({
        url: process.env.VUE_APP_BIGFILE_UPLOAD_URL + '/verify',
        headers: {
          'content-type': 'application/json'
        },
        data: JSON.stringify({
          filename,
          fileHash
        })
      })
      return JSON.parse(data)
    },
    // 用闭包保存每个 chunk 的进度数据
    createProgressHandler (item) {
      return e => {
        item.percentage = parseInt(String((e.loaded / e.total) * 100))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.progress-compute {
  display: flex;

  > :not(span) {
    width: 84%;
    margin-left: auto;
  }
  span {
    font-weight: bolder;
    white-space: nowrap;
  }
}
</style>
