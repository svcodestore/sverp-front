<!--
 * @Author: yanbuw1911
 * @Date: 2021-01-20 10:31:49
 * @LastEditTime: 2021-01-21 11:23:11
 * @LastEditors: yanbuw1911
 * @Description: 领料申请
 * @FilePath: \client\src\views\HRD\MaterialManagement\storehouse\apply.vue
-->
<template>
  <div class="container">
    <center><h2>领料申请表单填写</h2></center>
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="领料日期" required prop="date">
        <a-date-picker v-model="form.date" type="date" placeholder="请选择日期" style="width: 100%;" />
      </a-form-model-item>
      <a-form-model-item ref="name" label="出库用料" prop="name">
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
          <a-select-option
            v-for="item in materials"
            :key="`${item.id}/${item.hmu_material_name}|${item.hmu_material_stock}${item.hmu_material_unit}`"
          >
            {{ item.hmu_material_name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="qty" label="领料数量" prop="qty" v-if="form.name.length">
        <a-space>
          <a-input-number
            v-for="(item, idx) in form.name"
            :key="idx"
            v-model="form.qty[idx].value"
            :min="1"
            :max="
              Number(
                form.qty[idx].id
                  .split('/')[1]
                  .split('|')[1]
                  .match(/\d/g)
                  .join('')
              )
            "
            :placeholder="
              '剩余' +
                form.qty[idx].id
                  .split('/')[1]
                  .split('|')[1]
                  .match(/\d/g)
                  .join('')
            "
            :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\$\s?|(,*)/g, '')"
          />
        </a-space>
      </a-form-model-item>
      <a-form-model-item label="领料备注" prop="desc" v-if="form.name.length">
        <a-space>
          <a-input
            v-for="(item, idx) in form.name"
            :key="idx"
            v-model="form.desc[idx].value"
            type="textarea"
            :placeholder="form.desc[idx].id.split('/')[1].split('|')[0]"
          />
        </a-space>
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
import { getMaterialList, setOutboundMaterialOrder } from '@/api/hrd'
import { debounce, clone } from 'xe-utils'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  data () {
    this.fetchMaterial = debounce(this.fetchMaterial, 200)

    return {
      materials: [],
      fetching: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: '',
      form: {
        name: [],
        qty: [],
        date: moment(),
        desc: []
      },
      rules: {
        name: [{ required: true, message: '请选择用料', trigger: 'blur' }],
        qty: [{ required: true, message: '请输入数量', trigger: 'blur' }, { validator: this.qtyValidator }],
        date: [{ required: true, message: '请选择日期', trigger: 'blur' }]
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
          data.orderNo = data.date.format('YYYYMMDD').toString() + Math.ceil(Math.random() * 100000)
          data.applyList = data.name.map((e, i) => ({
            materialId: e.key.split('/')[0],
            qty: data.qty[i].value,
            remark: data.desc[i].value
          }))

          delete data.name
          delete data.qty
          delete data.date
          delete data.desc

          const info = { name: this.userInfo.con_name, dept: this.userInfo.con_dept }
          await setOutboundMaterialOrder(data, info).then(res => {
            if (res.result) {
              this.resetForm()

              this.$notification.success({
                message: '领料申请成功',
                icon: <a-icon type='smile' style='color: #108ee9' />
              })
            } else {
              this.$notification.error({
                message: '领料申请失败',
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

      // 更新数量和备注
      this.form.qty = value.map(e => ({ value: null, id: e.key }))
      this.form.desc = value.map(e => ({ value: null, id: e.key }))

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
          if (val) {
            this.materials = res.data.filter(e => e.hmu_material_model !== '0' && e.hmu_material_stock !== '0')
          } else {
            this.materials = res.data
          }
        }

        this.fetching = false
      })
    },
    qtyValidator (rule, value, callback) {
      if (value.find(e => !e.value)) {
        callback(new Error('存在空值'))
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
