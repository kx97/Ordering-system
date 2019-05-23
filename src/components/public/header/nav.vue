<template>
  <div class="m-nav">
    <ul class="nav">
      <li class="list">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#el-icon-personal"></use>
        </svg>
        <router-link to="/mypage">个人中心</router-link>
      </li>
      <li>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#el-icon-gouwuche"></use>
        </svg>
        <router-link to='/mycar'>购物车</router-link>
      </li>
      <li>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#el-icon-order"></use>
        </svg>
        <router-link to='/myorder'>我的订单</router-link>
      </li>
      <li>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#el-icon-business"></use>
        </svg>
        <router-link to="/business">商家中心</router-link>
      </li>
      <li v-if="busi" class="busibox">
          <span>{{storeName}}</span>
          [<a href="#" @click="exit"> 退出 </a>]
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        storeName: this.$store.getters.storeName,
        busi: this.$store.getters.btoken !== null ? true : false
      }
    },
    watch: {
      '$route'() {
        this.storeName = this.$store.getters.storeName,
        this.busi = this.$store.getters.btoken !== null ? true : false
      }
    },
    methods: {
      exit() {
        this.$axios({
          method: 'post',
          url: '/busi/update',
          data: {
            tel: this.$store.getters.btel,
            state: '打烊',
            isstate: true
          }
        }).then(res => {
          if(res.data.code === 1) {
            let vm = this
            window.setTimeout(function() {
              vm.$store.commit("BIND_BLOGOUT")
              window.location.replace('/')
            }, 300)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .nav {
    display: flex;
    margin: 0;
    justify-content: flex-end;
    position: relative;
  }
  .nav li .icon {
    position: absolute;
    top: 8px;
  }
  .nav li a {
    margin-left: 24px;
  }
  .nav .busibox a {
    margin-left: 0;
  }
</style>