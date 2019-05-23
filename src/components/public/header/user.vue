<template>
  <div class="m-user">
    <template v-if="user">
      欢迎您，<span class="username">{{name}}</span>
      &nbsp;
      [ <a href="#" @click="exit">退出</a> ]
    </template>
    <template v-else-if="!user">
      <router-link to="/login" class="login" >立即登录</router-link>
      &nbsp;
      <router-link to="/register" class="register">注册</router-link>
    </template>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        user: this.$store.getters.token !== null ? true : false,
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
        this.user = this.$store.getters.token !== null ? true : false
        this.name = this.$store.getters.name
      },
      exit() {
        let vm = this
        window.setTimeout(function() {
          vm.$store.commit('BIND_LOGOUT')
          window.location.replace('/')
        }, 100)
      }
    }
  }
</script>

<style scoped>
  
</style>