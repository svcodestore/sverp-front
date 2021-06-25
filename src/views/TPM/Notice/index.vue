<!--
 * @Date: 2020-12-07 10:50:51
 * @LastEditors: yu chen
 * @LastEditTime: 2021-03-02 08:46:03
 * @FilePath: \sverp-front\src\views\TPM\Notice\index.vue
-->
<template>
  <div>
    <vxe-toolbar v-show="false">
      <template v-slot:buttons>
        <vxe-input v-model="filterName" type="search" placeholder="全表搜索"></vxe-input>
        <vxe-button @click="other">其它部门</vxe-button>
      </template>
    </vxe-toolbar>
    <vxe-table v-show="false" :loading="loading" ref="xTree" height="500" :data="list">
      <vxe-table-column field="id" width="100" title="ID" sortable></vxe-table-column>
      <vxe-table-column field="line_num" width="100" title="制造线" sortable> </vxe-table-column>
      <vxe-table-column field="produc_num" width="100" title="工程" sortable> </vxe-table-column>
      <vxe-table-column field="mache_num" width="150" sortable title="设备型号" type="html">
        <template v-slot="{ row }">
          <a @click="showDetailEvent(row)">{{ row.mache_num }}</a>
        </template>
      </vxe-table-column>
      <vxe-table-column
        width="160"
        field="mache_name"
        title="设备名称"
        type="html"
        sortable
        :filters="[
          { label: '分条机', value: '分条机' },
          { label: '压光机', value: '压光机' },
          { label: '上树脂机', value: '上树脂机' },
          { label: '皮带贴合机', value: '平板' },
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
    </vxe-table>
    <vxe-modal v-model="showDetails" title="故障初次判断" width="600" height="400" resize>
      <template v-slot>
        <vxe-select
          v-model="param.cause"
          placeholder="请选择故障原因"
          style="width:400px;display: block;padding:20px 20px;"
        >
          <vxe-option :value="item.value" v-for="item in repair" :key="item.phone" :label="item.name"></vxe-option>
        </vxe-select>
        <vxe-select v-model="param.arr" placeholder="通知给" style="width:290px;padding:20px 20px;" multiple clearable>
          <vxe-option
            v-for="(item, index) in notice"
            :key="index"
            :value="item.notify_phone"
            :label="item.notify_name"
          ></vxe-option>
        </vxe-select>
        <vxe-button status="primary" @click="submitOption(param)">发送短信</vxe-button>
      </template>
    </vxe-modal>
    <div class="department" v-show="showDepartment">
      <vxe-select v-model="content.noticeDepartment" class="depart" placeholder="请选择所在部门" clearable>
        <vxe-option v-for="item in departmentList" :key="item.name" :value="item.name" :label="item.name"></vxe-option>
      </vxe-select>
      <vxe-input
        class="mecheName"
        v-model="content.mecheName"
        type="text"
        placeholder="请输入维修的设备名称"
      ></vxe-input>
      <!-- <vxe-input class="mecheImg" v-model="content.mecheImg" @blur='uplodeFile' type="file" style="padding:3px"></vxe-input>www.sverp.com -->
      <a-upload
        name="avatar"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        action="http://192.168.123.51:9600/webApi/index/apiUpload"
        :before-upload="beforeUpload"
        @change="handleChange"
      >
        <img style="width:100px;height:100px" v-if="imageUrl" :src="imageUrl" alt="avatar" />
        <div v-else style="width:100px;">
          <a-icon :type="loading ? 'loading' : 'plus'" />
          <div style="width:100px;" class="ant-upload-text">
            Upload
          </div>
        </div>
      </a-upload>
      <vxe-select v-model="content.noticeName" class="notice" placeholder="请选择通知人" multiple clearable>
        <vxe-option
          v-for="(item, index) in notice"
          :key="index"
          :value="item.notify_phone"
          :label="item.notify_name"
        ></vxe-option>
      </vxe-select>
      <vxe-input class="mecheCause" v-model="content.cause" clearable placeholder="请输入原因" type="text"></vxe-input>
      <vxe-button style="margin-left:0px" @click="submitContent" class="msg">发送短信</vxe-button>
    </div>
    <div v-show="delay">
      <vxe-select v-model="noticeName" class="notice" placeholder="请选择通知人" clearable>
        <vxe-option
          v-for="(item, index) in notice"
          :key="index"
          :value="item.notify_phone"
          :label="item.notify_name"
        ></vxe-option>
      </vxe-select>
      <vxe-input type="text" v-model="phoneFour" placeholder="请输入到场人手机号后四位"></vxe-input>
      <vxe-button style="margin-right:10px" @click="arrived()">我已到场</vxe-button>
      <span v-show="checkMsg" style="color:red;">验证错误</span>
      <span id="timeOutId" style="color:red;display:none">{{ timeOutMsg }}</span>
    </div>
    <div v-show="fittingShow">
      <vxe-input
        v-model="repairCause"
        class="fitting-public"
        style="width:356px"
        type="text"
        placeholder="请输入维修原因"
      /><br />
      <vxe-input
        v-model="repairMethod"
        class="fitting-public"
        style="width:356px"
        type="text"
        placeholder="请输入处理方法"
      /><br />
      有无消耗配件：<br />
      <vxe-radio @change="fittingName()" name="isrow" content="有"></vxe-radio
      ><vxe-radio @change="fittingArr = null" name="isrow" content="无"></vxe-radio><br />
      <div v-for="(item, index) in fittingArr" style="display:block;margin:10px 0px;" :key="index">
        <span>{{ item.fitting_name }} :</span
        ><input type="number" v-model="fittingNumber[item.id]" style="border-color:rgb(210,210,210);margin:0px 10px;" />
      </div>
      <vxe-button @click="reload">未维修完</vxe-button>
      <vxe-button @click="repairSubmit" style="background:#1890ff;color:white">维修完成</vxe-button>
    </div>
    <div v-show="showPeople">
      <p>通知人员设置：</p>
      <notice-people></notice-people>
    </div>
  </div>
