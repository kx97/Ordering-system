<template>
  <div class="favopush">
    <div class="push-head">
      <h3 class="title">随机推荐</h3>
      <span>希望有你喜欢的</span>
    </div>
    <div class="push-body">
      <ul class="type-list">
        <li class="type-item" v-for="(store, index) in stores" :key="index">
          <router-link :to='"/info?busi=" + store.telNumber'>
            <img :src="store.pic ? store.pic : imgUrl" alt="" class="img">
            <p class="name">{{store.storeName}}</p>
            <p class="tag">{{store.tags}}</p>
            <p class="tiem">配送时间：{{store.time}} 分钟</p>
          </router-link>
        </li>
     </ul>
    </div>
    
  </div>
</template>

<script>
  export default {
    data() {
      return {
        noI: [1, 2, 3],
        stores: [],
        imgUrl: require('@/assets/images/user.png')
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
        window.console.log('111')
        this.$axios({
          method: 'post',
          url: '/getstore',
          data: {
            favo: true
          }
        }).then(res => {
          if(res.data.code === 1) {
            this.stores = res.data.stores
          } else {
            this.stores = []
          }
        })
      }
    }
  }
</script>

<style scoped>
  .favopush {
    border: 1px solid #e5e5e5;
    border-radius: 5px;
  }
  .push-head {
    background: linear-gradient(to right, rgb(243, 182, 74) 2%, rgb(242, 197, 69) 97%) rgb(243, 182, 74);
    padding: 5px;
    line-height: 40px;
    border-radius: 5px 5px 0px 0px;
    position: relative;
    color: #ffffff;
  }
  .push-head::after {
    content: "";
    display: block;
    position: absolute;
    bottom: 0px;
    left: 150px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #fff;
  }
  .push-head .title {
    margin: 0;
    float: left;
    padding: 0 10px;
  }
  .type-list {
    padding: 0;
    display: flex;
    justify-content: space-around;
    flex-flow: row wrap;
  }
  .type-item {
    margin: 10px 10px;
    padding: 10px 10px;
    font-size: 14px;
    width: 180px;
    border-radius: 4px; 
  }
  .type-item a {
    color: #111;
  }
  .type-item:hover {
    background-color: #eee;
  }
  .type-item p {
    margin: 8px 0;
  }
  .type-item .name {
    font-size: 18px;
  }
  .type-item .pr {
    color: #ff6600;
  }
  .type-item .price {
    font-size: 26px;
  } 
  .type-item img {
    display: block;
    width: 100%;
    height: 100px;
    border-radius: 5px;
    border: 1px solid #cccccc;
  }
  
</style>