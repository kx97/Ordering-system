<template>
  <div class="info">
    <div class="open" v-show="busi.state === '打烊'">
      <h3 style="text-align: center;">打烊中，不支持点餐</h3> 
    </div>
    <div class="add-modal" v-show="iscover">
      <div class="cover" style="top: 0px;" id="cover"></div>
      <div class="add-body" style="top: 60px;" id="add-body">
        <div class="top">
          <h4 style="text-align: center">订单详情</h4>
          <span class="close" @click="close">X</span>
        </div>
        <form action="" @submit.prevent="stop">
          <div class="form-field">
            <h4>店铺信息</h4>
            <span>店名: {{busi.storeName}}</span>
            &nbsp; &nbsp;
            <span>电话: {{btel}}</span>
             &nbsp; &nbsp;
             <span>配送时间: {{busi.time}} 分钟</span>
          </div>
          <div class="form-field">
            <h4>个人信息</h4>
            <select name="addr" id="addr" aria-placeholder="选择地址信息">
              <option :value="index" v-for="(addr, index) in addrs" :key="index">
                <p>收货人: {{addr.name}} {{addr.sex}} </p>
                <p>电话: {{addr.atel}} </p>
                <p>地址: {{addr.addr}}</p>
              </option>
            </select>
          </div>
          <div class="form-field">
            <h4>菜单信息</h4>
            <table>
              <thead>
                <tr>
                  <th class="mname">菜名</th>
                  <th class="mnum">数量</th>
                  <th class="mprice">价格</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{formenu.name}}</td>
                  <td>x {{formenu.num}}</td>
                  <td>￥{{formenu.price}}</td>
                </tr>
              </tbody>
            </table>
            <p>支付金额: &nbsp; {{total}} 元</p>
          </div>
          <div class="buttons">
            <button class="save" @click="confirm">确认支付</button>
            <button class="close" @click="close">取消</button>
          </div>
        </form>
      </div>
    </div>
    <div class="head">
      <m-header/>
      <m-foodbar/>
    </div>
    <div class="content">
      <div class="con-left">
        <div class="tab-hd">
          <h3 class="h3">菜单</h3>
          <a @click="toassess" href="javascript:void(0)">查看留言板</a>
        </div>
        <div class="menus" >
          <div class="menu-item" v-for="(menu, index) in menus" :key="index">
            <div class="item-le">
                <img :src="menu.pic">
              </div>
              <div class="item-rig">
                <p>{{menu.name}}</p>
                <p>￥{{menu.price}} &nbsp; &nbsp; <span style="font-size: 12px"> 总销量:</span>  {{menu.saleCount}}</p>
                <div class="num">
                  <button class="le" @click="red(index)">-</button>
                  <span>{{nums[index]}}</span>
                  <button class="rig" @click="add(index)">+</button>
                </div>
                <button @click="addToCar(index)">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#el-icon-gouwuche"></use>
                  </svg>
                </button>
                <button @click="pay(index)">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#el-icon-fukuan"></use>
                  </svg>
                </button>
              </div>
          </div>
        </div>
        <div class="assess-box" id="assess">
          <h3 class="h3">留言板</h3>
          <h3 style="text-align: center;" v-show="isshow">没有查找到你的评价</h3>
        <div class="assess-box">
          <div class="assess" v-for="(ass, index) in assess" :key="index">
            <p>用户名：{{ass.uname}}</p>
            <p>评价：{{ass.content}}</p>
            <p v-show="ass.reply">回复：{{ass.reply}}</p>
            <p class="time">{{ass.time.split('T')[0]}} {{ass.time.split('T')[1].split('.')[0]}}</p>
          </div>
        </div>
        </div>
      </div>
      <div class="con-right">
        <div class="busi-info">
          <img :src="busi.pic ? busi.pic : imgUrl" alt="">
          <p class="name">店名</p>
          <p>{{busi.storeName}}</p>
          <p class="tel">电话</p>
          <p>{{btel}}</p>
          <p>配送时间</p>
          <p>{{busi.time}} 分钟</p>
          <p class="star"></p>
        </div>
      </div>
    </div>
    <m-footer/>
  </div>
</template>

