<!--
 * @Author: yanbuw1911
 * @Date: 2021-01-19 16:20:40
 * @LastEditTime: 2021-01-21 11:07:38
 * @LastEditors: yanbuw1911
 * @Description: 入库界面，包括建账和入库
 * @FilePath: \client\src\views\HRD\MaterialManagement\storehouse\inbound.vue
-->
<template>
  <div class="container">
    <center><h2>入库表单填写</h2></center>
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item ref="name" label="用料名称" prop="name">
        <a-select
          mode="multiple"
          v-model="form.name"
          label-in-value
          placeholder="请选择"
          :filter-option="false"
          :not-found-content="fetching ? undefined : null"
          @search="fetchMaterial"
          @change="handleChange"
          @focus="fetchMaterial"
        >
          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
          <a-select-option v-for="item in materials" :key="item.id">
            {{ item.hmu_material_name }}
          </a-select-option>
        </a-select>
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
      <a-form-model-item label="入库类型" prop="operType">
        <a-radio-group v-model="form.operType">
          <a-radio value="put">
            入库
          </a-radio>
          <a-radio value="set">
            建账
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
import { mapGetters } from 'vuex'
import { getMaterialList, setMaterialStock } from '@/api/hrd'
import { debounce, clone } from 'xe-utils'

export default {
  data () {
    this.fetchMaterial = debounce(this.fetchMaterial, 200)

    return {
      materials: [],
      fetching: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        name: [],
        qty: 1,
        operType: 'put',
        desc: null
      },
      rules: {
        name: [{ required: true, message: '请选择用料', trigger: 'blur' }, { validator: this.nameValidator }],
        qty: [{ required: true, message: '请输入数量', trigger: 'blur' }],
        type: [{ required: true }]
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    onSubmit () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const data = clone(this.form, true)
          data.materialId = data.name[0].key
          delete data.name

          await setMaterialStock(data, this.userInfo.con_id).then(res => {
            if (res.result) {
              this.resetForm()

              this.$notification.success({
                message: this.form.operType === 'put' ? '入账成功' : '建账成功',
                icon: <a-icon type='smile' style='color: #108ee9' />
              })
            } else {
              this.$notification.error({
                message: this.form.operType === 'put' ? '入账失败' : '建账失败',
                icon: <a-icon type='frown' style='color: #108ee9' />
              })
            }
          })
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    handleChange (value) {
      this.form.name = value

      Object.assign(this, {
        materials: [],
        fetching: false
      })
    },
    fetchMaterial (val) {
      this.materials = []
      this.fetching = true
      getMaterialList(val).then(res => {
        if (res.result) {
          this.materials = res.data.filter(e => e.hmu_material_model !== '0')
        }

        this.fetching = false
      })
    },
    nameValidator (rule, value, callback) {
      if (value.length > 1) {
        callback(new Error('请输入单个用料'))
      } else {
        callback()
      }
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
