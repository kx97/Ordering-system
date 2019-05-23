<template>
  <div class="footer">
    <m-left/>
    <m-right/>
  </div>
</template>

<script>
import mLeft from './left.vue'
import mRight from './right.vue'
  export default {
    components: {
      mLeft,
      mRight
    }
  }
</script>

<style scoped>
  .footer {
    margin: 40px 90px 0 90px;
    padding: 10px 0px;
    color: #aaa;
    font-size: 14px;
    height: 100px;
    position: relative;
    border-top: 1px solid #e5e5e5;
  } 
</style>