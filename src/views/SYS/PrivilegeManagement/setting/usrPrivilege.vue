<!--
 * @Author: yanbuw1911
 * @Date: 2020-12-16 15:04:35
 * @LastEditTime: 2021-02-22 10:18:48
 * @LastEditors: yanbuw1911
 * @Description: 用户权限设定
 * @FilePath: /sverp-front/src/views/SYS/PrivilegeManagement/setting/usrPrivilege.vue
-->
<template>
  <div>
    <a-input-search
      title="输入用户 ID 查询权限"
      placeholder="输入用户 ID 查询权限"
      style="width: 180px;margin-bottom: 10px;"
      :loading="searchLoading"
      :max-length="16"
      @search="handleSearch"
      @focus="showInfo = false"
    />

    <a-descriptions
      title="权限信息"
      layout="vertical"
      bordered
      :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
      v-if="showInfo"
    >
      <a-descriptions-item label="用户">
        {{ usr }}
      </a-descriptions-item>
      <a-descriptions-item label="角色">
        <template v-if="isRoleEdit">
          <a-select mode="multiple" style="width: 85%;margin-right: 10px;" v-model="role">
            <a-select-option v-for="item in roles" :key="String(item.id)">
              {{ `${item.role_desc}` }}
            </a-select-option>
          </a-select>
          <a-popconfirm
            :title="$t('gridOptConfirmText')"
            :ok-text="$t('confirm')"
            :cancel-text="$t('cancel')"
            placement="top"
            @confirm="handleSaveUserRole"
            @cancel="isRoleEdit = false"
          >
            <a-button shape="circle" :title="$t('save')" :loading="roleSaveBtnLoading">
              <a-icon v-show="!roleSaveBtnLoading" type="save" />
            </a-button>
          </a-popconfirm>
        </template>
        <template v-else>
          {{ role.map(e => roles.find(r => e == r.id).role_desc).join(', ') }}
          <a-icon type="edit" @click="isRoleEdit = true" />
        </template>
      </a-descriptions-item>
      <a-descriptions-item label="所属部门">
        {{ dept }}
      </a-descriptions-item>
      <a-descriptions-item label="所属分组">
        <template v-if="isGroupEdit">
          <a-select mode="multiple" style="width: 85%;margin-right: 10px;" v-model="group">
            <a-select-option v-for="item in groups" :key="String(item.id)">
              {{ `${item.sgd_alias}` }}
            </a-select-option>
          </a-select>
          <a-popconfirm
            :title="$t('gridOptConfirmText')"
            :ok-text="$t('confirm')"
            :cancel-text="$t('cancel')"
            placement="top"
            @confirm="handleSaveUserGroup"
            @cancel="isGroupEdit = false"
          >
            <a-button shape="circle" :title="$t('save')" :loading="groupSaveBtnLoading">
              <a-icon v-show="!groupSaveBtnLoading" type="save" />
            </a-button>
          </a-popconfirm>
        </template>
        <template v-else>
          {{ group.map(e => groups.find(g => e == g.id).sgd_alias).join(', ') }}
          <a-icon type="edit" @click="isGroupEdit = true" />
        </template>
      </a-descriptions-item>
      <a-descriptions-item label="可访问菜单节点">
        <template v-if="isSuAdmin">
          *
        </template>
        <template v-else>
          <template v-for="(m, i) in visibleMenu">
            <a-badge color="green" :key="i + Math.random()" :text="m.mnu_name" />
            <br :key="i + Math.random()" />
          </template>
        </template>
      </a-descriptions-item>
      <a-descriptions-item label="可创建菜单节点">
        <template v-if="isSuAdmin">
          *
        </template>
        <template v-else>
          <template v-for="(m, i) in creatableMenu">
            <a-badge color="lime" :key="i + Math.random()" :text="m.mnu_name" />
            <br :key="i + Math.random()" />
          </template>
        </template>
      </a-descriptions-item>
      <a-descriptions-item label="可修改菜单节点">
        <template v-if="isSuAdmin">
          *
        </template>
        <template v-else>
          <template v-for="(m, i) in updatableMenu">
            <a-badge color="green" :key="i + Math.random()" :text="m.mnu_name" />
            <br :key="i + Math.random()" />
          </template>
        </template>
      </a-descriptions-item>
      <a-descriptions-item label="可删除菜单节点">
        <template v-if="isSuAdmin">
          *
        </template>
        <template v-else>
          <template v-for="(m, i) in deletableMenu">
            <a-badge color="green" :key="i + Math.random()" :text="m.mnu_name" />
            <br :key="i + Math.random()" />
          </template>
        </template>
      </a-descriptions-item>
      <a-descriptions-item label="可上传菜单节点">
        <template v-if="isSuAdmin">
          *
        </template>
        <template v-else>
          <template v-for="(m, i) in uploadableMenu">
            <a-badge color="green" :key="i + Math.random()" :text="m.mnu_name" />
            <br :key="i + Math.random()" />
          </template>
        </template>
      </a-descriptions-item>
      <a-descriptions-item label="接口黑名单">
        <template v-for="b in blackApi">
          <template v-if="!!b">
            <a-badge color="gray" :key="b" :text="b" />
            <br :key="b" />
          </template>
        </template>
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
import { getUserAuthAllInfo, getUserAuthMenu, saveUserRoleOpt, saveUserGroupOpt } from '@/api/user'
import { getRoles, getGroups } from '@/api/privilege'
export default {
  data () {
    return {
      roleSaveBtnLoading: false,
      groupSaveBtnLoading: false,
      isRoleEdit: false,
      isGroupEdit: false,
      visible: false,
      searchLoading: false,
      showInfo: false,
      authInfo: [],
      authMenu: [],
      dept: '',
      role: [],
      group: [],
      roles: [],
      groups: [],
      data: {}
    }
  },
  computed: {
    isSuAdmin () {
      const arr = []
      this.authInfo
        .filter(info => !!info.role_status)
        .forEach(info => {
          info.role_menu && arr.push(info.role_menu)
          info.group_menu && arr.push(info.group_menu)
        })

      return !!arr.find(e => e === '0')
    },
    usr () {
      return this.authInfo[0].name
    },
    blackApi () {
      return [...new Set(this.authInfo.map(info => info.blackapi))]
    },
    visibleMenu () {
      return this.authMenu ? this.authMenu.filter(menu => menu['?'] === '100') : []
    },
    creatableMenu () {
      return this.authMenu ? this.authMenu.filter(menu => menu['?'] === '400') : []
    },
    updatableMenu () {
      return this.authMenu ? this.authMenu.filter(menu => menu['?'] === '500') : []
    },
    deletableMenu () {
      return this.authMenu ? this.authMenu.filter(menu => menu['?'] === '300') : []
    },
    uploadableMenu () {
      return this.authMenu ? this.authMenu.filter(menu => menu['?'] === '200') : []
    }
  },
  methods: {
    async handleSearch (id) {
      if (!id) return

      this.searchLoading = true

      await getUserAuthAllInfo(id)
        .then(async res => {
          if (res.result && res.data.length) {
            this.authInfo = res.data
            this.role = [...new Set(this.authInfo.filter(info => !!info.role_status).map(info => String(info.roleid)))]
            this.dept = this.authInfo[0].dept

            this.group = [
              ...new Set(this.authInfo.filter(info => !!info.group_status).map(info => String(info.groupid)))
            ]

            this.showInfo = true
          } else {
            this.$message.info('暂无数据')
          }
          await getUserAuthMenu(id)
            .then(res => {
              // 普通用户权限后台传回，非连续性的数组， json decode 成了object
              // 需要对放回数据进行进一步加工，防止js代码出错卡住搜索id的画面
              if (typeof res.data === typeof {}) {
                const arr = []
                for (const item of Object.entries(res.data)) {
                  arr.push(item[1])
                }
                this.authMenu = arr
              } else {
                this.authMenu = res.data
              }
              return res.result
            })
            .catch(() => {})
        })
        .catch(() => {})
      this.searchLoading = false
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    },
    getRoleOpt (originData, data) {
      const add = []
      const mod = []
      data.forEach(item => {
        const isAdd = this.authInfo.find(info => String(info.roleid) === item)

        // 新增角色
        if (!isAdd) {
          add.push({
            map_ur_uid: this.authInfo[0].usrid,
            map_ur_rid: item,
            map_ur_creator: this.$store.state.user.info.id,
            map_ur_modifier: this.$store.state.user.info.id
          })
        } else {
          // 开启角色
          mod.push({ [JSON.stringify({ map_ur_uid: this.authInfo[0].usrid, map_ur_rid: item })]: { map_ur_status: 1 } })
        }
      })
      // const originDataSet = new Set(originData)
      const dataSet = new Set(data)
      // 禁用角色
      ;[...new Set(originData.filter(item => !dataSet.has(item)))].forEach(item => {
        mod.push({
          [JSON.stringify({ map_ur_uid: this.authInfo[0].usrid, map_ur_rid: item })]: { map_ur_status: 0 }
        })
      })

      if (!mod.length && !add.length) {
        return false
      }
      return { A: add, U: mod }
    },
    getGroupOpt (originData, data) {
      const add = []
      const mod = []
      data.forEach(item => {
        const isAdd = this.authInfo.find(info => String(info.groupid) === item)

        // 新增角色
        if (!isAdd) {
          add.push({
            sud_uid: this.authInfo[0].usrid,
            sud_did: item,
            sud_creator: this.$store.state.user.info.id,
            sud_modifier: this.$store.state.user.info.id
          })
        } else {
          // 开启角色
          mod.push({ [JSON.stringify({ sud_uid: this.authInfo[0].usrid, sud_did: item })]: { sud_status: 1 } })
        }
      })
      // const originDataSet = new Set(originData)
      const dataSet = new Set(data)
      // 禁用角色
      ;[...new Set(originData.filter(item => !dataSet.has(item)))].forEach(item => {
        mod.push({
          [JSON.stringify({ sud_uid: this.authInfo[0].usrid, sud_did: item })]: { sud_status: 0 }
        })
      })

      if (!mod.length && !add.length) {
        return false
      }
      return { A: add, U: mod }
    },
    async handleSaveUserRole () {
      const opt = this.getRoleOpt(
        [...new Set(this.authInfo.filter(info => !!info.role_status).map(info => String(info.roleid)))],
        this.role
      )
      if (!opt) return
      this.roleSaveBtnLoading = true
      await saveUserRoleOpt(opt)
        .then(res => {
          if (res.result) {
            this.showInfo = false
            this.isRoleEdit = false
            this.isGroupEdit = false
            this.$notification.success({
              message: this.$t('saveSucc'),
              icon: <a-icon type='smile' style='color: #108ee9' />
            })
          } else {
            this.$notification.error({
              message: this.$t('saveFail'),
              icon: <a-icon type='frown' style='color: #108ee9' />
            })
          }
        })
        .catch(() => {})

      this.roleSaveBtnLoading = false
    },
    async handleSaveUserGroup () {
      const opt = this.getGroupOpt(
        [...new Set(this.authInfo.filter(info => !!info.group_status).map(info => String(info.groupid)))],
        this.group
      )
      if (!opt) return
      this.groupSaveBtnLoading = true

      await saveUserGroupOpt(opt)
        .then(res => {
          if (res.result) {
            this.showInfo = false
            this.isRoleEdit = false
            this.isGroupEdit = false
            this.$notification.success({
              message: this.$t('saveSucc'),
              icon: <a-icon type='smile' style='color: #108ee9' />
            })
          } else {
            this.$notification.error({
              message: this.$t('saveFail'),
              icon: <a-icon type='frown' style='color: #108ee9' />
            })
          }
        })
        .catch(() => {})
      this.groupSaveBtnLoading = false
    }
  },
  async created () {
    await getRoles()
      .then(res => res.result && (this.roles = res.data))
      .catch(() => {})
    await getGroups()
      .then(res => res.result && (this.groups = res.data))
      .catch(() => {})
  }
}
</script>
