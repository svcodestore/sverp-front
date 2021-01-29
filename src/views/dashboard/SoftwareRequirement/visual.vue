<!--
 * @Author: yanbuw1911
 * @Date: 2021-01-28 15:41:02
 * @LastEditTime: 2021-01-29 08:14:55
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\views\dashboard\SoftwareRequirement\visual.vue
-->
<template>
  <div style="height: 1800px;">
    <div style="height: 42%;"></div>
    <div>
      <a-carousel autoplay>
        <div class="box" v-for="item in list" :key="item.id">
          <a-row :gutter="24">
            <a-col :span="12">
              <div>项目名称：{{ item.isr_name }}</div>
              <div>需求单位：{{ item.isr_requr_dept }}</div>
              <div>项目负责人：{{ item.isr_leader }}</div>
              <div>项目状态：{{ item.isr_proj_status }}</div>
              <div>开发人员：{{ item.isr_dev }}</div>
              <div>当前进度：{{ item.isr_curr_phase }}</div>
            </a-col>
            <a-col :span="12">
              <div>项目名称：{{ item.isr_name }}</div>
              <div>需求单位：{{ item.isr_requr_dept }}</div>
              <div>项目负责人：{{ item.isr_leader }}</div>
              <div>项目状态：{{ item.isr_proj_status }}</div>
              <div>开发人员：{{ item.isr_dev }}</div>
              <div>当前进度：{{ item.isr_curr_phase }}</div>
            </a-col>
          </a-row>
        </div>
      </a-carousel>
    </div>
  </div>
</template>

<script>
import { getSoftRequire } from '@/api/improve'
import { getUsers } from '@/api/user'

export default {
  data: () => ({
    list: []
  }),
  async mounted () {
    await getSoftRequire().then(async res => {
      await getUsers().then(response => {
        this.list = res.data.map(e => {
          e.isr_approver = response.data.find(item => e.isr_approver === item.con_id)?.con_name
          e.isr_creator = response.data.find(item => e.isr_creator === item.con_id)?.con_name
          e.isr_dev = response.data.find(item => e.isr_dev === item.con_id)?.con_name
          e.isr_leader = response.data.find(item => e.isr_leader === item.con_id)?.con_name
          e.isr_modifier = response.data.find(item => e.isr_modifier === item.con_id)?.con_name
          return e
        })

        this.list = [...this.list, ...this.list]
        this.list = [...this.list, ...this.list]
      })
    })
  }
}
</script>

<style lang="less" scoped>
.box {
  height: 680px;
  font-size: 40px;
  font-weight: 900;
  padding: 10px 36px;
  background: linear-gradient(to right bottom, #00e1ff2c, #6ceaee07, #00e1ff2c, #6ceaee07, #00e1ff2c);
  user-select: none;
  font-family: Tahoma, Helvetica, Arial, '\5b8b\4f53', sans-serif;

  .ant-col {
    div {
      margin: 26px;
    }
  }
}
</style>
