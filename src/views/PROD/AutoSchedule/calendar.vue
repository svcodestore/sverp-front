<!--
 * @Author: yanbuw1911
 * @Date: 2020-11-17 15:45:13
 * @LastEditTime: 2021-01-04 10:07:21
 * @LastEditors: yanbuw1911
 * @Description:
 * @FilePath: \client\src\views\PROD\AutoSchedule\calendar.vue
-->
<template>
  <div>
    <div style="display: flex;float: left;">
      <a-button
        v-if="showSetting"
        title="设置"
        style="margin: 0 10px; z-index: 999;"
        shape="circle"
        type="primary"
        @click="settingVisible = true"
      >
        <a-icon type="setting"></a-icon>
      </a-button>
      <a-spin :spinning="worktimeRangeSpinning">
        <h3>上下班时间：{{ worktimeRange }}</h3>
      </a-spin>
    </div>
    <a-drawer
      title="行事历设置"
      placement="right"
      :width="820"
      :closable="false"
      :visible="settingVisible"
      @close="handleDrawerClose"
    >
      <p v-if="!showWorktimeSetting">
        上下班时间：<a-button type="link" @click="showWorktimeSetting = !showWorktimeSetting">
          {{ worktimeRange }}
        </a-button>
        <a-button v-if="opt.A.length || opt.U.length" shape="circle" title="保存" @click="handleSave">
          <a-icon type="save" />
        </a-button>
      </p>
      <a-form :form="worktimeForm" @submit="handleSubmit" v-if="showWorktimeSetting">
        <a-row :gutter="24">
          <a-col :span="7">
            <a-form-item label="上午">
              <div>
                <a-time-picker
                  placeholder="选择时间"
                  style="width: 100px;"
                  :minute-step="30"
                  :second-step="60"
                  v-decorator="[
                    'morningStart',
                    {
                      rules: [
                        {
                          required: true,
                          message: '不能为空'
                        }
                      ],
                      initialValue: str2time(0)
                    }
                  ]"
                />
                <a-time-picker
                  placeholder="选择时间"
                  style="width: 100px;"
                  :minute-step="30"
                  :second-step="60"
                  v-decorator="[
                    'morningStop',
                    {
                      rules: [
                        {
                          required: true,
                          message: '不能为空'
                        }
                      ],
                      initialValue: str2time(1)
                    }
                  ]"
                />
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="7">
            <a-form-item label="下午">
              <div>
                <a-time-picker
                  placeholder="选择时间"
                  style="width: 100px;"
                  :minute-step="30"
                  :second-step="60"
                  v-decorator="[
                    'afternoonStart',
                    {
                      rules: [
                        {
                          required: true,
                          message: '不能为空'
                        }
                      ],
                      initialValue: str2time(2)
                    }
                  ]"
                />
                <a-time-picker
                  placeholder="选择时间"
                  style="width: 100px;"
                  :minute-step="30"
                  :second-step="60"
                  v-decorator="[
                    'afternoonStop',
                    {
                      rules: [
                        {
                          required: true,
                          message: '不能为空'
                        }
                      ],
                      initialValue: str2time(3)
                    }
                  ]"
                />
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="7">
            <a-form-item label="晚上">
              <div>
                <a-time-picker
                  placeholder="选择时间"
                  style="width: 100px;"
                  :minute-step="30"
                  :second-step="60"
                  v-decorator="[
                    'nightStart',
                    {
                      rules: [
                        {
                          required: true,
                          message: '不能为空'
                        }
                      ],
                      initialValue: str2time(4)
                    }
                  ]"
                />
                <a-time-picker
                  placeholder="选择时间"
                  style="width: 100px;"
                  :minute-step="30"
                  :second-step="60"
                  v-decorator="[
                    'nightStop',
                    {
                      rules: [
                        {
                          required: true,
                          message: '不能为空'
                        }
                      ],
                      initialValue: str2time(5)
                    }
                  ]"
                />
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="3">
            <div style="margin-top: 42px;">
              <a-button type="primary" htmlType="submit">确定</a-button>
            </div>
          </a-col>
        </a-row>
      </a-form>
      <a-calendar
        v-if="!showWorktimeSetting"
        v-model="datePonit"
        :disabled-date="disabledDate"
        :valid-range="validRange"
        @panelChange="handleDateChg"
        @select="setWorkDetail"
      >
        <template v-slot:dateCellRender="value">
          <div style="display: flex;" v-html="gendateCellHtml(value)"></div>
        </template>
      </a-calendar>
      <a-modal
        v-model="modalVisible"
        :title="dailyActionSettingTitle"
        centered
        cancelText="取消"
        okText="确定"
        :closable="false"
        :keyboard="false"
        :maskClosable="false"
        @ok="handleWorkdaySetting"
      >
        <p>休息：<a-switch :checked="isRestDay" @change="isRestDay = !isRestDay" /></p>
        <a-form :form="worktimeForm2" ref="worktimeForm2">
          <a-row :gutter="24" v-if="!isRestDay">
            <a-col :span="7">
              <a-form-item label="上午">
                <div>
                  <a-time-picker
                    placeholder="选择时间"
                    style="width: 100px;"
                    :minute-step="30"
                    :second-step="60"
                    v-decorator="[
                      'morningStart',
                      {
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ],
                        initialValue: str2time(0)
                      }
                    ]"
                  />
                  <a-time-picker
                    placeholder="选择时间"
                    style="width: 100px;"
                    :minute-step="30"
                    :second-step="60"
                    v-decorator="[
                      'morningStop',
                      {
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ],
                        initialValue: str2time(1)
                      }
                    ]"
                  />
                </div>
              </a-form-item>
            </a-col>
            <a-col :span="7">
              <a-form-item label="下午">
                <div>
                  <a-time-picker
                    placeholder="选择时间"
                    style="width: 100px;"
                    :minute-step="30"
                    :second-step="60"
                    v-decorator="[
                      'afternoonStart',
                      {
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ],
                        initialValue: str2time(2)
                      }
                    ]"
                  />
                  <a-time-picker
                    placeholder="选择时间"
                    style="width: 100px;"
                    :minute-step="30"
                    :second-step="60"
                    v-decorator="[
                      'afternoonStop',
                      {
                        rules: [
                          {
                            required: true,
                            message: '不能为空'
                          }
                        ],
                        initialValue: str2time(3)
                      }
                    ]"
                  />
                </div>
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item label="晚上">
                <div style="display: inline;" v-if="isOvertime">
                  <a-time-picker
                    placeholder="选择时间"
                    style="width: 100px;"
                    :minute-step="30"
                    :second-step="60"
                    v-decorator="[
                      'nightStart',
                      {
                        initialValue: str2time(4)
                      }
                    ]"
                  />
                  <a-time-picker
                    placeholder="选择时间"
                    style="width: 100px; margin-right: 5px;"
                    :minute-step="30"
                    :second-step="60"
                    v-decorator="[
                      'nightStop',
                      {
                        initialValue: str2time(5)
                      }
                    ]"
                  />
                </div>
                <a-switch default-checked :checked="isOvertime" @change="isOvertime = !isOvertime" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-form-item label="备注">
              <a-textarea
                :rows="4"
                v-decorator="[
                  'dayRemark',
                  {
                    initialValue:
                      clickedDaySummary &&
                      clickedDaySummary.ppi_cald_profile &&
                      JSON.parse(clickedDaySummary.ppi_cald_profile).ppi_day_remark
                  }
                ]"
              />
            </a-form-item>
          </a-row>
        </a-form>
      </a-modal>
    </a-drawer>
    <a-spin :spinning="calendarSpinning">
      <a-calendar
        v-model="datePonit"
        :disabled-date="disabledDate"
        :valid-range="validRange"
        @panelChange="handleDateChg"
      >
        <template v-slot:dateCellRender="value">
          <div style="display: flex;" v-html="gendateCellHtml(value)"></div>
        </template>
      </a-calendar>
    </a-spin>
  </div>
