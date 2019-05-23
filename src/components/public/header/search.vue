<template>
  <div class="m-search">
    <input type="text" name="search-text" id="search" class="search-text" placeholder="搜索商家" v-model="search">
    <router-link :to="'/search?busi=' + search">
      <button class="search-btn">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#el-icon-sousuo"></use>
        </svg>
      </button>
    </router-link>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        search: ''
      }
    }
    
  }
</script>

<style scoped>
  .m-search {
    position: relative;
    top: 30px;
    left: 300px;
    width: 520px;
    height: 40px;
    border: 2px solid #ffca6c;
    border-radius: 5px;
    font-size: 22px;
  }
  .m-search .search-text {
    position: absolute;
    display: block;
    width: 85%;
    height: 40px;
    border: none;
    outline: none;
    padding: 0px 10px;
    box-sizing: border-box;
    background-color: #f8f8f8;
  }
  .m-search .search-text:focus {
    background-color: #fff;
  }
  .m-search .search-btn {
    position: absolute;
    right: 0;
    width: 15%;
    height: 100%;
    background-color: #ffca6c;
    border: none;
    outline: none;
    color: #333;
  }
  .search-btn:hover {
    cursor: pointer;
    opacity: 0.8;
  }
</style>