</template>

<script>
import { apiMecheInfo, apiSendMsg, apiCheckCode, apiFitting, apiRepairComp, apiNotify } from '@/api/records'
import XEUtils from 'xe-utils'
import NotifyStaff from '../NotifyStaff/index'
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
var timerSendMsg
export default {
  components: {
    'notice-people': NotifyStaff
  },
  data () {
    return {
      showPeople: true,
      timeOutMsg: '',
      fittingNumber: [],
      fittingShow: false,
      repairCause: null,
      repairMethod: null,
      fittingArr: {},
      cateArr: ['维修', '保养', '调试'],
      checkMsg: false,
      content: {
        noticeName: [],
        noticeDepartment: null,
        cause: null,
        mecheName: null,
        mecheImg: []
      },
      showSearch: true,
      delay: false,
      departmentList: [
        { name: '财务部' },
        { name: '业务部' },
        { name: 'TPM' },
        { name: '研发部' },
        { name: '采购部' },
        { name: '物管部' },
        { name: '生管部' },
        { name: '人资部' },
        { name: '行政部' }
      ],
      phoneFour: null,
      noticeName: [],
      noticeDepartment: null,
      showDepartment: false,
      show: true,
      loading: false,
      imageUrl: '',
      param: [
        {
          arr: [],
          cause: null,
          row: null,
          cate: null
        }
      ],
      notice: [],
      repair: [
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
      filterName: '',
      showDetails: false,
      selectRow: null,
      isAllChecked: false,
      isIndeterminate: false,
      selectRecords: [],
      tableData: []
    }
  },
  created () {
    this.refreshTable()
    this.noticePeople()
    //  this.tableData = window.MOCK_TREE_DATA_LIST
  },
  methods: {
    reload () {
      this.show = false
      this.delay = false
      this.fittingShow = true
      this.showPeople = true
      this.refreshTable()
    },
    async refreshTable () {
      this.loading = true
      await apiMecheInfo()
        .then(result => {
          if (result.code === 0) {
            this.tableData = result.result
            if (result.length < 1024 * 1024 * 1) {
              localStorage.setItem('data', JSON.stringify(result.result))
            }
          }
        })
        .catch(() => {})
      this.loading = false
    },
    showDetailEvent (row) {
      this.param.row = row
      this.selectRow = row
      this.showDetails = true
    },
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
      if (repair.indexOf(this.param.cause) > -1) {
        this.param.cate = '维修'
      }
      if (maintenance.indexOf(this.param.cause) > -1) {
        this.param.cate = '保养'
      }
      if (debug.indexOf(this.param.cause) > -1) {
        this.param.cate = '调试'
      }
      this.showPeople = false
      await apiSendMsg(e)
        .then(result => {
          if (result.code === 0) {
            localStorage.setItem('sid', JSON.stringify(result.id))
            this.showDetails = false
            this.show = false
            this.showDepartment = false
            this.showSearch = false
            this.delay = true
            var self = this
            const dateTime = Date.parse(new Date()) / 1000 + 900
            document.getElementById('timeOutId').style.display = 'inline'
            timerSendMsg = setInterval(function () {
              const param = self.param
              const nowTime = Date.parse(new Date()) / 1000
              if (dateTime > nowTime) {
                self.timeOutMsg = dateTime - nowTime
              } else {
                self.timeOutMsg = '对不起，您15分钟内未到达现场'
                clearInterval(timerSendMsg)
                apiSendMsg(param)
                  .then(result => {
                    console.log('已发出请求')
                    if (result.code === 0) {
                      console.log('第二条短信发送成功')
                    }
                  })
                  .catch(() => {})
              }
            }, 1000)
            // setTimeout(function () {
            //   const param = self.param
            //   document.getElementById('timeOutId').style.display = 'inline'
            //   apiSendMsg(param)
            //     .then(result => {
            //       console.log('已发出请求')
            //       if (result.code === 0) {
            //         console.log('第二条短信发送成功')
            //       }
            //     })
            //     .catch(() => {})
            // }, 900000)
          }
        })
        .catch(() => {})
      this.loading = false
    },
    // addOneMsg () {
    //   const timer = setInterval(function (e) {
    //     document.getElementById('timeOutId').style.display = 'inline'
    //     apiSendMsg(e)
    //       .then(result => {
    //         if (result.code === 0) {
    //           console.log('第二条短信发送成功')
    //         }
    //       })
    //       .catch(() => {})
    //     clearInterval(timer)
    //   }, 5000)
    // },
    async submitContent () {
      this.content.mecheImg = localStorage.getItem('imgUrl')
      const content = this.content
      this.loading = true
      await apiSendMsg(content)
        .then(result => {
          if (result.code === 0) {
            this.show = true
            this.showDepartment = false
          }
        })
        .catch(() => {})
      this.loading = false
    },
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl
          this.loading = false
        })
      }
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt4M = file.size / 1024 / 1024 < 4
      if (!isLt4M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJpgOrPng && isLt4M
    },
    other () {
      this.show = !this.show
      this.showDepartment = !this.showDepartment
    },
    async arrived () {
      this.showPeople = false
      this.checkMsg = false
      const phone = this.noticeName
      const phoneFour = this.phoneFour
      const newPhone = phone.substring(7, 11)
      const id = localStorage.getItem('sid')
      this.loading = true
      if (phoneFour !== newPhone) {
        this.checkMsg = true
      } else {
        clearInterval(timerSendMsg)
        await apiCheckCode({ id, phone, phoneFour })
          .then(result => {
            if (result.code === 0) {
              this.show = false
              this.delay = false
              this.fittingShow = true
            } else {
              console.log(result)
            }
          })
          .catch(() => {})
        this.loading = false
      }
    },
    async fittingName () {
      await apiFitting()
        .then(result => {
          if (result.code === 0) {
            this.fittingArr = result.result
          }
        })
        .catch(() => {})
    },
    async repairSubmit () {
      const content = this.repairCause
      const action = this.repairMethod
      const number = this.fittingNumber
      const id = localStorage.getItem('sid')
      await apiRepairComp({ id, content, action, number })
        .then(result => {
          if (result.code === 0) {
            this.showPeople = true
            this.show = true
            this.delay = false
            this.fittingShow = false
          } else {
            console.log(result.msg)
          }
        })
        .catch(() => {})
    },
    async noticePeople () {
      await apiNotify()
        .then(result => {
          if (result.code === 0) {
            this.notice = result.result
          }
        })
        .catch(() => {})
    }
  },
  computed: {
    list () {
      const filterName = XEUtils.toString(this.filterName)
        .trim()
        .toLowerCase()
      if (filterName) {
        const filterRE = new RegExp(filterName, 'gi')
        const options = { children: 'children' }
        const searchProps = ['id', 'mache_name', 'mache_num', 'produc_num', 'line_num']
        const rest = XEUtils.searchTree(
          this.tableData,
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
      return this.tableData
    }
  }
}
</script>
<style>
.department {
  background: white;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.department div {
  width: 300px;
  margin: 5px 0;
}
.mecheCause {
  padding: 0px;
  margin: 0px;
}
.msg {
  width: 100px;
  background: #1890ff;
}
.msg span {
  color: white;
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.fitting {
  width: 176px;
  height: 130px;
}
.fitting-public {
  margin: 10px 0px;
}
</style>