</template>

<script>
import moment from 'moment'
import { getCalenderData, getPrdSchdParam, saveCalenderOpt, setWorktime } from '@/api/prod'

const validateFieldsKey = ['morningStart', 'morningStop', 'afternoonStart', 'afternoonStop', 'nightStart', 'nightStop']

export default {
  data () {
    return {
      worktimeRangeSpinning: false,
      calendarSpinning: false,
      isRestDay: false,
      isOvertime: true,
      modalVisible: false,
      showWorktimeSetting: false,
      worktimeRange: '',
      worktimeForm: this.$form.createForm(this, { name: 'worktime' }),
      worktimeForm2: this.$form.createForm(this, { name: 'worktime2' }),
      settingVisible: false,
      datePonit: moment(),
      validRange: [
        moment()
          .add(-1, 'years')
          .endOf('month'),
        moment().endOf('years')
      ],
      calenderData: [],
      clickedDay: null,
      clickedDaySummary: null,
      isUpdate: true,
      opt: {
        A: [],
        U: []
      }
    }
  },
  computed: {
    dailyActionSettingTitle () {
      return `日工作行事设定（${this.clickedDay}）`
    },
    showSetting () {
      const blackApi = JSON.parse(localStorage.getItem('BLACK_API_LIST')) || []
      return !blackApi.find(api => api === '\\prod\\setWorktime')
    }
  },
  methods: {
    /**
     * @description: 将日期字符串转换成 moment 对象
     * @param Number idx
     * @return moment
     */
    str2time (idx) {
      const worktimeRangeArr = []
      this.worktimeRange.split(' | ').forEach(e => {
        if (e) {
          worktimeRangeArr.push(...e.split(' - '))
        }
      })

      const timestr = moment().format('YYYY-MM-DD') + ' ' + worktimeRangeArr[idx]

      return moment(timestr)
    },
    /**
     * @description: 保存全局上下班时间设定
     * @param event e
     * @return void
     */
    handleSubmit (e) {
      e.preventDefault()
      const {
        worktimeForm: { validateFields }
      } = this

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          let timestr = ''
          Object.values(values).forEach((date, idx) => {
            const str = moment(date).format('HH:mm:ss')
            if (idx % 2 === 0) {
              timestr += `${str} - `
            } else {
              timestr += str + ' | '
            }
          })
          timestr = timestr.replace(/ \| $/, '')

          setWorktime(timestr)
            .then(res => {
              if (res.result) {
                this.$notification.success({
                  message: '设定成功',
                  icon: <a-icon type='smile' style='color: #108ee9' />
                })

                this.opt.A = []
                this.opt.U = []
                this.settingVisible = false
                this.handleDateChg(this.datePonit)
                this.getInitData()
              }
            })
            .catch(() => {})
        }
        this.showWorktimeSetting = !this.showWorktimeSetting
      })
    },
    /**
     * @description: 根据行事历设定来显示每天的上下班时间
     * @param moment date
     * @return void
     */
    setWorkDetail (date) {
      const clickedDay = moment(date).format('YYYY-MM-DD')
      this.clickedDay = clickedDay

      const clickedDaySummary = this.calenderData.find(e => e.ppi_cald_date === clickedDay)
      this.isRestDay = false
      if (clickedDaySummary) {
        this.clickedDaySummary = clickedDaySummary
        this.isUpdate = true
        this.$nextTick(() => {
          this.isRestDay = !!clickedDaySummary.ppi_cald_is_rest
          this.isOvertime = !!clickedDaySummary.ppi_cald_is_overtime
        })
      } else {
        this.clickedDaySummary = null
        this.isUpdate = false
      }

      this.modalVisible = true
    },
    handleDrawerClose () {
      this.settingVisible = false
    },
    /**
     * @description: 格式化每天行事历的设定
     * @param moment date
     * @return viod
     */
    gendateCellHtml (date) {
      const fmtDate = moment(date).format('YYYY-MM-DD')
      const daySummary = this.calenderData.find(e => e.ppi_cald_date === fmtDate)
      let html = ''
      if (daySummary) {
        if (daySummary.ppi_cald_week === 7 || !!daySummary.ppi_cald_is_rest) {
          html += '<span style="color: red; font-size: 18px; margin-right: 5px;">休</span>'
        }
        if (daySummary.ppi_cald_profile) {
          // eslint-disable-next-line camelcase
          const { ppi_workday_time_range, ppi_day_remark } = JSON.parse(daySummary.ppi_cald_profile)
          // eslint-disable-next-line camelcase
          ppi_workday_time_range &&
            // eslint-disable-next-line camelcase
            ppi_workday_time_range !== this.worktimeRange &&
            (html += `<span style="color: #faad14;margin-right: 5px;">
                ${ppi_workday_time_range.replace(/ \| /g, '<br>')}
              </span>`)
          // eslint-disable-next-line camelcase
          ppi_day_remark && (html += ppi_day_remark)
        }
      }
      return html
    },
    /**
     * @description: 获取每月的行事历设定
     * @param moment
     * @return void
     */
    async handleDateChg (date) {
      this.calendarSpinning = true
      await getCalenderData(moment(date).format('YYYY/MM'))
        .then(res => res.result && (this.calenderData = res.data))
        .catch(() => {})
      this.calendarSpinning = false
    },
    /**
     * @description: 禁止访问的日期
     * @param moment current
     * @return moment
     */
    disabledDate (current) {
      // 只能选择今年的 ± 2
      return (
        current &&
        (current <
          moment()
            .add(-2, 'years')
            .endOf('year') ||
          current >
            moment()
              .add(2, 'years')
              .endOf('month'))
      )
    },
    /**
     * @description: 获取初始化所需要的数据
     * @return void
     */
    async getInitData () {
      this.worktimeRangeSpinning = true
      await getPrdSchdParam()
        .then(
          res =>
            res.result &&
            (this.worktimeRange = res.data.find(e => e.ppi_extra_key === 'ppi_workday_time_range').ppi_extra_value)
        )
        .catch(() => {})
      this.worktimeRangeSpinning = false
    },
    /**
     * @description: 处理已点击日期的行事历显示和记录其修改
     * @return void
     */
    handleWorkdaySetting () {
      const {
        worktimeForm2: { validateFields },
        isRestDay,
        isOvertime,
        isUpdate,
        clickedDay,
        getYearWeek,
        clickedDaySummary
      } = this
      const [year, month, day] = clickedDay.split('-')
      validateFields([...validateFieldsKey, 'dayRemark'], { force: true }, (err, values) => {
        if (!err) {
          let timestr = ''
          validateFieldsKey.forEach((key, idx) => {
            if (values[key]) {
              const str = moment(values[key]).format('HH:mm:ss')
              if (idx % 2 === 0) {
                timestr += `${str} - `
              } else {
                timestr += str + ' | '
              }
            }
          })
          timestr = timestr.replace(/ \| $/, '')
          const profile = {}
          timestr && timestr !== this.worktimeRange && (profile.ppi_workday_time_range = timestr)
          values['dayRemark'] && (profile.ppi_day_remark = values['dayRemark'])
          if (isUpdate) {
            // eslint-disable-next-line camelcase
            const { id: pkId, ppi_cald_is_rest, ppi_cald_is_overtime, ppi_cald_profile } = clickedDaySummary
            const o = {
              ppi_cald_is_rest: isRestDay ? 1 : 0,
              ppi_cald_is_overtime: isOvertime ? 1 : 0,
              ppi_cald_profile: JSON.stringify(profile)
            }

            // eslint-disable-next-line camelcase
            console.log(o.ppi_cald_profile, ppi_cald_profile)
            if (
              // eslint-disable-next-line camelcase
              o.ppi_cald_is_rest !== ppi_cald_is_rest ||
              // eslint-disable-next-line camelcase
              o.ppi_cald_is_overtime !== ppi_cald_is_overtime ||
              // eslint-disable-next-line camelcase
              o.ppi_cald_profile !== ppi_cald_profile
            ) {
              const existedIdx = this.opt.U.findIndex(e => Object.keys(e)[0] === String(pkId))
              console.log(existedIdx)
              if (existedIdx > -1) {
                this.opt.U[existedIdx] = o
              } else {
                this.opt.U.push({
                  [pkId]: o
                })
              }
            }
          } else {
            const o = {
              ppi_cald_date: clickedDay,
              ppi_cald_year: year,
              ppi_cald_month: month,
              ppi_cald_day: day,
              ppi_cald_week: moment(clickedDay).day(),
              ppi_cald_weekth: getYearWeek(year, month, day),
              ppi_cald_is_rest: isRestDay ? 1 : 0,
              ppi_cald_is_overtime: isOvertime ? 1 : 0,
              // ppi_cald_overtime:
              ppi_cald_profile: JSON.stringify(profile),
              ppi_cald_creator: this.$store.state.user.info.con_id,
              ppi_cald_modifier: this.$store.state.user.info.con_id
            }
            const existedIdx = this.opt.A.findIndex(e => e.ppi_cald_date === clickedDay)
            if (existedIdx > -1) {
              this.opt.A[existedIdx] = o
            } else {
              this.opt.A.push(o)
            }
          }
        }
      })
      this.modalVisible = false
    },
    /**
     * @description: 保存行事历上下班时间设定
     * @return void
     */
    handleSave () {
      saveCalenderOpt(this.opt)
        .then(res => {
          if (res.result) {
            this.opt.A = []
            this.opt.U = []
            this.handleDateChg(this.datePonit)
            this.$notification.success({
              message: '设定成功',
              icon: <a-icon type='smile' style='color: #108ee9' />
            })
          }
        })
        .catch(() => {})
    },
    /**
     * @description: 获取当前日期是这一年的第几周
     * @param String year
     * @param String month
     * @param String day
     * @return Number
     */
    getYearWeek (year, month, day) {
      const date1 = new Date(year, parseInt(month) - 1, day)
      const date2 = new Date(year, 0, 1)
      const d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000)
      return Math.ceil((d + (date2.getDay() + 1 - 1)) / 7)
    }
  },
  created () {
    this.handleDateChg(this.datePonit)
    this.getInitData()
    console.log()
  }
}
</script>
