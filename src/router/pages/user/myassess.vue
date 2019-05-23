<template>
  <div class="my-assess">
     <m-header/>
    <div class="content">
      <div class="left">
        <m-links/>
      </div>
      <div class="right">
        <h3 class="h3">我的评价</h3>
        <h3 style="text-align: center;" v-show="isshow">没有相关的评价</h3>
        <div class="assess-box">
          <button @click="clearAll" v-show="!isshow">全部清除</button>
          <div class="assess" v-for="(ass, index) in assess" :key="index">
            <p>店名：{{ass.bname}} &nbsp;&nbsp;&nbsp;</p>
            <p>评价：{{ass.content}}</p>
            <p v-show="ass.reply">回复：{{ass.reply}}</p>
            <p class="time">{{ass.time.split('T')[0]}} {{ass.time.split('T')[1].split('.')[0]}}</p>
          </div>
        </div>
      </div>
    </div>
    <m-footer/>
  </div>
</template>

<script>
import mHeader from '@/components/public/header/index.vue'
import mFooter from '@/components/public/footer/index.vue'
import mLinks from '@/components/myLinks.vue'
  export default {
    components: {
      mHeader,
      mFooter,
      mLinks
    },
    data() {
      return {
        assess: [],
        isshow: false
      }
    },
    watch: {
      '$route'() {
        this.init()
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.$axios({
          method: 'post',
          url: '/assess/get/user',
          data: {
            utel: this.$store.getters.tel
          }
        }).then(res => {
          window.console.log(res)
          if(res.data.code === 1) {
            this.assess = res.data.assess
            this.isshow = false
          } else {
            this.assess = []
            this.isshow = true
          }
        })
      },
      clearAll() {
        this.$axios({
          method: 'post',
          url: '/assess/clearAll',
          data: {
            utel: this.$store.getters.tel
          }
        }).then(res => {
          window.console.log(res)
          if(res.data.code === 1) {
            this.init()
          } else {
            this.assess = []
            this.isshow = true
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.my-assess .content {
  margin: 20px 100px;
  overflow: hidden; 
  .left {
    float: left;
  }
  .right {
    background-color: #fff;
    margin: 0 20px 0 280px; 
    border: 1px solid #e5e5e5;
    padding: 0 20px;
    min-height: 300px;
    .assess-box {
      margin: 20px;
      button {
        font-size: 16px;
        background-color: #ccc;
        margin: 10px;
      }
      .assess {
        padding: 10px 20px;
        border-bottom: 1px solid #e5e5e5;
        .time {
          color: #666;
          font-size: 14px;
        }
        &:hover {
          background-color: #e5e5e5;
        }
        p {
          margin: 8px;
        }
      }
    }
  }
}
</style>