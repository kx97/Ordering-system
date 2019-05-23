<template>
  <div class="bu-links">
    <ul class="link-list">
      <li class="link-item">
        <router-link to="/business">商家中心</router-link>
      </li>
      <li class="link-item">
        <router-link to="/menu">菜单管理</router-link>
      </li>
      <li class="link-item">
        <router-link to="/order">店铺订单</router-link>
        <ul class="order-list">
          <li class="order-item">
            <router-link to="/order">已完成</router-link>
          </li>
          <li class="order-item">
            <router-link to="/order?state=1">正在配送</router-link>
          </li>
          <li class="order-item">
            <router-link to="/order?state=2">待处理</router-link>
          </li>
          <li class="order-item">
            <router-link to="/order?state=3">失效订单</router-link>
          </li>
        </ul>
      </li>
      <li class="link-item">
        <router-link to="/assess">留言板</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>
  .bu-links {
    border: 1px solid #e5e5e5;
    width: 230px;
    padding: 20px 30px;
    margin: 0 20px;
    background-color: #fff;
    box-sizing: border-box;
    ul {
      margin: 0;
      padding: 0;
    }
    li {
      margin: 12px;
    }
    .link-item a {
      font-size: 16px;
      color: #444;
      
    }
    .order-item a,{
      font-size: 14px;
      color: #666;
    }
    a:hover {
      color: #4da3d4;
    }
  }
</style>