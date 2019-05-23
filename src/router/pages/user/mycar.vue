<template>
  <div class="my-car">
    <div class="open" v-show="isopen">
      <div class="body">
        <h3 class="h3">订单详情</h3>
        <span class="close" @click="close">X</span>
         <form @submit.prevent="stop" class="form-box">
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
          <div class="form-menu" v-for="(order, index) in orders" :key="index">
            <h4>订单{{index + 1}}&nbsp;&nbsp;&nbsp;总计: &nbsp; {{order.total}} 元</h4>
            <p> 店名：{{order.bname}} &nbsp;&nbsp;&nbsp;店铺账号：{{order.btel}}</p>
             <p>配送时间: {{order.time}} 分钟</p>
            <table>
              <thead>
                <tr>
                  <th class="mname">菜名</th>
                  <th class="mnum">数量</th>
                  <th class="mprice">价格</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(menu, i) in order.menu" :key="i">
                  <td>{{menu.name}}</td>
                  <td>x {{menu.num}}</td>
                  <td>￥{{menu.price}}</td>
                </tr>
              </tbody>
            </table>
          </div>
         </form>
        <p style="font-size: 18px; font-weight: bold; padding-left: 20px;">支付金额：{{total}} 元</p>
        <div class="buttons">
          <button class="save" @click="confirm">确认支付</button>
          <button class="cancel" @click="close">取消</button>
        </div>
      </div>
    </div>
     <m-header/>
    <div class="content">
      <div class="left">
        <m-links/>
      </div>
      <div class="right">
        <h3 class="h3">购物车</h3>
        <div class="empty" v-if="isshow" style="text-align: center;margin-top: 50px;">
          <h3>您的购物车还是空的</h3>
          <router-link to="/search?busi=" style="color: red">去逛逛</router-link>
        </div>
        <div class="menus" v-else>
          <div class="menu-top">
            <div class="col-4">
              菜品信息
            </div>
            <div class="col-1">
              单价
            </div>
            <div class="col-2">
              数量
            </div>
            <div class="col-1">
              小计
            </div>
            <div class="col-1">
              操作
            </div>
          </div>
          <div class="menu-item" v-for="(item, index) in menus" :key="index" >
            <p>
              店名：{{item.bname}} &nbsp;&nbsp;&nbsp;店铺账号：{{item.btel}}
            </p>
            <div class="menu" v-for="(menu, i) in item.menu" :key="i">
              <div class="col-4" >
                <img :src="menu.pic" alt="图片">
                <span>{{menu.name}}</span>
              </div>
              <div class="col-1">￥{{menu.price}}</div>
              <div class="col-2">
                <div class="numbox">
                  <button :disabled="menu.num === 1" @click="red(index, i)">-</button>
                  <span>{{menu.num}}</span>
                  <button :disabled="menu.num === 9" @click="add(index, i)">+</button>
                </div>
              </div>
              <div class="col-1">{{menu.price * menu.num}} 元</div>
              <div class="col-1">
                <button @click="del(index, i)">删除</button>
              </div>
            </div>
          </div>
          <div class="menu-bottom">
            总计 {{total}} 元
            <button @click="payfor">结 算</button>
          </div>
        </div>
      </div>
    </div>
    <m-footer/>
  </div>
</template>

