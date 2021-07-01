<!--
 * @Date: 2021-04-13 09:50:11
 * @LastEditors: Mok.CH
 * @LastEditTime: 2021-07-01 15:34:04
 * @FilePath: \sverp-front\src\views\TPM\QADD\index.vue
-->
<template>
  <div>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <div class="repair_png">
        <img src="./img/repair.png" />
      </div>
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item
          :label="$t('设备名称')"
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
        >
          <a-row :gutter="8">
            <a-col :span="rowSpan">
              <a-input v-model="content.macheName" width="80%" :placeholder="$t('要报修的是什么设备？')" />
            </a-col>
            <a-col :span="2">
              <a-popover>
                <template slot="content">
                  <p>点击快速查找设备</p>
                </template>
                <a-button type="primary" shape="circle" icon="search" @click="showSearch" />
              </a-popover>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item
          :label="$t('设备编号')"
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
          :required="false"
        >
          <a-row>
            <a-col :span="rowSpan">
              <a-input v-model="content.macheNum" @change="toUpCase" :placeholder="$t('如有设备编号，请填写')" />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item
          :label="$t('故障描述')"
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
        >
          <a-row :gutter="8">
            <a-col :span="rowSpan">
              <a-textarea rows="4" :placeholder="$t('请描述发生的故障...')" v-model="content.cause" />
            </a-col>
            <a-col :span="2">
              <a-popover>
                <template slot="content">
                  <p>点击快速选择常用故障</p>
                </template>
                <a-button type="primary" shape="circle" icon="unordered-list" @click="showCause" />
              </a-popover>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item
          label="部门"
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
        >
          <a-row :gutter="8">
            <a-col :span="rowSpan">
              <a-input :placeholder="$t('部门(选填)')" v-model="content.noticeDepartment" />
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item
          :label="$t('地点')"
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
          :required="false"
        >
          <a-row>
            <a-col :span="rowSpan">
              <a-input :placeholder="$t('设备地点(选填)')" v-model="content.address" />
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item
          label="通知维修人"
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
          required
        >
          <vxe-select v-model="content.arr" class="notice" placeholder="请选择通知人" clearable multiple>
            <vxe-option
              v-for="(item, index) in notifyPeople"
              :key="index"
              :value="item.notify_phone"
              :label="item.notify_name"
            ></vxe-option>
          </vxe-select>
        </a-form-item>

        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button htmlType="submit" type="primary">{{ $t('快速报修') }}</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <a-modal v-model="showSearchModal" title="选择设备" :footer="null" width="auto" :dialogStyle="dialogStyle">
      <vxe-toolbar>
        <template v-slot:buttons>
          <vxe-input v-model="filterName" type="search" placeholder="全表搜索"></vxe-input>
        </template>
      </vxe-toolbar>
      <vxe-table :loading="loading" ref="xTree" :data="macheineList" keep-source auto-resize>
        <vxe-table-column field="line_num" title="制造线" sortable width="50" v-if="!isMobile"></vxe-table-column>
        <vxe-table-column field="produc_num" title="工程" sortable width="90" v-if="!isMobile"></vxe-table-column>
        <vxe-table-column field="mache_num" sortable title="设备编号" width="90"></vxe-table-column>
        <vxe-table-column
          field="mache_name"
          title="设备名称"
          type="html"
          sortable
          :filters="[
            { label: '分条机', value: '分条机' },
            { label: '压光机', value: '压光机' },
            { label: '上树脂机', value: '上树脂机' },
            { label: '皮带贴合机', value: '皮带贴合机' },
            { label: 'DY车', value: 'DY车' },
            { label: '磨边机', value: '磨边机' },
            { label: '双头冲床', value: '双头冲床' },
            { label: '智能打钉机', value: '智能打钉机' },
            { label: '电脑车', value: '电脑车' },
            { label: '平面折边机', value: '平面折边机' },
            { label: '电脑', value: '电脑' },
            { label: '自动复合裁断机', value: '自动复合裁断机' },
            { label: '热压线折边机', value: '热压线折边机' },
            { label: '烘线机', value: '烘线机' }
          ]"
        ></vxe-table-column>
        <vxe-table-column filed="id" title="选择设备" type="html" width="90">
          <template v-slot="{ row }">
            <a-button @click="choiceMacheine(row)" type="primary">选择</a-button>
          </template>
        </vxe-table-column>
      </vxe-table>
    </a-modal>

    <a-modal v-model="showCauseModal" title="常见故障" :footer="null" :dialogStyle="dialogStyle">
      <vxe-table rel="xTree" :data="commonCauses" keep-source auto-resize show-overflow="false">
        <vxe-table-column field="value" title="常见故障"></vxe-table-column>
        <vxe-table-column field="name" title="快捷选择" type="html" width="60">
          <template v-slot="{ row }">
            <a-button @click="selectCause(row)" type="primary" size="small">选择</a-button>
          </template>
        </vxe-table-column>
      </vxe-table>
    </a-modal>
  </div>
