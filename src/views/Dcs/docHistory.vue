<!--
 * @Date: 2021-05-11 16:24:11
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-05-13 15:27:03
 * @FilePath: \sverp-front\src\views\Dcs\docHistory.vue
-->
<template>
  <div>
    <el-table :data="tableData" :default-sort="{ prop: 'versionNo', order: 'descending' }" style="width: 100%">
      <el-table-column type="index" label="No"> </el-table-column>
      <el-table-column prop="isoNo" label="ISO编码"> </el-table-column>
      <el-table-column prop="filesName" label="文件名"> </el-table-column>
      <el-table-column prop="cdate" label="修改时间"> </el-table-column>
      <el-table-column prop="cuser" label="修改人"> </el-table-column>
      <el-table-column prop="versionNo" sortable label="版本号"> </el-table-column>
      <el-table-column label="浏览" id="show">
        <el-table-column label="浏览">
          <template slot-scope="scope">
            <el-button type="primary" @click="docShow(scope.row)"> 浏览 </el-button>
          </template>
        </el-table-column>
        <el-table-column label="下载">
          <template slot-scope="scope">
            <el-button type="primary" @click="docDownload(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
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
    </div>
  </div>
</template>

<script>
import dcsApi from '@/api/dcs'

export default {
  props: {
    originalFileId: {
      default: null,
      type: Number
    }
  },
  data () {
    return {
      tableData: [],
      dialogVisible: false,
      form: {
        name: '',
        content: '',
        fileId: ''
      }
    }
  },
  watch: {
    originalFileId () {
      this.freshData()
    }
  },
  created () {
    this.userData = this.$store.getters.userInfo
  },
  methods: {
    docShow (row) {
      this.$emit('showDoc', row)
    },
    docDownload (row) {
      this.$emit('downloadDoc', row)
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
        this.form.name = ''
        if (res.code === 0) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
        this.dialogVisible = false
      })
    },
    cancel () {
      this.form.name = ''
      this.dialogVisible = false
    },
    freshData () {
      dcsApi.getFilesVersion({ original: this.originalFileId }).then(res => {
        this.tableData = res.data
      })
    }
  }
}
</script>
