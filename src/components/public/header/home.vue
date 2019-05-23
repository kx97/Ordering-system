<template>
  <div class="m-home">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#el-icon-location"></use>
    </svg>
    <span class="currentCity">南昌 </span>  
    <router-link to="/">叮叮首页</router-link>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style scoped>
  .m-home {
    color: #999;
    margin: 0 10px;
    position: relative;
  }
  .icon {
    position: absolute;
    top: 8px;
    left: 5px;
  }
  span {
    margin: 0 20px 0 30px;
  }
  a {
    margin-right: 20px;
    cursor: pointer;
  }
</style>