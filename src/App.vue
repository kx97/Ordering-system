<template>
  <div class="home" >
    <div class="head">
      <m-header />
      <m-foodbar/>
    </div>
    <div class="content">
      <div class="content-top">
        <m-storepush/>
        <m-slider/>
        <m-loginbox/>
      </div>
      <div class="content-middle">
        <m-favopush/>
      </div>
    </div>
    <m-footer/>
  </div>
</template>

<script>
import mHeader from '@/components/public/header/index.vue'
import mFoodbar from '@/components/foodBar.vue'
import mSlider from '@/components/slideImg.vue'
import mStorepush from '@/components/storepush.vue'
import mLoginbox from '@/components/loginbox.vue'
import mFavopush from '@/components/favopush.vue'
import mFooter from '@/components/public/footer/index.vue'
  export default {
    components: {
      mHeader,
      mFoodbar,
      mSlider,
      mStorepush,
      mLoginbox,
      mFavopush,
      mFooter
    },
  }
</script>

<style lang="scss">
  body {
    margin: 0;
    padding: 0;
    background-color: #f8f8f8;
  }
  .head {
    box-shadow: 0px 2px 20px #ccc;
    min-width: 1000px
  }
  .content {
    margin: 20px 80px;
    min-width: 1000px;
  }
  .content-top {
    width: 100%;
    padding: 0;
    box-sizing: border-box;
    height: 438px;
    position: relative;
  }
  .content-middle {
    margin: 40px 10px;
    background-color: #fff;
  }
  .icon {
    width: 24px;
    height: 24px;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  a {
    text-decoration: none;
  }
  li {
    position: relative;
    margin-right: 20px;
    list-style: none;
  }
  .h3 {
    border-bottom: 3px solid #0089dc;
    padding: 20px 10px 0 10px;
    margin-bottom: 20px;
    margin-top: 0;
    width: 100px;
    height: 36px;
    color: #666;
    text-align: center;
  }
  button {
    border: none;
    background: none;
    cursor: pointer;
    // outline: none;
  }
 
</style>