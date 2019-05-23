<template>
  <div class="login">
    <div class="login-body">
    <div class="left">
      <m-logo/>
      <img src="@/assets/images/login.png" alt="">
    </div>
    <div class="right login-box" :class="{'forget': isforget}">
      <span class="tishi" :style="{'visibility': ishidden}">{{tishi}}</span>
      <template v-if="!isforget">
        <div class="box">用户登录</div>
          <form @submit.prevent="submit">
          <div class="form-field">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#el-icon-shouji"></use>
            </svg>
            <input type="tel" name="tel" id="tel" placeholder="输入手机号" v-model="tel">
          </div>
          <div class="form-field">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#el-icon-password"></use>
            </svg>
            <input type="password" name="pwd" id="pwd" placeholder="输入密码" v-model="pwd">
          </div>
          <p class="forget"><button @click="forget">忘记密码？</button></p> 
          <button value="登 录" class="login-btn" @click="onSubmit">登 录</button>
          <p>还没有账号？<router-link to="/register">立即注册</router-link></p>
        </form>
      </template>
      <template v-else>
        <div class="box">找回密码
          <button @click="login">返回登录</button>
        </div>
        <form @submit.prevent="submit" class="login-box">
        <div class="form-field">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#el-icon-shouji"></use>
          </svg>
          <input type="tel" name="tel" id="tel" placeholder="输入手机号" v-model="tel">
        </div>
        <div class="form-field">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#el-icon-password"></use>
          </svg>
          <input type="password" name="pwd" id="pwd" placeholder="输入新密码" v-model="pwd">
        </div>
        <div class="form-field">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#el-icon-password"></use>
          </svg>
          <input type="password" name="repwd" id="repwd" placeholder="再次输入密码" v-model="repwd">
        </div>
        <div class="form-field code">
          <input type="text" name="code" id="code" placeholder="输入验证码" v-model="code">
          <button @click="sendTel" :disabled="issend" :class="{'send': issend }">{{sendText}}</button>
        </div>
        <button value="登 录" class="login-btn" @click="onSubmit">更 改 并 登 录</button>
      </form>
      </template>
        
    </div>
    </div>
    <m-footer/>
  </div>
</template>

<script>
import mLogo from '@/components/public/header/logo.vue' 
import mFooter from '@/components/public/footer/index.vue'
import utils from '@/assets/js/utils.js'
require('@/assets/style/login.css')

  export default {
    components: {
      mLogo,
      mFooter
    },
    data() {
      return {
        tel: '',
        pwd: '',
        repwd: '',
        tishi: '',
        ishidden: 'hidden',
        isforget: false,
        sendText: '发送验证码',
        issend: false,
        code: ''
      }
    },
    methods: {
      submit() {
        return false
      },
      onSubmit() {
        const checktel = /\d{11}/
        if(!checktel.test(this.tel)) {
          this.tishi = '请输入正确的手机号'
          this.ishidden = 'visible'
          return
        } else {
          this.tishi = ''
          this.ishidden = 'hidden'
        }
        if(this.pwd.length < 6) {
          this.tishi = "密码数应不少于 6 位"
          this.ishidden = "visible"
          return
        }
        const vm = this
        const enpwd = utils.encrypto(this.pwd)
        let data = {
          "tel": this.tel,
          "pwd": enpwd
        }
        // 判断是否忘记密码
        if(this.isforget) {
          if(this.repwd !== this.pwd) {
            this.tishi = "两次输入的密码不相同"
            this.ishidden = "visible"
            this.repwd = ''
            return
          }
          if(this.code.length === 0) {
            this.tishi = "验证码不能为空"
            this.ishidden = "visible"
            return
          }
          data = {
            "tel": this.tel,
            "pwd": enpwd,
            code: this.code
          }
        }
        this.$axios({
          method: "post",
          url: "/user/login",
          data: data
        }).then(res => {
          window.console.log(res)
          if(res.data.code === 1 && res.status === 200) {
            vm.tishi = res.data.msg
            vm.ishidden = 'visible'
            vm.$store.commit("BIND_LOGIN", res.data.token)
            vm.$store.commit("SAVE_NAME", res.data.name)
            vm.$store.commit("SAVE_TEL", res.data.tel)
            setTimeout(() => {
               if(vm.$route.query) {
                 let to = vm.$route.query.redirect
                 if(to) {
                   vm.$router.replace(to)
                 } else {
                   vm.$router.replace('/')
                 }
                //  window.console.log(vm.$route.query.redirect)
              } else {
                vm.$router.go(-1)
              }
            }, 300);
          } else {
            vm.tishi = res.data.msg
            vm.ishidden = 'visible'
          }
        }).catch(err => {
          vm.tishi = '连接错误，登录失败'
          vm.ishidden = 'visible'
          window.console.log(err)
        })
      },
      forget() {
        this.isforget = true
        this.pwd = ''
      },
      login() {
        this.isforget = false
      },
      sendTel() {
        let vm = this
        const telNum = /\d{11}/
        const trim = /\s+/g
        if(this.tel.replace(trim, '').length === 0 || !telNum.test(this.tel)) {
          alert('请输入正确的手机号！')
          return false
        }
        this.$axios({
          method: 'post',
          url: '/sendsms',
          data: {
            tel: this.tel,
          }
        }).then(res => {
          if(res.data && res.status === 200) {
            let {code, msg} = res.data
            if(code === 1) {
              this.tishi = msg
              this.ishidden = 'visible'
              this.issend = true;
              let time = 90
              let unit = '秒'
              vm.sendText = time + unit
              window.clearInterval(timer)
              let timer = window.setInterval(function() {
                time--;
                if(time > 0) {
                  vm.sendText = time + unit
                } else {
                  vm.sendText = "重新发送"
                  vm.issend = false
                  window.clearInterval(timer)
                }
              }, 1000)
            }
          }
        }).catch(err => {
          window.console.log(err)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

  .login {
    background-color: #fff;
  }
  .login-body {
    padding: 40px 200px;
    display: flex;
    justify-content: flex-start;
  }
  .left img {
    width: 500px;
    margin-top: 40px; 
  }
  .right {
    width: 270px;
    top: 80px;
    left: 120px;
    position: relative;
  }
  .right.forget {
    top: 50px;
  }
  .right .box {
    margin-top: 30px;
  }
  .right a {
    color: #888;
  }
  .right a:hover,
  .right p.forget button:hover {
    color: #f3d22e
  }
  .right p {
    font-size: 14px;
  }
  .right p.forget {
    overflow: hidden;
  }
  .right p.forget button,
  .box button {
    float: right;
  }
  .right .form-field.code button {
    background-color: #f3d22e;
  }
  .right .form-field.code .send {
    background-color: #c4a923;
    cursor: no-drop;
  }
  .right .login-btn {
    background-color: #f3d22e;
  }
</style>