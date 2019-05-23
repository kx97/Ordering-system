<template>
  <div class="assess">
     <m-header/>
    <div class="content">
      <div class="left">
        <b-links/>
      </div>
      <div class="right">
        <h3 class="h3">留言板</h3>
        <h3 style="text-align: center;" v-show="isshow">没有查找到关于店铺的评价</h3>
        <div class="assess-box">
          <div class="assess" v-for="(ass, index) in assess" :key="index">
            <p>用户名：{{ass.uname}} &nbsp;&nbsp;&nbsp;</p>
            <p>评价：{{ass.content}}</p>
            <p v-show="ass.reply">回复：{{ass.reply}}</p>
            <p class="time">{{ass.time.split('T')[0]}} {{ass.time.split('T')[1].split('.')[0]}}</p>
            <div class="reply-box"  v-show="!ass.reply">
              <textarea name="reply" id="reply" cols="30" rows="2" style="resize: none;" v-model="reply"></textarea>
              <button @click="replyCon(index)">回复</button>
            </div>
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
import bLinks from '@/components/busiLinks.vue'
  export default {
    components: {
      mHeader,
      mFooter,
      bLinks
    },
    data() {
      return {
        assess: [],
        isshow: false,
        reply: ''
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
          url: '/assess/get/busi',
          data: {
            btel: this.$store.getters.btel
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
      replyCon(index) {
        this.$axios({
          method: 'post',
          url: '/assess/addreply',
          data: {
            id: this.assess[index]._id,
            reply: this.reply,
            btel: this.$store.getters.btel
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
      }
    }
  }
</script>

<style lang="scss" scoped>
.assess .content {
  margin: 20px 100px;
  overflow: hidden;
  .left {
    float: left;
  }
  .right {
    background-color: #fff;
    margin: 0 20px 0 280px; 
    border: 1px solid #e5e5e5;
    padding: 20px;
    min-height: 300px;
    .assess-box {
      margin: 20px;
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
        button {
          border: none;
          background-color: transparent;
          font-size: 16px;
          color: blue;
          margin-left: 20px;
        }
      }
    }
  }
}
</style>