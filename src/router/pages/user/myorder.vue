<template>
  <div class="my-order">
     <m-header/>
    <div class="content">
      <div class="left">
        <m-links/>
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
                <div class="ass-box" v-show="isass === index">
                  <p>写下你对本次服务的评价吧！</p>
                  <textarea name="content" id="content" cols="50" rows="6" v-model="content"></textarea>
                  <button @click="determine(index)">确定</button>
                  <button @click="cancel">取消</button>
                </div>
                <div class="top">
                  <span>店名: {{order.bname}} &nbsp; &nbsp; </span> 
                  <span>联系方式: {{order.btel}} &nbsp; &nbsp; </span> 
                  <span>订单日期：{{order.orderTime.split('T')[0]}} &nbsp; &nbsp;</span>
                  <span>总金额: {{order.price}} 元</span>
                  <button v-show="order.state === 0 && !order.isAssess" @click="showAss(index)">评价</button>
                  <button v-show="order.state === 0 || order.state === 3" @click="del(index)" style="color: red;">删除</button>
                  <span v-show="order.state === 0 && order.isAssess" style="color: blue; margin-left: 20px;">已评价</span>
                  <button v-show="order.state === 1" @click="confirm(index)">确认收货</button>
                  <span v-show="order.state === 2 && !order.refuse" style="color: blue;">&nbsp; &nbsp;&nbsp;等待商家接单...</span>
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
                    姓名: {{order.addr.name}} {{order.addr.sex}} &nbsp;&nbsp; 
                    电话: {{order.addr.atel}}
                  </p>
                  <p>地址: {{order.addr.addr}}</p>
                  <p>
                    <span>下单时间：{{order.orderTime.split('T')[1].split('.')[0]}}</span>  &nbsp;&nbsp;
                    <span v-if="order.state === 0">送达时间：{{order.arriTime.split('T')[1].split('.')[0]}}</span> 
                  </p>
                  <span class="stishi" v-if="order.state === 1 && order.arriTime === undefined">你的外卖预计在{{arris[index].split('T')[1].split('.')[0]}}左右送到</span>
                  <span class="stishi" v-if="order.state === 1 && order.arriTime">你的外卖已经在{{order.arriTime.split('T')[1].split('.')[0]}}送到，请确认收货</span>
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
import mLinks from '@/components/myLinks.vue'
  export default {
    components: {
      mHeader,
      mFooter,
      mLinks
    },
    data() {
      return {
        isshow: false,
        state: this.$route.query.state === undefined ? 0 : this.$route.query.state,
        list: [
          {item: '已完成', tabid: 0},
          {item: '正在配送', tabid: 1},
          {item: '等待商家接单', tabid: 2},
          {item: '失效订单', tabid: 3}
        ],
        orders: [],
        arris: [],
        isass: -1,
        content: '',
        times: [],
        ormsg: []
      }
    },
    watch: {
      '$route'() {
        this.state = this.$route.query.state === undefined ? 0 : this.$route.query.state
        this.init()
      }
    },
    created() {
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
          url: '/order/get/user',
          data: {
            utel: this.$store.getters.tel,
            state: this.state
          }
        }).then(res => {
          if(res.data.code === 1) {
            for(let i = 0; i < res.data.arris.length; i++) {
              this.arris.push(res.data.arris[i])
            }
            this.orders = res.data.orders
            this.isshow = false
            window.console.log(this.arris)
          } else {
            this.orders = []
            this.arris = []
            this.isshow = true
          }
        })
      },
      change(index) {
        this.state = index
        if(this.state == 0) {
          this.$router.replace('/myorder')
        } else {
          this.$router.replace('/myorder?state=' + this.state)
        }
        this.init()
      },
      confirm(index) {
        let id = this.orders[index]._id
        this.$axios({
          method: 'post',
          url: '/order/confirm',
          data: {
            id: id,
            tel: this.orders[index].tel
          }
        }).then(res => {
          if(res.data.code === 1) {
            this.isshow = false
            this.init()
          } else {
            if(res.data.code === -1) {
              alert(res.data.msg)
            } else {
              this.orders = []
              this.isshow = true
            }
          }
        })
      },
      del(index) {
        let id = this.orders[index]._id
        this.$axios({
          method: 'post',
          url: '/order/del/user',
          data: {
            id: id,
            tel: this.orders[index].tel
          }
        }).then(res => {
          if(res.data.code === 1) {
            this.init()
            this.isshow = false
          } else {
            this.orders = []
            this.isshow = true
          }
        })
      },
      showAss(index) {
        this.isass = index
      },
      determine(index) {
        this.$axios({
          method: 'post',
          url: '/assess/insert',
          data: {
            orderId: this.orders[index]._id,
            utel: this.orders[index].tel,
            btel: this.orders[index].btel,
            bname: this.orders[index].bname,
            content: this.content
          }
        }).then(res => {
          // window.console.log(res)
          if(res.data.code === 1) {
            this.isass = -1
            this.init()
          }
        })
      }, 
      cancel() {
        this.isass = -1
      }
    }
  }
</script>

<style lang="scss" scoped>
.my-order .content {
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
        overflow: hidden;
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
          border-bottom: 3px solid #ffca6c;
          a {
            color: #ffca6c;
          }
        }
      }
      .tab-bd {
        min-height: 300px;
        border-top: 2px solid #ccc;
        margin: -2px 20px 0 20px;
        padding: 0;
        .order-item {
          border: 1px solid #ccc;
          width: 100%;
          margin: 20px 0px;
          overflow: hidden;
          font-size: 14px;
          background-color: #f6f6f6;
          position: relative;
          .ass-box {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba($color: #ccc, $alpha: 0.9);
            #content {
              resize: none; 
              display:block;
              margin: 10px 0;
            }
            p {
              margin: 0;
            }
            button {
              display: inline-block;
              width: 80px;
              height: 30px;
              border: none;
              margin-left: 40px;
              font-size: 16px;
              background-color: transparent;
              color: #31749b;
            }
          }
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