<script>
import mHeader from '@/components/public/header/index.vue'
import mFooter from '@/components/public/footer/index.vue'
import mFoodbar from '@/components/foodBar.vue'

  export default {
    components: {
      mHeader,
      mFooter,
      mFoodbar
    },
    data() {
      return {
        btel: this.$route.query.busi,
        busi: {},
        menus: [],
        nums: [],
        istoken: this.$store.getters.token === null ? false : true,
        iscover: false,
        addrs: [],
        formenu: {},
        total: 0,
        assess: [],
        isshow: false,
        imgUrl: require('@/assets/images/user.png')
      }
    },
    watch: {
      '$route'() {
        this.btel = this.$route.query.busi
        this.istoken = this.$store.getters.token === null ? false : true
        this.init()
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.$axios({
          method: 'post',
          url: '/get/busiAll',
          data: {
            btel: this.btel
          }
        }).then(res => {
          if(res.data.code === 1) {
            this.busi = res.data.busi
            if(this.busi.state === '打烊') {
              return
            }
            this.menus = res.data.menus
            for(let i = 0; i < this.menus.length; i++) {
              this.nums[i] = 1
              // this.menus[i].num = 1
            }
            this.assess = res.data.assess
          } else {
            this.menus = []
            this.nums = []
            this.assess = []
          }
        })
      },
      toassess() {
        const assess = document.getElementById('assess')
        if(assess) {
          assess.scrollIntoView(true)
        }
      },
      add(index) {
        this.nums.splice(index, 1, this.nums[index] + 1)
      },
      red(index) {
        this.nums.splice(index, 1, this.nums[index] - 1)
      },
      cover() {
        this.iscover = true
        let body = document.getElementsByTagName('body')[0]
        let cover = document.getElementById('cover')
        let addbody = document.getElementById('add-body')
        cover.style.top = document.documentElement.scrollTop + 'px'
        // window.console.log(cover)
        addbody.style.top = document.documentElement.scrollTop + 100 + 'px'
        // window.console.log(addbody)
        body.style.overflow = 'hidden'
        body.style.height = '100%'
      },
      pay(index) {
        if(!this.istoken) {
          alert('你还没登录， 不能下单')
          return
        } else {
          this.cover()
          this.$axios({
            method: 'post',
            url: '/get/user',
            data: {
              tel: this.$store.getters.tel
            }
          }).then(res => {
            if(res.data.code === 1) {
              this.addrs = res.data.address
              // window.console.log(this.addrs)
              this.formenu = this.menus[index]
              this.formenu.num = this.nums[index]
              // window.console.log(this.formenu)
              this.total = this.formenu.price * this.formenu.num 
            }
          })
        }
      },
      confirm() {
        let tel = this.$store.getters.tel
        let sel = document.getElementById('addr')
        let addr = this.addrs[sel.value]
        window.console.log(addr)
        if(addr === undefined) {
          alert('请前往个人中心添加送餐地址')
          this.close()
          return 
        }
        let menu = {
          name: this.formenu.name,
          price: this.formenu.price,
          pic: this.formenu.pic,
          num: this.formenu.num
        }
        window.console.log(addr)
        this.$axios({
          method: 'post',
          url: '/order/insert',
          data: {
            tel: tel,
            addr: addr,
            btel: this.btel,
            bname: this.busi.storeName,
            time: this.busi.time,
            menu: menu,
            price: this.total,
            state: 2
          }
        }).then(res => {
           window.console.log(res)
          if(res.data.code === 1) {
            this.close()
            this.$router.replace('/myorder?state=2')
          } else {
            // window.console.log(res.data.msg)
            alert(res.data.msg)
            this.close()
          }
        })
      },
      addToCar(index) {
         if(!this.istoken) {
          alert('你还没登录， 不能加入购物车')
          return
        }
        let item = this.menus[index]
        item.bname = this.busi.storeName
        item.time = this.busi.time
        item.num = this.nums[index]
        window.console.log(item)
        this.$store.commit("ADDITEM", item)
        window.console.log("items", this.$store.getters.items)
        alert('已加入购物车')
      },
      stop() {
        return false
      },
      close() {
        this.iscover = false
        let body = document.getElementsByTagName('body')[0]
        body.style.overflow = 'auto'
        body.style.height = '100%'
      }
    }
  }
</script>

<style lang="scss" scoped>
.head {
    box-shadow: 0px 2px 20px #ccc;
    min-width: 1000px
  }
