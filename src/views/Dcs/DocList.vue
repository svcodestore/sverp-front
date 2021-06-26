<!--
 * @Date: 2021-05-05 14:27:24
 * @LastEditors: yanbuw1911
 * @LastEditTime: 2021-06-21 08:18:52
 * @FilePath: /sverp-front/src/views/Dcs/DocList.vue
-->
<template>
  <div class="container">
    <div v-show="showMain">
      <div>
        <el-select v-model="depValue" filterable clearable placeholder="请选择">
          <el-option v-for="item in options" :key="item.id" :label="item.sgd_alias" :value="item.id"> </el-option>
        </el-select>
        <el-button type="primary" @click="selectByDep">查询</el-button>
      </div>
      <div id="upload">
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="uploadPath"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :auto-upload="false"
          :file-list="fileList"
          :limit="1"
          name="file"
          :http-request="fileUpload"
          :headers="headers"
          :disabled="uploadStatus === 1 ? false : true"
        >
          <el-button slot="trigger" size="small" type="primary" @click="choiceFile">选取文件</el-button>
          <el-button style="margin-left: 0.5rem;" size="small" type="success" @click="submitUpload">
            {{ upload }}<i class="el-icon-upload el-icon--right"></i>
          </el-button>
        </el-upload>
      </div>
      <el-divider content-position="left">{{ title }}文件列表</el-divider>
      <div>
        <el-table :data="tableData" style="width: 100%" :header-cell-style="tableHeaderColor">
          <el-table-column type="index" :index="indexMethod" label="No"> </el-table-column>
          <el-table-column prop="isoNo" label="ISO编码"> </el-table-column>
          <el-table-column prop="filesName" label="文件名"> </el-table-column>
          <el-table-column prop="cdate" label="修改时间"> </el-table-column>
          <el-table-column prop="cuser" label="修改人"> </el-table-column>
          <el-table-column prop="versionNo" label="版本号"> </el-table-column>
          <el-table-column prop="department.sgd_alias" label="部门"> </el-table-column>
          <el-table-column label="浏览" id="show">
            <el-table-column label="浏览">
              <template slot-scope="scope">
                <el-button type="primary" @click="docShow(scope.row)">
                  {{ look }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="下载">
              <template slot-scope="scope">
                <el-button type="primary" @click="docDownload(scope.row)">{{ download }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="" label="历史版本">
              <template slot-scope="scope">
                <el-button type="primary" @click="docHistory(scope.row)">历史</el-button>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="异动" id="update">
            认证成功
            <el-table-column label="更新版本">
              <template slot-scope="scope">
                <el-upload
                  class="upload-demo"
                  :file-list="fileUpdateList"
                  :action="updatePath"
                  :headers="headers"
                  name="file"
                  :http-request="updateUpload"
                  :data="{ fileId: scope.row.filesId, departmentId: scope.row.departmentId }"
                  :disabled="updateStatus === 1 ? false : true"
                >
                  <el-button type="primary" @click="docUpdate(scope.row)">{{ update }}</el-button>
                </el-upload>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>

      <div>
        <el-dialog title="无权限操作请先申请" :visible.sync="dialogVisible" width="30%">
          <div>
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item label="申请人">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="申请事项">
                <el-input v-model="form.content" readonly></el-input>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submit">提 交</el-button>
          </span>
        </el-dialog>
        <el-dialog title="填写资料" :visible.sync="uploadDialog" width="30%">
          <div>
            <el-form ref="form" :model="uploadForm" label-width="80px">
              <el-form-item label="上传人">
                <el-input v-model="uploadForm.uploadName"></el-input>
              </el-form-item>
              <el-form-item label="选择部门">
                <el-select v-model="uploadForm.depUploadValue" filterable placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.sgd_alias"
                    :label="item.sgd_alias"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="uploadCancel">取 消</el-button>
            <el-button type="primary" @click="uploadSubmit">提 交</el-button>
          </span>
        </el-dialog>
      </div>
    </div>

    <div v-show="showPdfViewer">
      <div>
        <el-button
          @click="
            showMain = true
            showPdfViewer = false
          "
        >返回文档列表</el-button
        >
      </div>
      <show-pdf :pdfUrl="pdfUrl"></show-pdf>
    </div>

    <div v-show="showHistory">
      <div>
        <el-button
          @click="
            showMain = true
            showHistory = false
          "
        >返回文档列表</el-button
        >
      </div>
      <show-doc-history
        :originalFileId="originalFileId"
        @showDoc="docShow"
        @downloadDoc="docDownload"
      ></show-doc-history>
    </div>
  </div>
</template>

<script>
import dcsApi from '@/api/dcs'
import { getDepartments } from '@/api/user'
import showPdf from './showPdf'
import docHistory from './docHistory'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
// import pdf from 'vue-pdf'
import { hasRole } from '@/utils/permissions'
export default {
  name: '',
  components: {
    'show-pdf': showPdf,
    'show-doc-history': docHistory
  },
  props: {
    dirId: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      uploadForm: {
        uploadName: '',
        depUploadValue: ''
      },
      showMain: true,
      showHistory: false,
      showPdfViewer: false,
      originalFileId: null,
      pdfUrl: '',
      depValue: '', // 选中部门的值
      options: [],
      updateStatus: 0,
      uploadStatus: 0,
      dialogVisible: false,
      uploadDialog: false,
      userData: {},
      isoNo: '',
      title: '',
      docs2: '',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Token': storage.get(ACCESS_TOKEN)
      },
      tableData: [],
      fileList: [],
      fileUpdateList: [],
      path: '',
      uploadPath: '',
      updatePath: '',
      look: '预览',
      upload: '上传文件到服务器',
      download: '下载',
      update: '更新',
      form: {
        name: '',
        content: '',
        fileId: ''
      }
    }
  },
  created () {
    this.look = '预览'
    this.upload = '上传文件到服务器'
    this.download = '下载'
    this.update = '更新'
    this.userData = this.$store.getters.userInfo
    getDepartments({}).then(res => {
      this.options = res
    })
  },
  mounted () {
    this.getdocList()
  },
  methods: {
    // 按部门查询文件
    selectByDep () {
      dcsApi.getFiles({ dirId: this.dirId, depId: this.depValue }).then(res => {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].cdate = this.dateFormat(res.data[i].cdate)
        }
        this.tableData = res.data
      })
    },
    uploadSubmit () {
      if (this.uploadForm.uploadName === '' || this.uploadForm.uploadName === null) {
        this.$message({
          message: '请先填写上传人',
          type: 'warning'
        })
        return true
      }
      if (this.uploadForm.depUploadValue === '' || this.uploadForm.depUploadValue === null) {
        this.$message({
          message: '请选择部门后上传',
          type: 'warning'
        })
        return true
      }
      this.$refs.upload.submit()
    },
    submit () {
      const form = {
        name: this.form.name,
        content: this.form.content,
        userId: this.userData.user.id,
        fileId: this.form.fileId
      }
      if (form.name === '' || form.name === null) {
        this.$message({
          message: '请先填写申请人',
          type: 'warning'
        })
        return true
      }
      dcsApi.addRecord(form).then(res => {
        if (res.code === 0) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
        this.form.name = ''
        this.dialogVisible = false
      })
    },
    cancel () {
      this.form.name = ''
      this.dialogVisible = false
    },
    uploadCancel () {
      this.uploadDialog = false
    },
    updateUpload (param, scope) {
      const formData = new FormData()
      formData.append('file', param.file)
      formData.append('fileId', param.data.fileId)
      formData.append('userName', this.userData.con_name)
      formData.append('dirId', this.dirId)
      formData.append('departmentId', param.data.departmentId)
      formData.append('userId', this.userData.id)
      dcsApi.updateVersion(formData).then(res => {
        this.form.name = ''
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.getdocList()
        this.fileUpdateList = []
      })
    },
    getFileUrl (fileId) {
      // const baseUrl = process.env.VUE_APP_API_BASE_URL
      // const url = baseUrl + '/dcs/downloadFile?fileId=' + fileId + '&userId=' + this.userData.id
      // return pdf.createLoadingTask({
      //   url: url,
      //   httpHeaders: this.headers
      // })
    },
    // 数据库中2.上传 3.下载 4.查看 5.更新
    docShow (row) {
      if (!hasRole(['susys', 'dcs_read'])) {
        this.form.content = '浏览'
        this.dialogVisible = true
        this.form.fileId = row.filesId
      } else {
        const suffix = '.pdf'
        const fileSuffix = row.filesName.substring(row.filesName.lastIndexOf('.'))
        if (suffix === fileSuffix) {
          dcsApi.recordPDFShow({ fileId: row.filesId, userId: this.userData.id }).then(res => {
            this.showMain = false
            this.showPdfViewer = true
            this.showHistory = false
            this.pdfUrl = this.getFileUrl(row.filesId)
          })
        } else {
          this.$message({
            message: '不是pdf文件无法预览',
            type: 'warning'
          })
        }
      }
    },
    docDownload (row) {
      if (!hasRole(['susys', 'dcs_down'])) {
        this.form.content = '下载'
        this.dialogVisible = true
        this.form.fileId = row.filesId
      } else {
        dcsApi.downloadFile({ fileId: row.filesId, userId: this.userData.id }).then(res => {
          this.form.name = ''
          const fileName = row.filesName
          const blob = new Blob([res], {
            type: 'application/octet-stream'
          })
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName)
          } else {
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            document.body.removeChild(elink)
          }
        })
      }
    },
    docUpdate (row) {
      if (!hasRole(['susys', 'dcs_upd'])) {
        this.form.content = '更新'
        this.dialogVisible = true
        this.form.fileId = row.filesId
      } else {
        this.updateStatus = 1
      }
    },
    docHistory (row) {
      const original = row.originalFileId
      if (original === null || original === '') {
        this.$message({
          message: '该文件无历史版本',
          type: 'warning'
        })
      } else {
        sessionStorage.setItem('original', JSON.stringify(row))
        this.originalFileId = row.originalFileId
        this.showMain = false
        this.showPdfViewer = false
        this.showHistory = true
      }
    },
    choiceFile () {
      if (!hasRole(['susys', 'dcs_uplo'])) {
        this.$message({
          message: '无权操作',
          type: 'warning'
        })
        return
      }
      this.uploadStatus = 1
    },
    // 下标增加
    indexMethod (index) {
      return index + 1
    },
    // 自定义上传
    fileUpload (param) {
      const formData = new FormData()
      formData.append('files', param.file)
      formData.append('userName', this.uploadForm.uploadName)
      formData.append('dirId', this.dirId)
      formData.append('departmentId', this.uploadForm.depUploadValue)
      formData.append('userId', this.userData.id)
      console.log(formData)
      dcsApi.uploadFile(formData).then(res => {
        const type = res.code === 0 ? 'success' : 'error'
        this.$message({
          message: res.msg,
          type: type
        })
        this.uploadForm.depUploadValue = ''
        this.uploadForm.uploadName = ''
        this.uploadDialog = false
        this.getdocList()
        this.uploadDialog = false
        this.fileList = []
      })
    },
    // 提交上传
    submitUpload () {
      if (this.$refs.upload._data.uploadFiles.length === 0) {
        this.$message({
          message: '选择文件后上传',
          type: 'warning'
        })
        return true
      }
      this.uploadDialog = true
    },
    //  移除待上传的文件
    handleRemove (file, fileList) {},
    // 查询待上传的文件
    handlePreview (file) {},
    // 给表头设置颜色
    tableHeaderColor ({ row, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 7) {
        return 'background-color: #409EFF;text-align:center;font-size:16;color:black;'
      } else if (rowIndex === 0 && columnIndex === 8) {
        return 'background-color: #ffff66;text-align:center;font-size:16;color:black;'
      }
    },
    // 请求后台获取数据
    getdocList () {
      dcsApi.getFiles({ dirId: this.dirId }).then(res => {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].cdate = this.dateFormat(res.data[i].cdate)
        }
        this.tableData = res.data
      })
    },
    // 转换时间
    dateFormat: function (time) {
      var date = new Date(time)
      var year = date.getFullYear()
      var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return year + '-' + month + '-' + day
    }
  }
}
</script>
<style>
.el-divider__text,
.el-link {
  font-size: 1.35rem;
}

.show {
  color: red;
}
</style>
