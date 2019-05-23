<template>
  <div class="regis">
    <div class="re-head">
      <m-logo/>
      <div class="tologin">
        <span>已有账号？去登录</span>
        <router-link to="/login">登录</router-link>
      </div>
    </div>
    <div class="re-content">
      <form action="" @submit.prevent="submit">
        <div class="form-field">
          <label for="username">用户名</label>
          <input type="text" name="username" id="username" @blur="checkName" v-model="name">
          <span>{{nameText}}</span>
        </div>
        <div class="form-field">
          <label for="tel">手机号</label>
          <input type="text" name="tel" id="tel" v-model="tel" >
        </div>
        <div class="form-field send">
          <input type="button"  v-model='sendbtnText' class="send-btn tel" :class="{'btn-gray': !isSendcode}" @click="sendTel" :disabled="!isSendcode">
          <input type="text" name="msg" id="msg" placeholder="输入动态码" @blur="checkCode" v-model="msg">
          <span>{{msgText}}</span>
        </div>
          <span class="tishi">{{tishi}}</span>
        <div class="form-field">
          <label for="pwd">输入密码</label>
          <input type="password" name="pwd" id="pwd" @blur="checkPwd" v-model="pwd">
          <span>{{pwdText}}</span>
        </div>
        <div class="form-field">
          <label for="repwd">确认密码</label>
          <input type="password" name="repwd" id="repwd" @blur="checkRepwd" v-model="repwd">
          <span>{{repwdText}}</span>
        </div>
        <button class="sub-btn" @click="onSubmit">注册</button>
      </form>
    </div>
    <m-footer/>
  </div>
</template>

<script>
import mLogo from '@/components/public/header/logo.vue' 
import mFooter from '@/components/public/footer/index.vue'
import utils from '@/assets/js/utils.js'
require('@/assets/style/regis.css')

  export default {
    components: {
      mLogo,
      mFooter
    },
    data() {
      return {
        tel: '',
        name: '',
        msg: '',
        pwd: '',
        repwd: '',
        isSendcode: true,
        sendbtnText: '获取动态码',
        tishi: '',
        nameText: '',
        msgText: '',
        pwdText: '',
        repwdText: '',
        iserr1: true,
        iserr2: true,
        iserr3: true,
        iserr4: true,
      }
    },
    watch: {
      '$router': function() {
        this.init()
      }
    },
    methods: {
      init() {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
        this.tel = ''
        this.name = ''
        this.pwd = ''
        this.repwd = ''
        this.msg = ''
      },
      submit() {
        return false
      },
      trim(str) {
        const empty = /\s+/g
         return str.replace(empty, '')
      },
      sendTel() {
        var vm = this
        let data = {
          tel: this.tel
        }
        const telNum = /\d{11}/
        if(this.trim(data.tel) === '' || !telNum.test(data.tel)) {
          alert('请输入正确的手机号！')
          return false
        }
        this.$axios({
          method: "post", 
          url: '/sendsms',
          data: data
        }).then(function(res) {
          window.console.log(res)
          let {code, msg} = res.data
            if(code === 1 && res.status === 200) {
              vm.tishi = msg
              let time = 90, unit = '秒'
              vm.sendbtnText = time + unit
              vm.isSendcode = false
              window.clearInterval(timer)
              var timer = window.setInterval(function() {
                let text = ''
                time--
                if(time > 0) {
                  vm.sendbtnText = time + unit
                } else {
                  text = '重新发送'
                  vm.isSendcode = true
                  window.clearInterval(timer)
                  vm.sendbtnText = text
                }
              }, 1000)
            } else {
              vm.tishi = msg
              return
            }
          })
          .catch(function(error) {
            vm.tishi = "验证码发送失败"
            window.console.error(error)
            return
          })
      },
      checkName() {
        const re = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
        if(this.name.length === 0) {
          this.iserr1 = true
          this.nameText = ' * 用户名不为空！'
        } else if(!re.test(this.name)){
          this.iserr1 = true
          this.nameText = ' * 用户名不应有特殊字符！'
        } else {
          this.iserr1 = false
          this.nameText = ''
        }
      },
      checkCode() {
        if(this.msg.length === 0) {
          this.iserr2 = true
          this.msgText = ' * 验证码不为空！'
        } else if(this.msg.length != 6) {
          this.iserr2 = true
          this.msgText = ' * 验证码是六位！'
        } else {
          this.iserr2 = false
          this.msgText = ''
        }
      },
      checkPwd() {
        if(this.pwd.length === 0 || this.pwd.length < 6) {
          this.iserr3 = true
          this.pwdText = ' * 密码至少要有六位！'
        } else {
          this.iserr3 = false
          this.pwdText = ''
        }
      },
      checkRepwd() {
         if(this.repwd != this.pwd || this.repwd.length < 6) {
          this.iserr4 = true
          this.repwdText = ' * 密码错误！请重新输入'
          document.getElementById('repwd').value = ''
        } else {
          this.iserr4 = false
          this.repwdText = ''
        }
      },
      onSubmit() {
        const enpwd = utils.encrypto(this.pwd)
        const enrepwd = utils.encrypto(this.repwd)
        if(enpwd != enrepwd) {
          alert('两次输入的密码不一致！请重新输入')
          document.getElementById('repwd').value = ''
          return;
        } 
        if(!this.iserr1 && !this.iserr2 && !this.iserr3 && !this.iserr4) {
          this.$axios({
            method: 'post',
            url: '/user/register',
            data: {
              name: this.name,
              tel: this.tel,
              code: this.msg,
              pwd: enpwd
            }
          }).then(res => {
            window.console.log(res)
            if(res.data.code === 1) {
              alert(res.data.msg)
              this.$router.push({path: '/login'})
            } else {
              alert(res.data.msg)
              return
            }
          })
        } else {
          alert('请确定你的填写是否都符合要求！')
          return;
        }
      }
    }
  }
</script>

<style scoped>

  .regis {
    min-width: 1000px;
  }
</style>