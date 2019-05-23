<template>
  <div class="loginBox">
    <p class="welcome">欢迎使用！</p>
    <div class="login" v-if="unlogin">
      <div class="imgbox">
        <router-link to="/mypage">
          <img src="../assets/images/user.png" alt="">
        </router-link>
      </div>
      <p class="user-name">Hi！你好</p>
      <router-link to="/register" class="btn-login">注册</router-link>
      <router-link to="/login" class="btn-login">立即登录</router-link>
    </div>
    <div class="login" v-else-if="!unlogin">
      <router-link to="/mypage">
        <div class="imgbox">
          <img src="../assets/images/user.png" alt="">
        </div>
      </router-link>
      <p class="user-name">{{name}}</p>
      <router-link to="/myorder" class="btn-item">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#el-icon-order"></use>
        </svg>
        <p>订单</p>
      </router-link>
      <router-link to="/mycar" class="btn-item">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#el-icon-gouwuche"></use>
        </svg>
        <p>购物车</p>
      </router-link>
      <router-link to="myassess" class="btn-item">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#el-icon-pingjia"></use>
        </svg>
        <p>评价</p>
      </router-link>
      <a @click="exit" class="btn-item">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#el-icon-tuichu"></use>
        </svg>
        <p>退出</p>
      </a>
    </div>
    <router-link to="./busienter">
    <div class="busienter">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#el-icon-shouzhi"></use>
      </svg>
      <span class="bwelcome">商家入驻！</span>
    </div> 
    </router-link> 
  </div>
</template>

<script>
import { setTimeout } from 'timers';
  export default {
    data() {
      return {
        unlogin: this.$store.getters.token !== null ? false : true,
        name: this.$store.getters.name
      }
    },
    watch: {
      '$route'() {
        this.init()
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.unlogin = this.$store.getters.token !== null ? false : true
        this.name = this.$store.getters.name
      },
      exit() {
        let vm = this
        setTimeout(() => {
          vm.$store.commit('BIND_LOGOUT')
          window.location.replace('/')
        }, 100)
      }
    }
  }
</script>

<style scoped>
  .loginBox {
    position: absolute;
    right: 10px;
    width: 210px;
    height: 100%;
    text-align: center;
    /* position: relative; */
  }
  .loginBox .welcome {
    background-color: #fade4b;
    margin: 0;
    padding: 10px;
    box-shadow: 0 3px 3px #ccc;
    font-size: 18px;
    color: #444;
  }
  .loginBox .login,
  .loginBox .busienter {
    margin: 20px 0;
    padding: 15px 10px;
    border: 1px solid #e5e5e5;
    background-color: #fff;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
  }
  .loginBox .login .imgbox {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #fade4b;
    margin: 0 auto;
    overflow: hidden;
  }
  .loginBox .login .imgbox img {
    width: 100%;
    height: 100%;
  }
  .loginBox .login .btn-login {
    display: block;
    width: 120px;
    color: #444;
    margin: 10px auto;
    padding: 5px 0;
    border: 1px solid #ccc;
    border-radius: 16px;
  }
  .loginBox .login .user-name {
    width: 100%;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
  }
  .loginBox .login .btn-item {
    float: left;
    display: block;
    width: 50%;
    height: 50px;
    color: #666;
    box-sizing: border-box;
  }
  .loginBox .login .btn-item:hover,
  .loginBox .login .btn-set:hover {
    color: #111;
    border-radius: 5px;
    background-color: #fade4b;
    opacity: 0.8;
    cursor: pointer;
  }
  .login .btn-item p {
    margin: 0;
    font-size: 12px;
  }
  .loginBox .busienter {
    margin-bottom: 0;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 24%;
    font-size: 22px;
    background: linear-gradient(to right,  #68bae9 2%, #49a8df 97%) #50ade2;
    color: #111;
  } 
  .busienter:hover {
    opacity: 0.8;
  }
  .btn-login:hover {
    background-color: #e5e5e5;
  }
  .busienter .icon {
    width: 30px;
    height: 30px;
    position: absolute;
    top: 50%;
    margin-top: -15px;
    left: 30px;
  }
  .busienter span {
    display: block;
    margin-top: 15px;
    margin-left: 50px;
  }
</style>