<template>
  <div class="search">
    <div class="head">
      <m-header/>
      <m-foodbar/>
    </div>
    <div class="content">
      <div class="con-left">
        <h3 class="h3">{{tag}}</h3>
        <p class="msg" v-show="isshow">{{msgText}}</p>
        <div class="busi-box">
          <ul class="type-list" >
            <li class="type-item" v-for="(item, index) in busis" :key="index">
              <div class="cover" v-show="item.state === '打烊'">
                打 烊
              </div>
              <router-link :to="'/info?busi=' + item.telNumber">
                <img :src="item.pic ? item.pic : imgUrl" alt="">
                <p class="name">{{item.storeName}}</p>
                <p class="tags">{{item.tags}}</p>
                <p>{{item.time}} 分钟内送达</p>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="con-right">
        <m-loginbox/>
      </div>
    </div>
    <m-footer/>
  </div>
</template>

<script>
import mHeader from '@/components/public/header/index.vue'
import mFooter from '@/components/public/footer/index.vue'
import mFoodbar from '@/components/foodBar.vue'
import mLoginbox from '@/components/loginbox.vue'
  export default {
    components: {
      mHeader,
      mFooter,
      mFoodbar,
      mLoginbox
    },
    data() {
      return {
        tag: this.$route.query.tag ? this.$route.query.tag : '店铺',
        busi: this.$route.query.busi ? this.$route.query.busi : '',
        busis: [],
        isshow: false,
        msgText: '',
        imgUrl: require('@/assets/images/user.png')
      }
    },
    watch: {
      '$route'() {
        this.tag = this.$route.query.tag ? this.$route.query.tag : '店铺'
        this.busi = this.$route.query.busi ? this.$route.query.busi : ''
        this.init()
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        let query = this.$route.query
        let data = {}
        if(this.$route.query.tag) {
          data = {
            tag: this.tag
          }
        } else {
          data = {
            busi: query.busi
          }
        }
        
        this.$axios({
          method: 'post',
          url: '/search',
          data: data
        }).then(res => {
          window.console.log(res)
          if(res.data && res.status === 200) {
            let code = res.data.code
            if(code === 1) {
              this.isshow = false
              this.msgText = ''
              this.busis = res.data.busis
            } else {
              this.busis = []
              this.isshow = true
              this.msgText = res.data.msg
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .head {
    box-shadow: 0px 2px 20px #ccc;
    min-width: 1000px
  }
  .content {
    margin: 20px 80px;
    min-width: 1000px;
    position: relative;
    min-height: 430px;
    overflow: hidden;
    .con-left {
      min-height: 430px;
      background-color: #fff;
      float: left;
      width: 940px;
      margin-right: 250px;
      margin-left: 10px;
      border: 1px solid #e5e5e5;
      padding: 0 20px;
      box-sizing: border-box;
      
      .msg {
        text-align: center;
        font-size: 22px;
      }
      .type-list {
        padding: 0;
        display: flex;
        justify-content: flex-start;
        flex-flow: row wrap;
        .type-item {
          font-size: 14px;
          width: 180px;
          border-radius: 4px; 
          position: relative;
          margin: 20px;
          border: 1px solid #cccccc;
          .cover {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba($color: #ccc, $alpha: 0.7);
            font-size: 20px;
            font-weight: bold;
            color: #666;
            text-align: center;
            padding-top: 50px;
            border-radius: 5px;
          }
          a {
            color: #111;
          }
          &:hover {
            background-color: #eee;
          }
          p {
            margin: 8px 0;
            padding-left: 8px; 
          }
          .name {
            font-size: 18px;
          }
          img {
            display: block;
            width: 180px;
            height: 100px;
            border-radius: 5px;
          }
        }
      }
    }
    .con-right {
      position: absolute;
      height: 430px;
      right: 0;
      width: 220px;
    }
  }
</style>