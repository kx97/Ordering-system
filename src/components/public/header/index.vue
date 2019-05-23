<template>
  <div class="header">
    <div class="hd-top">
      <div class="hd-top-left">
          <m-home/>
          <m-user/>
      </div>
      <div class="hd-top-right">
          <m-nav/>
      </div>
    </div>
    <div class="hd-bottom">
      <m-logo/>
      <m-search/>
    </div>
  </div>
</template>

<script>
import mHome from './home.vue'
import mUser from './user.vue'
import mNav from './nav.vue'
import mLogo from './logo.vue'
import mSearch from './search.vue'


  export default {
    components: {
      mHome,
      mUser,
      mNav,
      mLogo,
      mSearch,
    },
  }
</script>

<style>
  .header {
    min-width: 1000px;
    font-size: 14px;
    height: 170px;
    line-height: 40px;
    overflow: hidden;
    box-shadow: 0 2px 20px #ccc;
  }
  
  .hd-top a {
    color: #999;
  }
  .hd-top a:hover {
    color: #ffca6c;
  }
  .hd-top .icon {
    color: #777;
  }
  .hd-top {
    display: flex;
    justify-content: space-between;
    padding: 0 8%;
    border-bottom: 1px solid #f8f8f8;
  }
  .hd-top-left {
    display: flex;
    justify-content: flex-start;
  }
  .hd-bottom {
    background-color: #fff;
    height: 140px;
    padding: 0 8%;
    border-bottom: 1px solid #fff;
    overflow: hidden;
  } 
  .hd-bottom .logo {
    padding-top: 30px;
    margin-left: 80px;
    float: left;
  }
</style>