</template>

<script>
import { apiNotify, apiMecheInfo, apiSendMsg, apiQuickReport } from '@/api/records'
import NotifyStaff from '../NotifyStaff/index'
import XEUtils from 'xe-utils'
import { deviceMixin } from '@/store/device-mixin'

export default {
  mixins: [deviceMixin],
  components: {
    'notice-people': NotifyStaff
  },
  data () {
    return {
      form: this.$form.createForm(this),
      repairTypeOptions: ['机械设备报修', '其它报障'],
      defaultRepairType: '其它报障',
      repairType: '其它保障',
      content: {
        arr: [],
        noticeName: [],
        noticeDepartment: null,
        cause: null,
        macheName: null,
        macheNum: null,
        reporterConId: null,
        reporterName: null,
        mecheImg: [],
        address: null,
        cate: null
      },
      param: {
        arr: [],
        cause: null,
        row: null,
        cate: null,
        reporterConId: null,
        reporterName: null
      },
      selectRow: null,
      notifyPeople: [],
      showSearchModal: false,
      showCauseModal: false,
      filterName: '',
      loading: false,
      macheTableData: [],
      rowSpan: 22,
      delay: false,
      selectedCommonCause: '',
      commonCauses: [
        { value: '电源(无法开机,断电,接电源)', name: '电源(无法开机,断电,接电源)' },
        { value: '马达(马达烧掉,有异响)', name: '马达(马达烧掉,有异响)' },
        { value: '油封(高压油管漏油,压力不足)', name: '油封(高压油管漏油,压力不足)' },
        { value: '气压(气管漏气,气压不足)', name: '气压(气管漏气,气压不足)' },
        { value: '针车(针车调车,梭床走位,断线,跳针,烂线)', name: '针车(针车调车,梭床走位,断线,跳针,烂线)' },
        { value: '换配件(捅皮机削边机换刀,其他设备换配件)', name: '换配件(捅皮机削边机换刀,其他设备换配件)' },
        { value: '定位(XY轴走位,火力、效能不足)', name: '定位(XY轴走位,火力、效能不足)' },
        { value: '喷枪(喷不出胶水,气压不足)(控制异常,程式乱码)', name: '电脑触屏(控制异常,程式乱码)' },
        { value: '喷不出胶水', name: '喷枪(喷不出胶水,气压不足)' },
        { value: '其他(辅助设备故障)', name: '其他(辅助设备故障)' },
        { value: '不在上面选项中', name: '其他(不在上面选项中)' },
        { value: '压脚提升调整', name: '压脚提升调整' },
        { value: '配件的更换', name: '配件的更换' },
        {
          value: '压脚调整，伸缩长度力度行程高低及压脚大小斜度，车货顺畅度调整',
          name: '压脚调整，伸缩长度力度行程高低及压脚大小斜度，车货顺畅度调整'
        },
        {
          value: '压脚、针、针板、牙齿、选择与更换配合，不同物料及加工要求调整',
          name: '压脚、针、针板、牙齿、选择与更换配合，不同物料及加工要求调整'
        },
        { value: '针车的调整更换、如：双针车', name: '针车的调整更换、如：双针车' },
        {
          value: '高车、包边筒的调整与修改、根据不同规格的包边条，以及不同订单的包边要求进行调整',
          name: '高车、包边筒的调整与修改、根据不同规格的包边条，以及不同订单的包边要求进行调整'
        },
        { value: '梭床调整、厚料、薄料、针的选择', name: '梭床调整、厚料、薄料、针的选择' },
        { value: '挑线弹簧、铁牙、胶牙齿的更换、调整', name: '挑线弹簧、铁牙、胶牙齿的更换、调整' },
        {
          value: '粗线、细线、油腊线、鱼丝线、梭床的选择与更换调整',
          name: '粗线、细线、油腊线、鱼丝线、梭床的选择与更换调整'
        },
        { value: '特种样板，或特种要求的单与特种针车的效果调试', name: '特种样板，或特种要求的单与特种针车的效果调试' },
        { value: '针杆更换、皮带更换', name: '针杆更换、皮带更换' },
        {
          value: '跳线、烂线：梭床被针打花，针板有毛刺、针有问题，梭床损坏、针杆深浅度',
          name: '跳线、烂线：梭床被针打花，针板有毛刺、针有问题，梭床损坏、针杆深浅度'
        },
        { value: '操作不当、或选择针线过粗、胶水过多', name: '操作不当、或选择针线过粗、胶水过多' },
        { value: '夹线器损坏、梭壳故障，底面线松紧调节不一致', name: '夹线器损坏、梭壳故障，底面线松紧调节不一致' },
        {
          value: '牙齿没安装正确，压脚没调好，没保养清洁加油、皮带轮卡线',
          name: '牙齿没安装正确，压脚没调好，没保养清洁加油、皮带轮卡线'
        },
        {
          value: '死机、如压脚过低导致主马达死机，机箱散热风扇故障',
          name: '死机、如压脚过低导致主马达死机，机箱散热风扇故障'
        },
        { value: '数据无法录入', name: '数据无法录入' },
        { value: '自动断网', name: '自动断网' },
        { value: '无法开机', name: '无法开机' },
        { value: '程序自动退出', name: '程序自动退出' },
        { value: '死机', name: '死机' },
        { value: '自动关机', name: '自动关机' }
      ],
      modalFullScreen: true,
      dialogStyle: {
        top: '30px'
      }
    }
  },
  methods: {
    // handler
    handleSubmit (e) {
      e.preventDefault()
      this.content.reporterConId = this.$store.state.user.info.con_id
      this.content.reporterName = this.$store.state.user.info.con_name

      if (this.content.arr.length === 0) {
        this.$message.error('请选择要通知的维修人!')
        return
      }

      apiQuickReport(this.content).then(res => {
        this.$router.push({ path: '/tpm/myreports' })
      })
    },
    choiceMacheine (row) {
      this.content.macheName = row.mache_name
      this.content.macheNum = row.mache_num
      this.showSearchModal = false
      this.param.row = row
    },
    async getNotifyPeople () {
      await apiNotify()
        .then(result => {
          if (result.code === 0) {
            this.notifyPeople = result.result
          }
        })
        .catch(() => {})
    },
    showSearch () {
      this.showSearchModal = !this.showSearchModal
    },
    showCause () {
      this.showCauseModal = !this.showCauseModal
    },
    selectCause (row) {
      if (this.content.cause != null) {
        this.content.cause = [this.content.cause, row.value].join(',')
      } else {
        this.content.cause = XEUtils.clone(row.value, true)
      }
      this.showCauseModal = false
    },
    // 原功能，其它部门维修，直接发送信息到维修人
    async submitContent () {
      // this.content.mecheImg = localStorage.getItem('imgUrl')
      const content = this.content
      this.loading = true
      await apiSendMsg(content)
        .then(result => {
          if (result.code === 0) {
            // 原功能提交完成后直接 返回 第一界面
            // this.show = true
            // this.showDepartment = false
            this.$message.success('维修信息已发送')
          } else {
            this.$message.error('信息发送失败')
          }
        })
        .catch(() => {})
      this.loading = false
    },
    // 原功能， 机械维修，
    async submitOption (e) {
      this.loading = true
      const repair = [
        '电源(无法开机,断电,接电源)',
        '马达(马达烧掉,有异响)',
        '油封(高压油管漏油,压力不足)',
        '气压(气管漏气,气压不足)',
        '针车(针车调车,梭床走位,断线,跳针,烂线)',
        '换配件(捅皮机削边机换刀,其他设备换配件)',
        '定位(XY轴走位,火力、效能不足)',
        '喷枪(喷不出胶水,气压不足)(控制异常,程式乱码)',
        '喷枪(喷不出胶水,气压不足)',
        '其他(辅助设备故障)',
        '死机、如压脚过低导致主马达死机，机箱散热风扇故障',
        '数据无法录入',
        '自动断网',
        '无法开机',
        '程序自动退出',
        '死机',
        '自动关机',
        '不在上面选项中'
      ]
      const maintenance = [
        '梭床调整、厚料、薄料、针的选择',
        '压脚提升调整',
        '配件的更换',
        '牙齿没安装正确，压脚没调好，没保养清洁加油、皮带轮卡线'
      ]
      const debug = [
        '操作不当、或选择针线过粗、胶水过多',
        '粗线、细线、油腊线、鱼丝线、梭床的选择与更换调整',
        '特种样板，或特种要求的单与特种针车的效果调试',
        '压脚、针、针板、牙齿、选择与更换配合，不同物料及加工要求调整',
        '针车的调整更换、如：双针车',
        '高车、包边筒的调整与修改、根据不同规格的包边条，以及不同订单的包边要求进行调整',
        '压脚调整，伸缩长度力度行程高低及压脚大小斜度，车货顺畅度调整',
        '跳线、烂线：梭床被针打花，针板有毛刺、针有问题，梭床损坏、针杆深浅度'
      ]
      // 修改与原代码顺序相反， 以保证更高级别的维护信息被记录
      this.param.cate = '维修'
      if (debug.indexOf(this.param.cause) > -1) {
        this.param.cate = '调试'
      }
      if (maintenance.indexOf(this.param.cause) > -1) {
        this.param.cate = '保养'
      }
      if (repair.indexOf(this.param.cause) > -1) {
        this.param.cate = '维修'
      }
      // this.showPeople = false
      await apiSendMsg(e)
        .then(result => {
          if (result.code === 0) {
            localStorage.setItem('sid', JSON.stringify(result.id))
            this.showDetails = false
            this.show = false
            this.showDepartment = false
            this.showSearch = false
            this.delay = true
          }
        })
        .catch(() => {})
      this.loading = false
    },

    async refreshTable () {
      this.loading = true
      await apiMecheInfo()
        .then(result => {
          if (result.code === 0) {
            this.macheTableData = result.result
            if (result.length < 1024 * 1024 * 1) {
              localStorage.setItem('data', JSON.stringify(result.result))
            }
          }
        })
        .catch(() => {})
      this.loading = false
    },
    toUpCase (e) {
      this.content.macheNum = e.target.value.toUpperCase()
    }
  },
  computed: {
    macheineList () {
      const filterName = XEUtils.toString(this.filterName)
        .trim()
        .toLowerCase()
      if (filterName) {
        const filterRE = new RegExp(filterName, 'gi')
        const options = { children: 'children' }
        const searchProps = ['id', 'mache_name', 'mache_num', 'produc_num', 'line_num']
        const rest = XEUtils.searchTree(
          this.macheTableData,
          item =>
            searchProps.some(
              key =>
                XEUtils.toString(item[key])
                  .toLowerCase()
                  .indexOf(filterName) > -1
            ),
          options
        )
        XEUtils.eachTree(
          rest,
          item => {
            searchProps.forEach(key => {
              item[key] = XEUtils.toString(item[key]).replace(filterRE, match => `${match}`)
            })
          },
          options
        )
        // 搜索之后默认展开所有子节点
        this.$nextTick(() => {
          this.$refs.xTree.setAllTreeExpand(true)
        })
        return rest
      }
      return this.macheTableData
    }
  },
  created () {
    this.getNotifyPeople()
    this.refreshTable()
  }
}
</script>

<style scoped>
.repair_png {
  height: 150px;
  text-align: center;
  margin: 0 auto;
}

.repair_png img {
  height: 100px;
}

.ant-modal {
  top: 10px !important;
}
</style>
