<!--
 * @Date: 2021-05-04 14:27:13
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-05-04 15:25:29
 * @FilePath: \sverp-front\src\views\R&D\NewItem.vue
-->
<template>
  <div>
    <a-card>
      <a-row>
        <a-col :lg="10" :md="24">
          <a-form>
            <a-form-item label="工单号">
              <a-input disabled v-model="form.orderNum" />
            </a-form-item>
            <a-form-item label="业务对接">
              <a-row :gutter="24">
                <a-col span="12">
                  <a-input disabled v-model="form.userSection" />
                </a-col>
                <a-col span="12">
                  <a-input disabled v-model="form.userName" />
                </a-col>
              </a-row>
            </a-form-item>

            <a-form-item label="客户编号">
              <a-input v-model="form.customNum" />
            </a-form-item>
            <a-form-item label="工厂品号">
              <a-input v-model="form.producNumWork" />
            </a-form-item>
            <a-form-item label="需求数量">
              <a-input v-model="form.needHowMany" />
            </a-form-item>
            <a-form-item label="产品尺寸">
              <a-input v-model="form.producSize" />
            </a-form-item>
            <a-form-item label="生产材料">
              <a-input v-model="form.material" />
            </a-form-item>
            <a-form-item label="产品颜色">
              <a-input v-model="form.producColor" />
            </a-form-item>
            <a-form-item label="产品类别">
              <a-row>
                <a-col :span="12">
                  <a-select default-value="皮带" v-model="form.chanPinLeiBie">
                    <a-select-option value="皮带">皮带</a-select-option>
                    <a-select-option value="皮夹">皮夹</a-select-option>
                    <a-select-option value="手袋">手袋</a-select-option>
                    <a-select-option value="其他">其他</a-select-option>
                  </a-select>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item label="接单时期">
              <a-row>
                <a-col :span="12">
                  <a-date-picker v-model="getOrderDate"></a-date-picker>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item label="要求日期">
              <a-row>
                <a-col :span="12">
                  <a-date-picker v-model="needFinishDate"></a-date-picker>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item label="任务附件">
              <a-upload v-model="fileDress">
                <a-button> <a-icon type="upload" /> Click to Upload </a-button>
              </a-upload>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleSubmit">确认新增</a-button>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      getOrderDate: null,
      needFinishDate: null,
      fileDress: null,
      form: {
        orderNum: null,
        chanPinLeiBie: null,
        needHowMany: null,
        id: null,
        customNum: null,
        producNumWork: null,
        getOrderDate: null,
        needFinishDate: null,
        producSize: null,
        material: null,
        producColor: null,
        fileDress: null,
        userSection: null,
        userName: null
      }
    }
  },
  methods: {
    handleSubmit () {
      try {
        this.form.getOrderDate = this.getOrderDate.format('YYYY-MM-DD')
      } catch (e) {}
      try {
        this.form.needFinishDate = this.needFinishDate.format('YYYY-MM-DD')
      } catch (e) {}
    }
  }
}
</script>
