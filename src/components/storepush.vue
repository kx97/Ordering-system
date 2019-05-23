<template>
  <div class="storepush">
    <div class="title">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#el-icon-dianzan"></use>
      </svg>
      <span>热销店铺</span> 
    </div>
    <div class="details">
      <ul class="menu-list">
        <li class="list-item" v-for="(store, index) in stores" :key="index">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="'#el-icon-no' + index"></use>
          </svg>
          &nbsp;&nbsp;&nbsp;总销量：{{store.saleCount}}
          <p class="name">
            <router-link :to='"/info?busi=" + store.telNumber' >
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#el-icon-business"></use>
              </svg>
              {{store.storeName}}
            </router-link> 
          </p>
          <p class="hot">火热程度：
            <svg class="icon" aria-hidden="true" v-for="(el, i) in els.slice(0, elnum - index)" :key="i">
              <use xlink:href="#el-icon-huo"></use>
            </svg>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        els: [1, 2, 3, 4, 5],
        elnum: 5,
        stores: []
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
            favo: false
          }
        }).then(res => {
          if(res.data.code === 1) {
            this.stores = res.data.stores
          }
        })
      }
    }
  }
</script>

<style scoped>
  .storepush {
    position: absolute;
    left: 10px;
    width: 220px;
    height: 100%;
    background-color: #fff;
    padding: 10px 10px;
    box-sizing: border-box;
    border: 1px solid #e5e5e5;
  }
  .storepush .title {
    position: relative;
    color: #47a7dd;
    font-size: 24px;
    height: 30px;
    padding: 10px 20px;
    font-weight: bold;
    border-bottom: 2px solid #fade4b;
  }
  .title .icon {
    position: absolute;
    width: 30px;
    height: 30px;
    left: 30px;
  }
  .title span {
    margin-left: 40px;
    text-shadow: 0 3px 3px #ddd
  }
  .details {
    font-size: 15px;
    color: #444;
  }
  .details p {
    margin: 0;
  }
  .details .name {
    font-size: 16px;
    height: 50px;
    margin-top: 10px;
  }
  .details .name .icon,
  .details .hot .icon {
    width: 22px;
    height: 22px;
    position: relative;
    top: 2px;
    color: #f5ce0a;
  }
  .details .hot {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
  }
  .details .menu-list {
    padding-left: 0;
    margin: 0;
  }
  .details .list-item {
    height: 100px;
    margin: 0;
    padding: 10px 10px;
  }
  .list-item:nth-child(even) {
    border-top: 1px solid #f6250a;
    border-bottom: 1px solid #f6250a;
  }
  .list-item .icon {
    width: 28px;
    height: 28px;
    position: relative;
    top: 0px;
  }
  .list-item .name a {
    color: #444;
    
  }

</style>