<!--
 * @Author: yanbuw1911
 * @Date: 2021-01-19 16:20:40
 * @LastEditTime: 2021-02-26 09:52:41
 * @LastEditors: yanbuw1911
 * @Description: 入库界面，包括建账和入库
 * @FilePath: /sverp-front/src/views/HRD/MaterialManagement/storehouse/inbound.vue
-->
<template>
  <div class="container">
    <div class="inbound-form">
      <center>
        <h2>
          <a-tooltip placement="top" title="向库存中添加用料物品">
            <span>入库表单</span>
          </a-tooltip>
        </h2>
      </center>
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
          <a-popconfirm
            placement="bottom"
            title="确认保存以上入库信息吗？"
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
    <div class="my-inbound" v-if="inboundRecords.length">
      <center>
        <h3>
          <a-tooltip placement="top" title="显示最近的添加记录，可以撤销入库">
            <span>我的入库</span>
          </a-tooltip>
        </h3>
      </center>
      <a-timeline>
        <a-timeline-item class="log-list" v-for="(item, idx) in inboundRecords" :key="idx">
          <a-popover placement="topLeft">
            <template #title>
              <a-button type="primary" size="small" shape="circle" title="撤销" @click="handleUndo(item)">
                <a-icon type="undo" />
              </a-button>
              {{ item.hml_join_date }}
            </template>
            <template #content>
              <ul
                style="padding: 0;display: flex;justify-content: space-between;"
                v-html="logConentHtml(item, ['hml_operate_type', 'hml_operate_qty', 'hmu_material_unit'])"
              ></ul>
            </template>
            <div class="log-content">
              <ul v-html="logConentHtml(item, ['hmu_material_name'])"></ul>
              <div class="log-count">
                <p></p>
              </div>
            </div>
          </a-popover>
        </a-timeline-item>
      </a-timeline>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMaterialList, setMaterialStock, getMaterialLogListByUserid, materialLogSoftDel } from '@/api/hrd'
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
      },
      popconfirmDisabled: true,
      loading: false,
      inboundRecords: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    async handleUndo ({ id, hml_material_id: materialId, hml_operate_qty: oprtQty }) {
      await materialLogSoftDel(id, materialId, oprtQty, this.userInfo.con_id).then(async ({ result }) => {
        if (result) {
          this.$message.success('已撤销')
          await getMaterialLogListByUserid(this.userInfo.con_id).then(({ data }) => {
            this.inboundRecords = data
          })
        } else {
          this.$message.info('撤销失败')
        }
      })
    },
    async submitData () {
      this.loading = true
      const data = clone(this.form, true)
      data.materialId = data.name[0].key
      delete data.name

      await setMaterialStock(data, this.userInfo.con_id).then(res => {
        if (res.result) {
          this.resetForm()

          this.$notification.success({
            message: this.form.operType === 'put' ? '入账成功' : '建账成功',
            icon: <a-icon type="smile" style="color: #108ee9" />
          })
        } else {
          this.$notification.error({
            message: this.form.operType === 'put' ? '入账失败' : '建账失败',
            icon: <a-icon type="frown" style="color: #108ee9" />
          })
        }
      })
      this.loading = false
    },
    onSubmit () {
      this.$refs.ruleForm.validate(valid => {
        this.popconfirmDisabled = !valid
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
    },
    logConentHtml (item, fields) {
      return fields.reduce((pre, curr) => {
        let html = `<li>${item[curr]}</li>`
        if (item[curr] === 'put') {
          html = '<li style="text-shadow: 1px 1px 1px #a8ee58;">入账</li>'
        }
        if (item[curr] === 'out') {
          html = '<li style="text-shadow: 1px 1px 1px rgb(235, 184, 17);">出账</li>'
        }
        if (item[curr] === 'set') {
          html = '<li>建账</li>'
        }
        if (/入账/.test(pre) && typeof item[curr] === 'number') {
          html = `<li style="color: #a8ee58;">${item[curr]}</li>`
        }
        if (/出账/.test(pre) && typeof item[curr] === 'number') {
          html = `<li style="color: rgb(235, 184, 17);">${item[curr]}</li>`
        }

        return pre + html
      }, '')
    }
  },
  async mounted () {
    await getMaterialLogListByUserid(this.userInfo.con_id).then(({ data }) => {
      this.inboundRecords = data
    })
  }
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  justify-content: space-around;

  .inbound-form {
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

  .my-inbound {
    width: 20%;
    margin: 0.1rem 1.5rem;

    h3 {
      margin-top: 0.5rem;
      letter-spacing: 1rem;
    }

    .ant-timeline {
      max-height: 500px;
      overflow: auto;
      padding: 5px 0;
    }

    .log-list {
      counter-increment: number;

      .log-content {
        display: flex;
        cursor: pointer;

        ul {
          padding: 0;
          display: flex;
          width: 80%;
          justify-content: space-between;
        }

        .log-count {
          margin-left: auto;

          p {
            margin: 0 15px;
          }

          p::before {
            content: counter(number) ' ';
            color: rgba(107, 109, 110, 0.562);
          }
        }
      }
    }
  }
}
</style>
