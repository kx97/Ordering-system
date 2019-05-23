<template>
  <div class="mypage">
    <div class="add-modal" v-show="iscover">
      <div class="cover" style="top: 0px;" id="cover"></div>
      <div class="add-body" style="top: 100px;" id="add-body">
        <div class="top">
          <h3>编辑地址</h3>
          <span class="close" @click="close">X</span>
        </div>
        <form action="" @submit.prevent="stop">
          <div class="form-field">
            <label for="name">姓名</label>
            <input type="text" name="name" id="name" v-model="aname">
          </div>
          <div class="form-field sex">
            <label>性别</label>
            <input type="radio" name="sex" id="man" class="sex" checked value="先生">男
            <input type="radio" name="sex" id="female" class="sex" value="女士">女
          </div>
          <div class="form-field">
            <label for="loca">地址</label>
            <input type="text" name="loca" id="loca" placeholder="请输入详细的地址" v-model="addr">
          </div>
          <div class="form-field">
            <label for="tel">手机号</label>
            <input type="text" name="tel" id="tel" v-model="atel">
          </div>
          <div class="buttons">
            <button class="save" @click="save">保存</button>
            <button class="close" @click="close">取消</button>
          </div>
        </form>
      </div>
    </div>
    <m-header/>
    <div class="content">
      <div class="left">
        <m-links/>
      </div>
      <div class="right">
        <div class="person-info">
          <h3 class="h3">个人信息</h3>
          <div class="box">
            <img src="@/assets/images/user.png" alt="头像">
            <div class="info">Hi, 你好 <strong style="color: #444"> {{name}}</strong></div>
            <div class="le">
              <router-link to="/myorder?state=1">
                <p>我的订单</p>
                <p>{{ocount}} 个</p>
              </router-link>
            </div>
            <div class="le">
              <p>账户余额：{{account}} 元</p>
              <p></p>
              <input type="Number" v-model="money">元
              <button @click="addMon">充值 </button>
            </div>
            <div class="le">
              <router-link to="/myassess">
                <p>我的评价</p>
                <p>{{acount}} 个</p>
              </router-link>
            </div>
          </div>
        </div>
        <div class="setting">
          <h3 class="h3">地址管理</h3>
          <div class="box">
            <div class="add-item" v-for="(a, index) in addrs" :key="index">
              <div class="del-modal">
                <div class="btn">
                  <button @click="del(index)">确定</button>
                  <button @click="cancel(index)">取消</button>
                </div>
              </div>
              <div class="add-head">
                <span>{{a.name}} </span>
                <span> {{a.sex}}</span>
                <button @click="delshow(index)">删除</button>
                <button @click="upd(index)">修改</button>
              </div>
              <p class="tel">电话: {{a.atel}}</p>
              <p class="address">地址: {{a.addr}}</p>
            </div>
            <a class="add-item last" @click="add">
              <p> + 添加新地址(最多5个) </p> 
            </a>
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
        name: this.$store.getters.name,
        tel: this.$store.getters.tel,
        money: 0,
        address: '',
        iscover: false,
        aname: '',
        addr: '',
        atel: '',
        addrs: [],
        index: 0,
        ocount: 0,
        account: 0,
        acount: 0
      }
    },
    watch: {
      '$route'() {
        this.get()
      }
    },
    mounted() {
      this.get()
    },
    methods: {
      get() {
        this.$axios({
          method: 'post',
          url: "/get/user",
          data: {
            tel: this.tel
          }
        }).then(res => {
          if(res.data && res.status === 200) {
            // window.console.log(res)
            let {code, msg} = res.data
            if(code === 1) {
              this.addrs = res.data.address
              this.ocount = res.data.ocount
              this.acount = res.data.acount
              this.account = res.data.account
            } else {
              window.console.log(msg)
            }
          }
        }).catch(err => {
          window.console.log(err)
        })
      },
      stop() {
        window.console.log(this.addrs.length)
        window.console.log(typeof(this.addrs), this.addrs)
        return false
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
      upd(index) {
        this.cover()
        this.aname = this.addrs[index].name
        const sexs = document.getElementsByName('sex')
        for(let i = 0; i < sexs.length; i++) {
          if(this.addrs[index].sex === sexs[i].value) {
            sexs[i].checked = true
          }
        }
        this.addr = this.addrs[index].addr
        this.atel = this.addrs[index].atel
        this.index = this.addrs[index].index
      },
      add() {
        if(this.addrs.length >= 5) {
          alert("地址最多只能添加 5 个")
          return
        } else {
          this.cover()
          this.index = this.addrs.length === 0 ? 0 : this.addrs[this.addrs.length - 1].index + 1
          this.aname = ''
          this.addr = ''
          this.atel = ''
        }
      },
      save() {
        if(this.aname.length === 0) {
          alert('姓名不能为空')
          return
        } else if(this.addr.length === 0) {
          alert('地址不能为空')
          return
        } else {
          let telNum = /\d{11}/
          if(!telNum.test(this.atel)) {
            alert('请输入正确的手机号')
            return
          } else {
            let sexs = document.getElementsByName('sex')
            let sex = ''
            for(let i = 0; i < sexs.length; i++) {
              if(sexs[i].checked) {
                sex = sexs[i].value
              }
            }
            let vm = this
            this.$axios({
              method: 'post',
              url: '/address',
              data: {
                tel: this.tel,
                name: this.aname,
                sex: sex,
                addr: this.addr,
                atel: this.atel,
                index: this.index,
                user: true
              }
            }).then(res => {
              // window.console.log(res)
              if(res.data) {
                let {code, address} = res.data
                if(code === 1 && res.status === 200) {
                  // vm.$store.commit('SAVE_ADDR', JSON.stringify(address))
                  // vm.addrs = JSON.parse(vm.$store.getters.addr)
                  vm.addrs = address
                  vm.close()
                }
              }
            }).catch(err => {
              window.console.log(err)
            })
          }
        }
      },
      close() {
        this.iscover = false
        let body = document.getElementsByTagName('body')[0]
        body.style.overflow = 'auto'
        body.style.height = '100%'
      },
      delshow(index) {
        let delms = document.getElementsByClassName('del-modal')
        delms[index].style.visibility = 'visible'
      },
      del(ind) {
        let vm = this
        let index = this.addrs[ind].index
        // window.console.log(index)
        this.$axios({
          method: 'post',
          url: '/address',
          data: {
            tel: this.tel,
            index: index,
            user: true,
            del: true
          }
        }).then(res => {
          if(res.data) {
            let {code, address} = res.data
            if(code === 1 & res.status === 200) {
              // vm.$store.commit("SAVE_ADDR", JSON.stringify(address))
              // vm.addrs = JSON.parse(vm.$store.getters.addr)
              vm.addrs = address
              vm.cancel(ind)
            }
          }
        })
      },
      cancel(index) {
        let delms = document.getElementsByClassName('del-modal')
        delms[index].style.visibility = 'hidden'
      },
      addMon() {
        this.$axios({
          method: 'post',
          url: '/user/addMon',
          data: {
            money: this.money,
            tel: this.$store.getters.tel
          }
        }).then(res => {
          // window.console.log(res)
          if(res.data.code === 1) {
            this.account = res.data.account
            this.money = 0
          }
        })
      }
    }
  }
