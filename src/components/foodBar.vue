<template>
  <div class="food-bar">
    <ul class="bar">
      <li class="bar-item">
        <router-link to="/search?tag=美食">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#el-icon-meishi"></use>
          </svg>
          <span>美 食</span>
        </router-link>
      </li>
      <li>
        <router-link to="/search?tag=炸鸡">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#el-icon-zhaji"></use>
          </svg>
          <span>炸 鸡</span>
        </router-link>
      </li>
      <li>
        <router-link to="/search?tag=快餐">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#el-icon-kuaican"></use>
          </svg>
          <span>快 餐</span>
        </router-link>
      </li>
      <li>
        <router-link to="/search?tag=小吃">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#el-icon-xiaochi"></use>
          </svg>
          <span>小 吃</span>
        </router-link>
      </li>
      <li>
        <router-link to="/search?tag=饮品">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#el-icon-yinpin"></use>
          </svg>
          <span>饮 品</span>
        </router-link>
      </li>
      <li>
        <router-link to="/search?tag=甜品">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#el-icon-cake"></use>
          </svg>
          <span>甜 品</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style scoped>
  .food-bar {
    position: relative;
    height: 50px;
    font-size: 20px;
    line-height: 50px;
    padding: 0 80px;
    background-color: #fff;
  }
  .bar {
    margin: 0; 
    padding: 0;
    display: flex;
    justify-content: space-around;
    border-bottom: 2px solid #47a7dd;
    margin-right: 220px;
  }
  .bar li {
    position: relative;
  }
  .bar li a {
    color: #444;
    font-weight: bold;
  }
  .bar li:nth-child(odd) a:hover span {
    color: #47a7dd; 
  }
  .bar li:nth-child(even) a:hover span {
    color: #fade4b; 
  }
  
  .bar li .icon {
    position: absolute;
    top: 12px;
  }
  .bar li span {
    margin-left: 30px; 
  }

</style>