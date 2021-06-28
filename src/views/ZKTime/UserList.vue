<!--
 * @Date: 2021-06-01 09:59:26
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-06-02 09:07:49
 * @FilePath: \sverp-front\src\views\ZKTIme\UserList.vue
-->
<template>
  <div>
    <div id="device-list">
      <a-checkbox @change="checkAll">全选</a-checkbox>
      <a-checkbox-group v-model="choicedDevice">
        <a-checkbox v-for="(item, index) in deviceList" :key="index" :value="item.value">{{ item.label }}</a-checkbox>
      </a-checkbox-group>
      <a-button @click="getUsers" type="primary" :loading="loading">获取</a-button>
    </div>
    <div id="show-users">
      <vxe-table :loading="loading" :data="users" border show-header-overflow highlight-hover-row>
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="enRollNum" title="考勤号" width="120" sortable></vxe-table-column>
        <vxe-table-column field="userName" title="名字"></vxe-table-column>
        <vxe-table-column field="enable" title="启用状态">
          <template #default="{ row }">
            <a-tag v-if="row.enable == true" color="green">启用</a-tag>
            <a-tag v-else color="red">停用</a-tag>
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作">
          <template #default="{ row }">
            <div class="control-btns">
              <a-button @click="changeUserState(row, false)" size="small" v-if="row.enable == true">停用</a-button>
              <a-button @click="changeUserState(row, true)" size="small" v-else>启用</a-button>
              <a-button @click="deleteUserAllData(row)" type="danger" size="small">删除用户</a-button>
            </div>
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
const baseURL = process.env.VUE_APP_ZKTIME_API_BASE_URL
const ZKAPI = {
  getAllUserInfo: new URL('/users', baseURL).href,
  deleteUser: new URL('/delete_user', baseURL).href,
  enableUser: new URL('/enable_user', baseURL).href
}

export default {
  data () {
    return {
      loading: false,
      choicedDevice: [],
      users: [],
      deviceList: [
        { label: '1号机', value: { ip: '192.168.123.71', port: 4370, deviceNo: 1 } },
        { label: '2号机', value: { ip: '192.168.123.72', port: 4370, deviceNo: 2 } },
        { label: '3号机', value: { ip: '192.168.123.73', port: 4370, deviceNo: 3 } },
        { label: '4号机', value: { ip: '192.168.123.74', port: 4370, deviceNo: 4 } },
        { label: '5号机', value: { ip: '192.168.123.75', port: 4370, deviceNo: 5 } },
        { label: '6号机', value: { ip: '192.168.123.76', port: 4370, deviceNo: 6 } },
        { label: '7号机', value: { ip: '192.168.123.77', port: 4370, deviceNo: 7 } },
        { label: '8号机', value: { ip: '192.168.123.78', port: 4370, deviceNo: 8 } },
        { label: '9号机', value: { ip: '192.168.123.79', port: 4370, deviceNo: 9 } },
        { label: '10号机', value: { ip: '192.168.123.70', port: 4370, deviceNo: 10 } }
      ],
      hash: {}
    }
  },
  methods: {
    mergeUserData (data) {
      data.forEach(item => {
        if (!this.hash[item.enRollNum]) {
          this.users.push(item)
          this.hash[item.enRollNum] = true
        }
      })
    },
    getUsers () {
      this.loading = true
      this.hash = {}
      const awaitJobs = []
      this.users = []
      for (const item of this.choicedDevice) {
        awaitJobs.push(axios.post(ZKAPI.getAllUserInfo, item))
      }
      Promise.all(awaitJobs).then(values => {
        values.forEach(res => {
          this.mergeUserData(res.data)
        })
        this.loading = false
      })
    },
    changeUserState (row, state) {
      const edmes = state ? '启用' : '禁用'
      if (confirm('确定 ' + edmes + row.userName + ' ？')) {
        // 未测
        this.loading = true
        const awaitJobs = []
        for (const device of this.choicedDevice) {
          const reqData = Object.assign({}, device)
          reqData.enRollNum = row.enRollNum
          reqData.state = state
          awaitJobs.push(axios.post(ZKAPI.enableUser, reqData))
        }
        Promise.all(awaitJobs).then(() => {
          this.getUsers()
        })
      }
    },
    deleteUserAllData (row) {
      if (confirm('确定删除 ' + row.userName + ' 信息、指纹、面容识别？')) {
        // 未测
        this.loading = true
        const awaitJobs = []
        for (const device of this.choicedDevice) {
          const reqData = Object.assign({}, device)
          reqData.enRollNum = row.enRollNum
          awaitJobs.push(axios.post(ZKAPI.deleteUser, reqData))
        }
        Promise.all(awaitJobs).then(() => {
          this.getUsers()
        })
      }
    },
    checkAll (e) {
      this.choicedDevice = []
      if (e.target.checked) {
        this.deviceList.forEach(item => {
          this.choicedDevice.push(item.value)
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
#show-users {
  margin-top: 1rem;
}

.control-btns {
  button {
    margin: 5px;
  }
}
</style>
