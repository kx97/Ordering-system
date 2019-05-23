<template>
  <div class="order">
     <m-header/>
    <div class="content">
      <div class="left">
        <b-links/>
      </div>
      <div class="right">
        <div class="tab">
          <div class="tab-hd">
            <ul class="list">
              <li :tabid="item.tabid" class="list-item" :class="{'action': item.tabid == state}" v-for="(item, index) in list" :key="index" @click="change(index)">
                <a href='javascript:void(0)'>{{item.item}}</a> 
              </li>
            </ul>
          </div>
          <div class="tab-bd">
            <h3 v-show="isshow" style="text-align: center">没有相关的订单信息</h3>
            <div class="orders">
              <div class="order-item" v-for="(order, index) in orders" :key="index">
                <div class="top">
                  <span>店名: {{order.bname}} &nbsp; &nbsp; </span> 
                  <span>联系方式: {{order.btel}} &nbsp; &nbsp; </span> 
                  <span>订单日期：{{order.orderTime.split('T')[0]}} &nbsp; &nbsp;</span>
                  <span>总金额: {{order.price}} 元</span>
                  <button v-show="order.state === 0 || order.state === 3" @click="del(index)">删除</button>
                  <span v-show="order.state === 1 && !order.arriTime" style="color: blue;">&nbsp; &nbsp;&nbsp;已接单</span>
                  <button v-show="order.state === 1 && !order.arriTime" style="color: blue;" @click="arri(index)">&nbsp; &nbsp;&nbsp;确认送达</button>
                  <button v-show="order.state === 2" @click="refuse(index)">拒绝</button>
                  <button v-show="order.state === 2" @click="accept(index)">接单</button>
                  <span v-show="order.state === 3" style="color: blue;">&nbsp; &nbsp;&nbsp;订单已被取消</span>
                </div>
                <div class="menu-info">
                  <table>
                    <thead>
                      <tr>
                        <th class="name">菜名</th>
                        <th class="num">数量</th>
                        <th class="price">价格</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for='(menu, i) in order.menu' :key="i">
                        <td>{{menu.name}}</td>
                        <td>x {{menu.num}}</td>
                        <td>￥ {{menu.price}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="user-info">
                  <p>
                    姓名: {{order.addr.name}} {{order.addr.sex}}&nbsp;&nbsp; 
                    电话: {{order.addr.atel}}
                  </p>
                  <p>地址: {{order.addr.addr}}</p>
                  <p>
                    下单时间：{{order.orderTime.split('T')[1].split('.')[0]}} &nbsp;&nbsp;
                    <span v-if="order.state === 0">送达时间：{{order.arriTime.split('T')[1].split('.')[0]}}</span> 
                  </p>
                  <span class="stishi" v-if="order.state === 1 && !order.arriTime">请在 {{arris[index].split('T')[1].split('.')[0]}} 左右将外卖送达</span>
                  <span class="stishi" v-if="order.state === 1 && order.arriTime">外卖已经在{{order.arriTime.split('T')[1].split('.')[0]}}送到，等待用户收货</span>
                </div>
              </div>
            </div>
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
import bLinks from '@/components/busiLinks.vue'
  export default {
    components: {
      mHeader,
      mFooter,
      bLinks
    },
    data() {
      return {
        isshow: false,
        state: this.$route.query.state === undefined ? 0 : this.$route.query.state,
        list: [
          {item: '已完成', tabid: 0},
          {item: '正在配送', tabid: 1},
          {item: '待处理', tabid: 2},
          {item: '失效订单', tabid: 3}
        ],
        orders: [],
        arris: []
      }
    },
    watch: {
      '$route'() {
        this.state = this.$route.query.state === undefined ? 0 : this.$route.query.state
        this.init()
      }
    },
    mounted() {
      // let vm = this
      // this.timer = window.setInterval(function() {
      //   vm.init()
      // }, 1000)
      this.init()
    },
    destroyed() {
      window.clearInterval(this.timer)
    },
    methods: {
      init() {
        this.$axios({
          method: 'post',
          url: '/order/get/busi',
          data: {
            btel: this.$store.getters.btel,
            state: this.state
          }
        }).then(res => {
          // window.console.log(res)
          if(res.data.code === 1) {
            this.orders = res.data.orders
            this.arris = res.data.arris
            this.isshow = false
          } else {
            this.orders = []
            this.isshow = true
          }
        })
      },
      change(index) {
        let items = document.getElementsByClassName('list-item')
        this.state = items[index].getAttribute('tabid')
        if(this.state == 0) {
          this.$router.replace('/order')
        } else {
          this.$router.replace('/order?state=' + this.state)
        }
       
        this.init()
      },
      del(index) {
        let vm = this
        let id = this.orders[index]._id
        this.$axios({
          method: 'post',
          url: '/order/del/busi',
          data: {
            id: id,
            btel: this.orders[index].btel
          }
        }).then(res => {
          if(res.data.code === 1) {
           this.init()
            vm.isshow = false
          } else {
            vm.isshow = true
            this.orders = []
          }
        })
      },
      accept(index) {
        this.$axios({
          method: 'post',
          url: '/order/accept',
          data: {
            id: this.orders[index]._id,
            price: this.orders[index].price,
            btel: this.$store.getters.btel,
            tel: this.orders[index].tel
          }
        }).then(res => {
          window.console.log(res)
          if(res.data.code === 1) {
            // this.$router.replace('/order?state=1')
            this.init()
          }
        })
      },
      refuse(index) {
        window.console.log(index)
        this.$axios({
          method: 'post',
          url: '/order/refuse',
          data: {
            id: this.orders[index]._id
          }
        }).then(res => {
          if(res.data.code === 1) {
            this.init()
          }
        })
      },
      arri(index) {
        this.$axios({
          method: 'post',
          url: '/order/arri',
          data: {
            id: this.orders[index]._id
          }
        }).then(res => {
          window.console.log(res)
          if(res.data.code === 1) {
            this.init()
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.order .content {
  margin: 20px 100px;
  overflow: hidden;
  .left {
    float: left;
  }
  .right {
    margin: 0 20px 0 280px;
    padding-bottom: 20px; 
    background-color: #fff;
    .tab {
      width: 100%;
      ul {
        margin: 0;
        padding: 0;
        li {
          float: left;
          padding: 10px 20px;
        }
      }
      .tab-hd {
        overflow: hidden;
        padding: 20px 20px 0 20px;
        a {
          color: #444;
          font-size: 18px;
        }
        li.action {
          border-bottom: 3px solid #0089dc;
          a {
            color: #0089dc;
          }
        }
      }
      .tab-bd {
        min-height: 300px;
        border-top: 2px solid #ccc;
        margin: -2px 20px 0 20px;
        padding: 20px 0;
        .order-item {
          border: 1px solid #ccc;
          width: 100%;
          margin: 20px 0px;
          overflow: hidden;
          font-size: 14px;
          background-color: #f6f6f6;
          div {
            float: left;
            padding: 10px 20px;
            box-sizing: border-box;
          }
          .top {
            width: 100%;
            border-bottom: 1px solid #ccc;
            button {
              float: right;
              border: none;
              background-color: transparent;
              color: blue;
              cursor: pointer;
            }
          }
          .menu-info {
            width: 50%;
            table {
              text-align: left;
              thead {
                border-bottom: 1px solid #ccc;
              }
              .name {
                width: 30%;
              }
              .num, .price {
                width: 10%;
              }
            }
          }
          .user-info {
            width: 50%;
            border-left: 1px solid #ccc;
            p {
              margin: 0;
              padding: 10px;
              border-bottom: 1px solid #ccc;
            }
            .stishi {
              display: block;
              color: red;
              padding: 7px;
            }
          }
        }
      }
    }
  }
}
</style>