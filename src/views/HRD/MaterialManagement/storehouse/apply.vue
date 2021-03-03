<!--
 * @Author: yanbuw1911
 * @Date: 2021-01-20 10:31:49
 * @LastEditTime: 2021-03-03 15:24:35
 * @LastEditors: yanbuw1911
 * @Description: 领料申请
 * @FilePath: /sverp-front/src/views/HRD/MaterialManagement/storehouse/apply.vue
-->
<template>
  <div class="container">
    <div class="application-form">
      <center>
        <h2>
          <a-tooltip placement="top" title="申请用料物品">
            <span>领料申请表单</span>
          </a-tooltip>
        </h2>
      </center>
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
          <a-popconfirm
            placement="bottom"
            title="确认保存以上申请信息吗？"
            :ok-text="$t('confirm')"
            :cancel-text="$t('cancel')"
            :disabled="popconfirmDisabled"
            @confirm="submitData"
            @cancel="popconfirmDisabled = true"
          >
            <a-button type="primary" @click="onSubmit" :loading="loading">
              保存
            </a-button>
          </a-popconfirm>
          <a-button style="margin-left: 10px;" @click="resetForm">
            重置
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="my-application" v-if="applicationRecords.length">
      <center>
        <h3>
          <a-tooltip placement="top" title="用料申请单列表，可撤销申请">
            <span>我的申请</span>
          </a-tooltip>
        </h3>
      </center>
      <a-collapse accordion :bordered="false" defaultActiveKey="0">
        <a-collapse-panel :key="String(index)" :header="item.date" v-for="(item, index) in applicationRecords">
          <p v-for="(record, idx) in item.item" :key="idx">
            <a-popover placement="topLeft">
              <template #title>
                <a-button type="primary" size="small" shape="circle" title="撤销" @click="handleUndo(record.id)">
                  <a-icon type="undo" />
                </a-button>
                {{ record.hoo_order_id }}
              </template>
              <template #content>
                <div
                  style="display: flex;justify-content: space-between;"
                  v-for="material in outboundMaterials"
                  :key="material.id"
                >
                  <span>{{ material.hmu_material_name }}</span>
                  <span>{{ material.hom_apply_qty }}</span>
                  <span>{{ material.hom_out_qty }}</span>
                </div>
              </template>
              <div class="record" @mouseenter="getOutboundMaterialList(record.id)">
                <span>{{ record.hoo_order_id }}</span>
                <span style="color: grey;">{{ record.hoo_join_date.split(' ')[1] }}</span>
              </div>
            </a-popover>
          </p>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script>
import {
  getMaterialList,
  setOutboundMaterialOrder,
  getIndividualOutboundOrder,
  getOutboundMaterialList,
  undoOutbound
} from '@/api/hrd'
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
      },
      popconfirmDisabled: true,
      loading: false,
      applicationRecords: [],
      outboundMaterials: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    async handleUndo (id) {
      await undoOutbound(id).then(({ result }) => {
        result && this.$message.success('撤销成功')
        result || this.$message.error('撤销失败')
      })
      await this.getData()
    },
    async getOutboundMaterialList (id) {
      await getOutboundMaterialList(id).then(({ data }) => {
        this.outboundMaterials = data
      })
    },
    async submitData () {
      this.loading = true
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

      const info = { name: this.userInfo.con_id, dept: this.userInfo.con_dept }
      await setOutboundMaterialOrder(data, info).then(res => {
        if (res.result) {
          this.resetForm()

          this.$notification.success({
            message: '领料申请成功',
            icon: <a-icon type="smile" style="color: #108ee9" />
          })
        } else {
          this.$notification.error({
            message: '领料申请失败',
            icon: <a-icon type="frown" style="color: #108ee9" />
          })
        }
      })
      this.loading = false
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (!this.userInfo.con_dept) {
          this.$message.error('账户所在部门为空，请联系管理员')
        }
        if (valid && this.userInfo.con_dept) {
          this.popconfirmDisabled = false
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
    },
    async getData () {
      await getIndividualOutboundOrder(this.userInfo.con_id).then(({ data }) => {
        const arr = []
        data
          .map(e => e.hoo_join_date.split(' ')[0])
          .forEach(e => {
            const idx1 = data.findIndex(item => item.hoo_join_date.split(' ')[0] === e)
            const idx2 = arr.findIndex(item => item.date === e)
            if (idx1 > -1) {
              if (idx2 < 0) {
                arr.push({
                  date: e,
                  item: [...data.splice(idx1, 1)]
                })
              } else {
                arr[idx2]['item'].push(...data.splice(idx1, 1))
              }
            }
          })
        this.applicationRecords = arr
      })
    }
  },
  async mounted () {
    await this.getData()
  }
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  justify-content: space-around;

  .application-form {
    margin: 0.1rem 1.5rem;
    width: 60%;
    border: 1px dashed rgba(172, 178, 179, 0.589);
    background-color: rgba(255, 255, 255, 0.76);
    border-radius: 3rem;

    h2 {
      margin-top: 0.5rem;
      letter-spacing: 1rem;
    }
  }

  .my-application {
    width: 20%;
    margin: 0.1rem 1.5rem;

    h3 {
      margin-top: 0.5rem;
      letter-spacing: 1rem;
    }

    .ant-collapse {
      max-height: 500px;
      overflow: auto;
      padding: 5px 0;
      min-width: 150px;

      .record {
        width: 100%;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
      }
    }
  }
}
</style>
