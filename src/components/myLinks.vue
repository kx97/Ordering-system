<template>
  <div class="my-links">
    <ul class="link-list">
      <li class="link-item">
        <router-link to="/mypage">个人中心</router-link>
      </li>
      <li class="link-item">
        <router-link to="/myorder">我的订单</router-link>
        <ul class="order-list">
          <li class="order-item">
            <router-link to="/myorder">已完成</router-link>
          </li>
          <li class="order-item">
            <router-link to="/myorder?state=1">正在配送</router-link>
          </li>
          <li class="order-item">
            <router-link to="/myorder?state=2">等待商家接单</router-link>
          </li>
          <li class="order-item">
            <router-link to="/myorder?state=3">失效订单</router-link>
          </li>
        </ul>
      </li>
      <li class="link-item">
        <router-link to="/mycar">购物车</router-link>
      </li>
      <li class="link-item">
        <router-link to="/myassess">我的评价</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>
  .my-links {
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
    .order-item a,
    .assess-item a{
      font-size: 14px;
      color: #666;
    }
    a:hover {
      color: #ffca6c;
    }
  }
</style>