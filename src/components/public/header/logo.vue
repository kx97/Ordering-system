<template>
  <div class="logo">
    <router-link to="/">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#el-icon-dingcan"></use>
      </svg>
      <span>叮</span> 
    </router-link>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style>
  .logo {
    font-size: 44px;
    font-weight: bold;
    width: 110px;
    height: 60px;
    line-height: 60px;
    overflow: hidden;
  } 
  .logo:hover {
    opacity: 0.8;
    cursor: pointer;
  }
  .logo .icon {
    width: 60px;
    height: 60px;
  }
  .logo span {
    display: block;
    color: #e5b05c;
    float: right;
  }
</style>