.content {
    margin: 20px 80px;
    min-width: 1000px;
    position: relative;
    min-height: 430px;
    overflow: hidden;
    .con-left {
      min-height: 430px;
      background-color: #fff;
      float: left;
      width: 936px;
      margin-right: 250px;
      margin-left: 10px;
      border: 1px solid #e5e5e5;
      h3 {
        width: 80px;
        margin-left: 30px;
        margin-bottom: 0;
      }
      .tab-hd {
        a {
          display: block;
          float: right;
          margin-top: -30px;
          margin-right: 20px;
          color: #0089dc;
        }
      }
      .menus {
        display: flex;
        justify-content: flex-start;
        flex-flow: row wrap;
        margin: 30px 0 10px 0;
        border-bottom: 1px solid #e5e5e5;
        border-top: 1px solid #e5e5e5;
      }
      .menu-item {
        width: 310px;
        height: 120px;
        border: 1px solid #e5e5e5;
        overflow: hidden;
        margin: 0px 0px;
        background-color: #ffffff; 
        &:hover {
          background-color: #f6f6f6;
          box-shadow: 2px 2px 2px 2px #f6f6f6;
        }
        .item-le {
          float: left;
          img {
            border-right: 1px solid #e5e5e5;
          }
        } 
        .item-rig {
          margin-left: 140px;
          .num {
            float: left;
            margin-right: 20px;
            border: 1px solid #ccc;
            background-color: #fff;
            height: 26px;
            box-sizing: border-box;
            button {
              margin: 0;
              color: #444;
              height: 100%;
              font-size: 18px;
              outline: none;
            }
            span {
              display: inline-block;
              width: 26px;
              text-align: center;
              box-sizing: border-box;
            }
            .le {
              border-right: 1px solid #ccc;
            }
            .rig {
              border-left: 1px solid #ccc;
            }
          }
          button {
           margin: 0 auto;
           border: none;
           background: none;
           color: #f5ce0a;
           cursor: pointer;
           width: 24px;
           padding: 0;
           margin-right: 10px;
           outline: none;
           &:hover {
             color: #47a7dd;
           }
          }
        }
      }
      .assess-box {
        margin: 20px;
        min-height: 200px;
        h3 {
          margin-left: 10px;
        }
        .assess {
          padding: 10px 20px;
          border-bottom: 1px solid #e5e5e5;
          .time {
            color: #666;
            font-size: 14px;
          }
          &:hover {
            background-color: #e5e5e5;
          }
          p {
            margin: 8px;
          }
        }
      }
    }
    .con-right {
      position: absolute;
      height: 430px;
      right: 0;
      width: 220px;
      background-color: #fff;
      border: 1px solid #e5e5e5;
      .busi-info {
        margin: 20px;
        img {
          display: block;
          width: 180px;
          height: 100px;
          margin: 0 auto;
        }
        p:nth-child(even) {
          color: #444;
          margin-top: 20px;
          margin-bottom: 10px;
        }
        p:nth-child(odd) {
          font-size: 14px;
          margin: 0;
          padding: 0 0 10px 10px;
          border-bottom: 1px solid #ccc;
          // color: #ccc;
        }
      }
    }
}

.info {
  position: relative;
  .add-modal { 
    .cover {
      position: absolute; 
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #666;
      opacity: 0.6;
      z-index: 100;
      height: 100%;
    }
    .add-body {
      position: absolute;
      width: 400px;
      height: 450px;
      left: 50%;
      margin-left: -200px;
      border: 1px solid #999;
      background-color: #fff;
      padding: 0px 20px;
      z-index: 1000;
      .top {
        position: relative;
        .close {
          position: absolute;
          top: -10px;
          right: 10px;
          color: #999;
          font-size: 20px;
          font-weight: bold;
          &:hover {
            color: #222;
            cursor: pointer;
          }
        }
        h4 {
          margin-bottom: 5px;
        }
      } 
      .form-field {
        width: 100%;
        padding: 10px;
        line-height: 26px;
        font-size: 14px;
        overflow: hidden;
        border-bottom: 1px solid #ccc;
        box-sizing: border-box;
        select {
          width: 100%;
          height: 32px;
        }
        h4 {
          margin: 0;
          font-size: 15px;
          color: #0089dc;
        }
        table {
          width: 100%;
          text-align: left;
          .mname {
            width: 60%; 
          }
          .mnum, .mprice {
            width: 20%;
          }
        }
        p {
          float: right;
          text-align: center;
          margin-right: 20px;
          margin-top: 20px;
          padding: 5px;
          width: 150px;
          font-size: 16px;
          font-weight: bold;
          box-sizing: border-box;
        }
      }
      .buttons {
        // margin-top: 30px;
        text-align: center;
        width: 300px;
        margin: 20px auto;
        button {
          width: 80px;
          height: 32px;
          margin: 0 30px;
          border: none;
          background-color: #0089dc;
          color: #fff;
          opacity: 0.8;
        }
      }
    }
  }
}

.open {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #666;
  opacity: 0.9;
  z-index: 100;
  height: 100%;
}
</style>