<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">

        <a-form layout="vertical" :form="form" @submit="handleSubmit">
          <a-form-item
            label="昵称"
          >
            <a-input
              placeholder="给自己起个名字"
              v-decorator="[
                'name',
                {
                  rules: [
                    { min: 1, max: 16, message: '请输入1-16位字符' }
                  ],
                  validateTrigger: ['change', 'blur'],
                  initialValue: name
                }
              ]"
            />
          </a-form-item>
          <!-- <a-form-item
            label="Bio"
          >
            <a-textarea rows="4" placeholder="You are not alone."/>
          </a-form-item> -->

          <!-- <a-form-item
            label="电子邮件"
            :required="false"
          >
            <a-input placeholder="exp@admin.com"/>
          </a-form-item> -->
          <!-- <a-form-item
            label="加密方式"
            :required="false"
          >
            <a-select defaultValue="aes-256-cfb">
              <a-select-option value="aes-256-cfb">aes-256-cfb</a-select-option>
              <a-select-option value="aes-128-cfb">aes-128-cfb</a-select-option>
              <a-select-option value="chacha20">chacha20</a-select-option>
            </a-select>
          </a-form-item> -->
          <!-- <a-form-item
            label="连接密码"
            :required="false"
          >
            <a-input placeholder="h3gSbecd"/>
          </a-form-item> -->
          <a-form-item
            label="登录密码"
            required
          >
            <a-input
              placeholder="密码"
              required
              v-decorator="[
                'password',
                {
                  rules: [
                    { required: true, message: '请输入密码' }
                  ],
                  validateTrigger: ['change', 'blur']
                }
              ]"
            />
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              htmlType="submit"
              :disabled="submitBtnState"
              :loading="submitBtnState"
            >提交</a-button>
          </a-form-item>
        </a-form>

      </a-col>
      <!-- <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)" >
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img"/>
        </div>
      </a-col> -->

    </a-row>

    <!-- <avatar-modal ref="modal" @ok="setavatar"/> -->

  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import { saveUserOpt } from '@/api/user'
import md5 from 'md5'

export default {
  components: {
    AvatarModal
  },
  computed: {
    name () {
      return this.$store.state.user.name || localStorage.getItem('userid').replace(/"/g, '')
    }
  },
  data () {
    return {
      // cropper
      submitBtnState: false,
      preview: {},
      option: {
        img: '/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      },
      form: this.$form.createForm(this)
    }
  },
  methods: {
    // setavatar (url) {
    //   this.option.img = url
    // }
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields }
      } = this

      validateFields(['name', 'password'], { force: true }, async (err, values) => {
        if (!err) {
          this.submitBtnState = true
          const id = this.$store.state.user.id || localStorage.getItem('id').replace(/"/g, '')
          const opt = {
            U: [
              {
                [id]: {
                  con_name: values.name,
                  con_password: md5(values.password)
                }
              }
            ]
          }
          if (values.name === this.name) {
            delete opt.U[0].con_name
          }
          console.log(opt)
          await saveUserOpt(opt)
            .then(res => (
              res.result &&
              this.$notification
                  .success({
                    message: '修改成功',
                    icon: <a-icon type="smile" style="color: #108ee9" />
                  })
              )
            )
            .catch(() => {})

            this.submitBtnState = false
            this.$store.dispatch('Logout').then(() => {
              this.$router.push({ name: 'login' })
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
