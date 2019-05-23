<template>
  <div class="admin">
    <template v-if="admin === ''">
      <div class="box">管理员登录
        <form @submit.prevent="submit">
          <div class="form-field">
            <input type="tel" name="tel" id="tel" placeholder="用户名" v-model="name">
          </div>
          <div class="form-field">
            <input type="password" name="pwd" id="pwd" placeholder="输入密码" v-model="pwd">
          </div>
          <button value="登 录" class="login-btn" @click="onSubmit">登 录</button>
        </form>
      </div>
    </template>
    <template v-else>
      <h3 class="h3">等待审核</h3>
      <h3 v-show="reviews.length === 0">没有要审核的商家</h3>
      <div class="review-box">
        <div class="review" v-for="(re, index) in reviews" :key="index">
          <p>{{re.btel}}</p>
          <img :src="re.license" alt="">
          <button @click="success(index)">审核通过</button>
          <button @click="fail(index)">审核失败</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        admin: this.$store.getters.admin,
        name: '',
        pwd: '',
        reviews: []
      }
    },
    created() {
      this.init()
    },
    methods: {
      submit() {
        return;
      },
      onSubmit() {
        this.$axios({
          method: 'post',
          url: '/admin',
          data: {
            name: this.name,
            pwd: this.pwd
          }
        }).then(res => {
          window.console.log(res)
          if(res.data.code === 1) {
            this.$store.commit("BIND_ADMIN", res.data.admin)
            this.$router.go(0)
          } else {
            this.admin = ''
          }
        })
      },
      init() {
        window.console.log(this.admin)
        if(this.admin !== null) {
          this.$axios({
            method: 'get',
            url: '/getRe'
          }).then(res => {
            if(res.data.code === 1) {
              this.reviews = res.data.reviews
            }
          })
        } else {
          return
        }
      },
      success(index) {
        this.$axios({
          method: 'post',
          url: '/review',
          data: {
            id: this.reviews[index]._id,
            success: true
          }
        }).then(res => {
          window.console.log(res)
          if(res.data.code === 1) {
            // window.console.log(res)
           this.reviews = res.data.reviews
          }
        })
      },
      fail(index) {
        this.$axios({
          method: 'post',
          url: '/review',
          data: {
            id: this.reviews[index]._id,
            success: false
          }
        }).then(res => {
          window.console.log(res)
          if(res.data.code === 1) {
           this.reviews = res.data.reviews
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .admin {
    width: 400px;
    margin: 50px auto;
    padding: 20px;
    min-height: 300px;
    background-color: #fff;
  }
  .box {
    width: 230px;
    margin: 200px auto;
    box-sizing: border-box;
    input {
      width: 100%;
      height: 36px;
      box-sizing: border-box;
      margin: 10px 0;
      padding: 10px;
      outline: none;
    }
    button {
      width: 100%;
      height: 32px;
      background-color: #ccc;
      margin-top: 20px;
    }
  }
  .review {
    margin: 20px;
    border-bottom: 2px solid #ccc;
    text-align: center;
    img {
      display: block;
      width: 280px;
      height: 200px;
      margin: 0 auto;
      border: 1px solid #ccc;
    }
    button {
      margin: 20px;
      font-size: 16px;
    }
  }
</style>