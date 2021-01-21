<!--
 * @Author: yanbuw1911
 * @Date: 2021-01-19 16:20:40
 * @LastEditTime: 2021-01-20 10:46:40
 * @LastEditors: yanbuw1911
 * @Description: 入库界面，包括建账和入库
 * @FilePath: \client\src\views\HRD\MaterialManagement\storehouse\inbound.vue
-->
<template>
  <div class="container">
    <center><h2>入库表单填写</h2></center>
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item ref="name" label="用料名称" prop="name">
        <a-input
          v-model="form.name"
          @blur="
            () => {
              $refs.name.onFieldBlur()
            }
          "
        />
      </a-form-model-item>
      <a-form-model-item ref="qty" label="入库数量" prop="qty">
        <a-input-number
          v-model="form.qty"
          :min="1"
          :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="value => value.replace(/\$\s?|(,*)/g, '')"
          @blur="
            () => {
              $refs.qty.onFieldBlur()
            }
          "
        />
      </a-form-model-item>
      <a-form-model-item label="入库类型" prop="type">
        <a-radio-group v-model="form.type">
          <a-radio value="1">
            建账
          </a-radio>
          <a-radio value="2">
            入库
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="入库备注" prop="desc">
        <a-input v-model="form.desc" type="textarea" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSubmit">
          保存
        </a-button>
        <a-button style="margin-left: 10px;" @click="resetForm">
          重置
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: '',
      form: {
        name: '',
        qty: 1,
        type: '1',
        desc: ''
      },
      rules: {
        name: [{ required: true, message: '请选择用料', trigger: 'blur' }],
        qty: [{ required: true, message: '请输入数量', trigger: 'blur' }],
        type: [{ required: true }]
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 60%;
  margin: auto;
  border: 1px dashed rgba(172, 178, 179, 0.589);
  background-color: rgba(255, 255, 255, 0.76);
  border-radius: 20px;

  h2 {
    margin-top: 15px;
    letter-spacing: 10px;
  }
}
</style>
