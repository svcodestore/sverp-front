<!--
 * @Date: 2021-04-13 09:50:11
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-04-13 16:27:27
 * @FilePath: \sverp-front\src\views\TPM\QADD\index.vue
-->
<template>

  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        :label="$t('设备名称')"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input
          v-decorator="[
            'mache_name',
            {rules: [{ required: true, message: $t('要报修的是什么设备？') }]}
          ]"
          name="mache_name"
          :placeholder="$t('要报修的是什么设备？')" />
      </a-form-item>

      <a-form-item
        :label="$t('故障描述')"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-textarea
          rows="4"
          :placeholder="$t('请描述发生的故障...')"
          v-decorator="[
            'repaircontents',
            {rules: [{ required: true, message: $t('请简单描述遇到的问题，或故障的状况。') }]}
          ]" />
      </a-form-item>

      <a-form-item
        :label="$t('设备编号')"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <a-input
          name="mechenum"
          v-decorator="[
            'mechenum'
          ]"
          :placeholder="$t('如有设备编号，请填写')" />
      </a-form-item>

      <a-form-item
        :label="$t('地点')"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <a-input :placeholder="$t('设备地点(选填)')" />
      </a-form-item>

      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button htmlType="submit" type="primary">{{ $t('快速报修') }}</a-button>
      </a-form-item>
    </a-form>
  </a-card>

</template>

<script>
import { apiSaveRepair } from '@/api/records'

export default {
  name: 'TPMqadd',
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    // handler
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // 提交信息
          apiSaveRepair({ A: [values] })
          // 跳转详细
          // this.$router.push({ path: '/' })
          this.$router.push({ name: 'TPM_RECORD_DETAIL', params: { rid: '3030' } })
        }
      })
    }
  }
}
</script>