</script>

<style lang="scss" >

.mypage {
  .content {
    margin: 20px 100px;
    overflow: hidden;
    .left {
      float: left;
    }
    .right {
      margin: 0 20px 0 280px; 
      .person-info,
      .setting {
        width: 100%;
        border: 1px solid #e5e5e5;
        background-color: #fff;
        padding: 0 20px;
        box-sizing: border-box;
        .h3 {
          border-bottom: 3px solid #ffca6c;
        }
      }
      .person-info {
        height: 200px;
        .box {
          width: 100%;
          overflow: hidden;
          display: flex;
          justify-content: space-around;
          img {
            width: 100;
            height: 100px;
            border-radius: 50%;
          }
          div {
            width: 20%;
            height: 100%;
            // color: #666;
            margin: 10px 0; 
            text-align: center;
            a {
              color: #666;
            }
          }
          .info {
            margin-top: 40px;
          }
          .le {
            border-left: 1px solid #e5e5e5;
            button {
              background-color: #ccc;
            }
            input {
              width: 40px;
            }
          }
        }
      }
      .setting {
        margin-top: 20px;
        background-color: #fff;
        .box {
          display: flex;
          justify-content: flex-start;
          flex-flow: row wrap;
          width: 100%;
        }
        .add-item {
          position: relative;
          width: 30%;
          height: 120px;
          box-sizing: border-box;
          border: 1px solid #e5e5e5;
          background-color: #fcfcfc;
          font-size: 14px;
          padding: 10px;
          margin-left: 20px;
          margin-bottom: 20px;
          overflow: hidden;
          word-break: break-all;
          button {
            float: right;
            border: none;
            background-color: #fff;
            cursor: pointer;
            color: #666;
          }
          &:hover {
            border-color: #0089dc;
            button {
              color: #0089dc;
            }
          }
          .del-modal {
            // display: none;
            visibility: hidden;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #666;
            opacity: 0.7;
            .btn {
              width: 120px;
              height: 30px;
              margin: 40px auto;
              button {
                float: none;
                margin: 0 auto;
                margin-left: 20px;
                background-color: transparent;
                color: #fff;
              }
            }
          }
        }
        .last {
          color: #666;
          text-align: center;
          &:hover {
            color: #0089dc;
            cursor: pointer;
          }
          p {
            margin-top: 10%;
          }
        }

      }
    }
  } 
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
      height: 400px;
      // top: 300px;
      left: 50%;
      margin-left: -200px;
      // margin-top: -200px; 
      border: 1px solid #999;
      background-color: #fff;
      padding: 10px 20px;
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
      } 
      form {
        margin-top: 30px;
      }
      .form-field {
        height: 36px;
        margin-top: 25px;
        line-height: 36px;
        label {
          display: block;
          width: 80px;
          text-align: right;
          float: left;
        }
        input {
          width: 260px;
          height: 100%;
          padding: 10px;
          box-sizing: border-box;
          margin-left: 20px;
          outline: none;
        }
      }
      .sex {
        input {
          width: 15px;
          height: 15px;
          margin-left: 50px;
        }
      }
      .buttons {
        margin-top: 40px;
        margin-left: 80px;
        button {
          width: 120px;
          height: 36px;
          margin-left: 20px;
          border: none;
          color: #fff;
          background-color: #0089dc;
          cursor: pointer;
        }
        .cancel {
          background-color: #fff;
          color: #666;
        }
      }
    }
  }
}


</style>