<script>
import mHeader from '@/components/public/header/index.vue'
import mFooter from '@/components/public/footer/index.vue'
import mLinks from '@/components/myLinks.vue'


  export default {
    components: {
      mHeader,
      mFooter,
      mLinks
    },
    data() {
      return {
        menus: JSON.parse(this.$store.getters.items),
        isshow: false,
        isopen: false,
        total: this.$store.getters.total,
        ischeck: false,
        mcheck: false,
        addrs: [],
        orders: []
      }
    },
    watch: {
      '$route'() {
        this.init()
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.menus = JSON.parse(this.$store.getters.items) || []
        if(this.menus.length === 0) {
          this.isshow = true
        } else {
          this.isshow = false
        }
        this.total = this.sumall()
      },
      red(index, i) {
        let data = {
          index,
          i
        }
        this.menus[index].menu[i].num--
        this.$store.commit("REDNUM", data)
        this.menus = JSON.parse(this.$store.getters.items)
        let res = this.sumall()
        this.total = res
      },
      add(index, i) {
        let data = {
          index,
          i
        }
        this.menus[index].menu[i].num++
        this.$store.commit("ADDNUM", data)
        this.menus = JSON.parse(this.$store.getters.items)
        let res = this.sumall()
        this.total = res
        
      },
      sumall() {
        let sum = 0
        for(let i = 0; i < this.menus.length; i++) {
          for(let j = 0; j < this.menus[i].menu.length; j++) {
            sum += this.menus[i].menu[j].price * this.menus[i].menu[j].num 
          }
        }
        this.$store.commit("TOTAL", sum)
        return sum
      },
      del(index, i) {
        let data = {
          index,
          i
        }
        this.$store.commit("DEL_MENU", data)
        this.menus = JSON.parse(this.$store.getters.items)
        if(this.menus.length === 0) {
          this.isshow = true
        } else {
          let res = this.sumall()
          this.total = res
        }
      },
      stop() {
        return false
      },
      close() {
        this.isopen = false
        this.orders = []
      },
      payfor() {
       document.documentElement.scrollTop = '0px'
        this.$axios({
          method: 'post',
          url: '/address',
          data: {
            tel: this.$store.getters.tel,
            get: true
          }
        }).then(res => {
          window.console.log(res)
          if(res.data.code === 1) {
            this.addrs = res.data.address
            this.isopen = true
            for(let i = 0; i < this.menus.length; i++) {
              let order = {}
              order.menu = []
              let sum = 0
              for(let j = 0; j < this.menus[i].menu.length; j++) {
                sum += this.menus[i].menu[j].num * this.menus[i].menu[j].price
                order.menu.push(this.menus[i].menu[j])
                order.btel = this.menus[i].btel
                order.bname = this.menus[i].bname
                order.time = this.menus[i].time
                order.total = sum
              }
              if(order.menu.length > 0) {
                this.orders.push(order)
              }
            }
          } else {
            this.addrs = []
            this.isopen = false
          }
        })
      },
      confirm() {
        let tel = this.$store.getters.tel
        let sel = document.getElementById('addr')
        let addr = this.addrs[sel.value]
        let orders = this.orders
        let total = this.total
        let vm = this
        this.$axios({
          method: 'post',
          url: '/order/many',
          data: {
            tel,
            addr,
            orders,
            total
          }
        }).then(res => {
          window.console.log(res)
          if(res.data.code === 1) {
            this.menus = []
            this.$store.commit("CLEAR")
            this.close()
            this.$router.push('/myorder?state=2')
          } else {
            alert(res.data.msg)
            if(res.data.indexs) {
              let indexs = res.data.indexs
              let newMenus = []
              for(let i = 0; i < this.menus.length; i++) {
                if(indexs.indexOf(i) === -1) {
                  newMenus.push(this.menus[i])
                }
              }
              window.console.log(newMenus)
              this.$store.commit("CLEAR")
              newMenus.forEach(function(ele) {
                ele.menu.forEach(function(e) {
                  let item = e
                  item.btel = ele.btel
                  item.bname = ele.bname
                  item.time = ele.time
                  vm.$store.commit("ADDITEM", item)
                })
              })
              vm.menus = JSON.parse(vm.$store.getters.items)
              this.total = this.sumall()
            }
            this.close()
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.my-car {
  position: relative;
  .open {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba($color: #ccc, $alpha: 0.9);
    z-index: 100;
    height: 100%;
    .body {
      padding: 20px 50px;
      .close {
        position: absolute;
        top: 40px;
        right: 70px;
        color: #999;
        font-size: 20px;
        font-weight: bold;
        &:hover {
          color: #222;
          cursor: pointer;
        }
      }
      .form-box {
        overflow: hidden;
      }
      .form-field, .form-menu {
        width: 30%;
        padding: 10px;
        line-height: 26px;
        font-size: 14px;
        overflow: hidden;
        border-bottom: 1px solid #ccc;
        box-sizing: border-box;
      }
      .form-field {
        select {
          width: 100%;
          height: 32px;
        }
        h4 {
          margin: 0;
          font-size: 15px;
          color: #0089dc;
        }
      }
      .form-menu {
        float: left;
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
      }
      .buttons {
        text-align: center;
        width: 300px;
        margin: 30px 20px;
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
  .content {
    margin: 20px 100px;
    overflow: hidden; 
    .left {
      float: left;
    }
    .right {
      margin: 0 20px 0 280px; 
      border: 1px solid #e5e5e5;
      background-color: #fff;
      padding: 0 20px 20px;
      min-height: 300px;
      .h3 {
        color: #ffca6c;
      }
      .menus {
        .menu-top {
          overflow: hidden;
          padding: 10px;
          border-bottom: 1px solid #ccc;
          font-size: 18px;
          text-align: center;
          div {
            float: left;
          }
        }
        .col-1 {
          width: 10%;
        }
        .col-4 {
          width: 40%;
        }
        .col-2 {
          width: 20%;
        }
        .menu-item {
          overflow: hidden;
          padding: 0 10px;
          // border-bottom: 1px solid #ccc;
          p {
          margin: 0;
          padding: 15px;
          border-bottom: 1px solid #e5e5e5;
        }
        .menu {
          overflow: hidden;
          border-bottom: 1px solid #ccc;
          margin: 5px;
          div {
            float: left;
            padding: 20px 0px;
            box-sizing: border-box;
            text-align: center;
            .numbox {
              border: 1px solid #ccc;
              padding: 0;
              height: 26px;
              // width: 75px;
              margin-left: 40px;
              span {
                display: inline-block;
                width: 30px;
                border-left: 1px solid #ccc;
                border-right: 1px solid #ccc;
                height: 100%;
              }
              button {
                font-size: 18px;
                width: 24px;
                height: 100%;
              }
            }
          }
          
          button {
            border: none;
            background-color: transparent;
            cursor: pointer;
          }
          .col-4 {
            padding: 0 10px;
            position: relative;
            text-align: left;
            span {
              display: inline-block;
              position: absolute;
              top: 20px;
              left: 150px;
            }
          }
        }
        }
        .menu-bottom {
          padding: 20px;
          text-align: right;
          font-size: 20px;
          button {
            width: 80px;
            height: 36px;
            border: none;
            background-color: #ffca6c;
            font-size: 20px;
            font-weight: bold;
            color: #fff;
            margin-left: 20px;
          }
        }
      }
    }
  }
}

</style>