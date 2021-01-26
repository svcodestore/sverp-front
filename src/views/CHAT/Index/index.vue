<!--
 * @Date: 2020-12-30 15:09:50
 * @LastEditors: yu chen
 * @LastEditTime: 2021-01-25 08:51:07
 * @FilePath: \sverp-front\src\views\CHAT\Index\index.vue
-->
<template>
  <div>
    <div class="box-chat">
      <div class="box-left"></div>
      <ul class="box-content" id="userList" style="line-style:none">
        <li @click="userName(item)" v-for="(item, index) in this.$store.state.userLists" :key="index">
          <div class="box-content-left">
            <img
              style="width:100%"
              src="http://5b0988e595225.cdn.sohucs.com/images/20190324/26b14ff8956b4661a456a7e6751ce085.jpeg"
              alt=""
            />
          </div>
          <div class="box-content-right">
            <p class="box-content-content-left">{{ item }}</p>
            <p class="box-content-content-right">
              人生只有一次，何不放手一次大胆的选择
            </p>
          </div>
        </li>
      </ul>
      <div class="box-right">
        <div class="box-right-header" :v-model="name">{{ name }}</div>
        <div class="box-right-center">
          <ul id="ul"></ul>
        </div>
        <div class="box-right-footer">
          <div class="box-right-footer-fast">
            <img src="../../../assets/bq.png" />
            <img src="../../../assets/wj.png" />
            <img src="../../../assets/jd.png" />
            <img src="../../../assets/qp.png" />
          </div>
          <textarea v-model="list" class="box-right-footer-center"></textarea>
          <button @click="sendMsg" class="box-right-footer-footer">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { apiSendMsg } from '@/api/chat'
export default {
  data () {
    return {
      name: '',
      list: null,
      uid: null,
      to_uid: null,
      group_id: null,
      to_group_id: null,
      type: 'all',
      sayMsg: null
    }
  },
  methods: {
    userCount () {
      setInterval(function () {
        const li = document.getElementById('ul')
        this.sayMsg = localStorage.getItem('responMsg')
        if (this.sayMsg !== localStorage.getItem('tmpMsg') && this.sayMsg !== null) {
          li.innerHTML +=
            '<li class="box-say-left"><div class="box-img"><img  src="http://5b0988e595225.cdn.sohucs.com/images/20190324/26b14ff8956b4661a456a7e6751ce085.jpeg"  style="width:100%"  alt="" /></div><div class="say-left">' +
            this.sayMsg +
            '</div></li>'
          localStorage.setItem('tmpMsg', this.sayMsg)
        }
      }, 1000)
      // this.userList = JSON.parse(localStorage.getItem('userList'))
    },
    userName (index) {
      this.name = index.replace('"', '').replace('"', '')
      this.to_uid = this.name
      this.type = 'say'
    },
    async sendMsg () {
      const content = this.list
      const li = document.getElementById('ul')
      const clientName = localStorage.getItem('userid')
      const id = localStorage.getItem('id')
      let param = {}
      if (content !== null && clientName !== null && id !== null) {
        if (this.type === 'say') {
          if (this.to_uid !== null) {
            param = { to_uid: this.name, content: content, type: this.type }
          } else {
            param = { to_group_id: this.to_group_id, content: content, type: this.type }
          }
        } else {
          param = { content: content, type: this.type }
        }
        li.innerHTML +=
          '<li class="box-say-right"><div class="box-img"><img src="http://5b0988e595225.cdn.sohucs.com/images/20190324/26b14ff8956b4661a456a7e6751ce085.jpeg" style="width:100%" alt=""/></div><div class="say-right">' +
          this.list +
          '</div></li>'
        console.log(param)
        await apiSendMsg(param)
          .then(result => {
            if (result.code === 0) {
              this.list = ''
              console.log('success')
            } else {
              console.log('error')
            }
          })
          .catch(() => {})
      } else {
        console.log('非法请求')
      }
    }
  },
  created () {
    this.userCount()
  }
}
</script>
<style>
.box-chat {
  display: flex;
  width: 100%;
  height: 600px;
  background: white;
  flex-direction: row;
}
.box-left {
  flex: 0.3;
  background: rgb(44, 44, 47);
}
.box-content {
  flex: 1;
  background: rgb(203, 210, 206);
  margin: 0px;
  padding: 0px;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
.box-content li {
  padding: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  cursor: pointer;
}
.box-content :hover {
  background: white;
}
.box-content-left {
  padding: 10px 5px;
  flex: 1;
}
.box-content-left img {
  border-radius: 11%;
}
.box-content-right {
  padding: 5px;
  flex: 3;
}
.box-content-content-left {
  font-weight: bold;
  padding: 0px;
  margin: 0px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.box-content-content-right {
  font-size: 6px;
  padding: 0px;
  margin: 0px;
  color: #1890ff;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.box-right {
  flex: 3;
  background: white;
  display: flex;
  flex-direction: column;
}
.box-right-header {
  background: white;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 0.7;
  color: black;
  font-size: 18px;
  text-align: center;
  font-weight: bold;
  line-height: 50px;
  border-bottom: 1px solid #d6c8c8;
  padding: 10px;
}
.box-right-center {
  flex: 6;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  border-bottom: 1px solid #d6c8c8;
  padding: 10px;
  background: white;
}
.box-right-center ul {
  margin: 0px;
  padding: 0px;
  list-style: none;
}
.box-right-center ul li {
  width: 100%;
  display: block;
  clear: both;
  position: relative;
  padding: 10px 0;
}
.box-say-left {
  width: 100%;
  min-height: 30px;
}
.box-say-right {
  width: 100%;
  min-height: 30px;
}
.box-img {
  width: 30px;
}
.box-img img {
  border-radius: 5px;
}
.say-left {
  min-height: 30px;
  background: rgb(203, 210, 206);
  padding: 10px;
  border-radius: 7px;
  margin: 0 10px;
  z-index: 1;
  max-width: 40%;
  word-break: break-all;
  word-wrap: break-word;
  line-height: 24px;
}
.say-left::before {
  content: '';
  width: 0;
  height: 0;
  border: 7px solid transparent;
  border-right-color: rgb(203, 210, 206);
  position: absolute;
  left: 27px;
  top: 24px;
}

.say-right {
  padding: 10px;
  min-height: 30px;
  background: rgb(158, 236, 106);
  border-radius: 7px;
  margin: 0 10px;
  max-width: 40%;
  word-break: break-all;
  word-wrap: break-word;
  line-height: 24px;
}
.box-say-left div {
  float: left;
}
.box-say-right div {
  float: right;
}
.box-right-footer {
  flex: 3;
  padding: 10px;
  background: white;
}

.box-right-footer-fast {
  height: 43px;
  width: 100%;
}
.box-right-footer-center {
  width: 100%;
  height: 90px;
  margin: 0px;
  padding: 10px;
  overflow-y: scroll;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
.box-right-footer-footer {
  background: #1890ff;
  border: none;
  border-radius: 5px;
  float: right;
  color: white;
  cursor: pointer;
  width: 63px;
  height: 30px;
}
.box-right-footer-fast img {
  padding: 5px;
  width: 40px;
  float: left;
  display: block;
}
</style>
