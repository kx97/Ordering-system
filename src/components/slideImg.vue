<template>
  <div class="slider">
      <div class="img-box" @mouseover="stop" @mouseleave="play">
        <ul class="img-list" :style="listStyle">
          <li class="img-item" >
              <img :src="imgs[imgs.length - 1].imgsrc">
          </li>
          <li class="img-item" v-for="(img, index) in imgs" :key="index">
            <router-link :to="links[index].to">
              <img :src="img.imgsrc">
            </router-link>
          </li>
          <li class="img-item">
            <img :src="imgs[0].imgsrc">
          </li>
        </ul>

        <div class="slide-btn">
          <a href="javascript:0" class="prev" @click="move(imgWidth, 1, speed)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#el-icon-left"></use>
            </svg>
          </a>
          <a href="javascript:0" class="next" @click="move(imgWidth, -1, speed)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#el-icon-right"></use>
            </svg>
          </a>
        </div>

        <div class="slide-sel">
          <a v-for="(sel, ind) in imgs" :key="ind" href="javascript:0" :class="{on: ind === currentInd - 1}" @click="jump(ind + 1)"></a>
        </div>
      </div>
    </div>
</template>

<script>

  export default {
    name: 'slider',
    props: {
      initSpeed: {
        type: Number,
        default: 20
      },
      initInterval: {
        type: Number,
        default: 3
      }
    },
    data() {
      return {
        links: [
          {to: '/search?tag=美食'},
          {to: '/search?tag=炸鸡'},
          {to: '/search?tag=快餐'},
          {to: '/search?tag=小吃'},
          {to: '/search?tag=饮品'},
          {to: '/search?tag=甜品'}
        ],
        imgs: [
          {imgsrc: require('../assets/images/food.jpg')},
          {imgsrc: require('../assets/images/zhaji.jpg')},
          {imgsrc: require('../assets/images/fastfood.jpg')},
          {imgsrc: require('../assets/images/xiaochi.jpg')},
          {imgsrc: require('../assets/images/yinpin.jpg')},
          {imgsrc: require('../assets/images/tianpin.jpg')},
        ],
        imgWidth: 700,
        currentInd: 1,
        distance: -700,
        transitionEnd: true,
        speed: this.initSpeed,
        // timer: null
      }
    },
    computed: {
      listStyle() {
        return {
          transform: `translate3d(${this.distance}px, 0, 0)`
        }
      },
      Interval() {
        return this.initInterval * 1000
      },
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.play()
        window.onfocus = function() {
          this.play()
        }.bind(this)
        window.onblur = function() {
          this.stop()
        }.bind(this)
      },
      move(offset, direction, jumpSpeed) {
        if(!this.transitionEnd) return
        this.transitionEnd = false
        let offind = offset / this.imgWidth
        direction === -1 ? this.currentInd += offind : this.currentInd -= offind
        if(this.currentInd > this.imgs.length) {
          this.currentInd = 1;
        }
        if(this.currentInd < 1) {
          this.currentInd = this.imgs.length;
        }
        const destination = this.distance + direction * offset;
        this.animate(destination, direction, jumpSpeed)
      },
      animate(des, direc, jspe) {
        if(this.temp) {
          window.clearInterval(this.temp)
          this.temp = null
        }
         this.temp = window.setInterval(() => {
          if((direc === -1 && des < this.distance) || (direc === 1 && des > this.distance)) {
            this.distance += direc * jspe;
          } else {
            this.transitionEnd = true
            window.clearInterval(this.temp)
            this.distance = des;
            let maxdis = -(this.imgWidth)
            let mindis = -(this.imgWidth * this.imgs.length)
            if(des < mindis) {
              this.distance = maxdis
            } 
            if(des > maxdis) {
              this.distance = mindis
            }
          }
        }, 30);
      },
      jump(index) {
        let direction = index - this.currentInd >= 0 ? -1 : 1
        let iNum = Math.abs(index - this.currentInd)
        let offset = iNum * this.imgWidth
        let jumpSpeed = iNum > 0 ? iNum * this.speed : this.speed
        if(index === this.imgs.length && this.currentInd === 1) {
          direction = 1
          offset = this.imgWidth
          jumpSpeed = this.speed
        }
        if(this.currentInd === this.imgs.length && index === 1) {
          direction = -1
          offset = this.imgWidth
          jumpSpeed = this.speed
        }
        this.move(offset, direction, jumpSpeed)
      },
      play() {
        if(this.timer) {
          window.clearInterval(this.timer)
          this.timer = null
        }
        this.timer = window.setInterval(() => {
          this.move(this.imgWidth, -1, this.speed)
        }, this.Interval)
      },
      stop() {
        window.clearInterval(this.timer)
        this.timer = null
      }
    }
  }
</script>

<style scoped>
  .slider {
    position: absolute;
   left: 240px;
   width: 720px;
   height: 100%;
  }
  .img-box {
    width: 700px;
    height: 438px;
    margin: 0 auto;
    overflow: hidden;
  }
  .slider .img-list {
    width: 5600px;
    overflow: hidden;
    padding-left: 0; 
    margin-top: 0;
  }
  .slider .img-item {
    float: left;
    margin: 0;
    padding: 0;
  }
  .slider img {
    display: block;
    width: 700px;
  }
  .img-item a {
    display: block;
    margin: 0;
  }
  .slide-btn {
    position: absolute;
    top: 50%;
    padding: 0 20px 0 0px;
    margin-top: -25px; 
    width: 100%;
    box-sizing: border-box;
    line-height: 50px;
    height: 50px;
  }
  .slide-btn .icon {
    width: 50px;
    height: 50px;
  }
  .slide-btn .prev {
    float: left;
  }
  .slide-btn .next {
    float: right;
  }
  .slide-btn a,
  .slide-sel a {
    color: rgb(212, 209, 209);
    opacity: 0.4;
  }
  .slide-btn a:hover,
  .slide-sel a:hover {
    opacity: 1;
  }
  .slide-sel {
    position: absolute;
    bottom: 10px;
    left: 50%;
    margin-left: -81px;
  }
  .slide-sel a {
    display: block;
    float: left;
    width: 12px;
    height: 12px;
    margin-right: 15px;
    background-color: rgb(223, 219, 219);
    border-radius: 50%;
  }
  .slide-sel .on {
    opacity: 0.9;
  }
</style>