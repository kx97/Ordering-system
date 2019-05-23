<template>
  <div class="menu">
     <m-header/>
    <div class="content">
      <div class="left">
        <b-links/>
      </div>
      <div class="right">
        <h3 class="h3">菜单管理</h3>
        <div class="add">
          <div class="le">
            <p>选择图片 <a href="javascript:void(0)" @click="del()"> 删除</a></p>
            <input title="" type="file" name="pic" id="pic" @change="picChange($event)" accept="image/gif,image/jpeg,image/jpg,image/png" >
            <img :src="imgUrl" id="img">
          </div>
          <div class="rig">
            <div class="rig-item">
              <label for="name">菜名</label>
              <input type="text" name="name" id="name" v-model="name">
              <label for="price">价格</label>
              <input type="number" name="price" id="price" v-model="price">
            </div>
            <div class="btn">
              <button @click="upload">添加新品</button>
              <button @click="cancel">取消</button>
              <span :class="{'hidden': ishidden}">{{msg}}</span>
            </div>
          </div>
        </div>
        <div class="all">
          <h3 class="h3">全部显示</h3>
          <div class="box">
            <div class="item" v-for="(menu, index) in menus" :key="index">
              <div class="item-cover" v-show="isupdate === index">
                <div class="le">
                  <input title="" type="file" name="pic" id="pic" @change="picChange($event, index)" accept="image/gif,image/jpeg,image/jpg,image/png" >
                  <img :src="imgIndex" :class="'img' + index">
                </div>
                <div class="rig">
                  <div class="rig-item">
                    <label for="name">菜名</label>
                    <input type="text" name="name" id="name" v-model="menu.name">
                    <label for="price">价格</label>
                    <input type="number" name="price" id="price" v-model="menu.price">
                  </div>
                  <div class="btn">
                    <button @click="confirm(index)">确定</button>
                    <button @click="cancelOne()">取消</button>
                  </div>
                </div>
              </div>
              <div class="item-le">
                <img :src="menu.pic">
              </div>
              <div class="item-rig">
                <p>{{menu.name}}</p>
                <p>￥{{menu.price}} &nbsp; &nbsp; <span style="font-size: 12px"> 总销量:</span>  {{menu.saleCount}}</p>
                <button @click="uploadOne(index)" style="color: blue;">修改</button>
                <button @click="idel(index)">删除</button>
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
        ishidden: true,
        isupdate: -1,
        imgUrl: require('@/assets/images/add.jpg'),
        imgIndex: '',
        file: '',
        name: '',
        price: 0,
        msg: '',
        menus: [],
        btel: this.$store.getters.btel
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.$axios({
          method: 'post',
          url: '/menu/get',
          data: {
            btel: this.$store.getters.btel
          }
        }).then(res => {
          if(res.data && res.status === 200) {
            let code = res.data.code
            if(code === 1) {
              this.menus = res.data.menus
            } else {
              window.console.log(res.data.msg)
            }
          }
        }).catch(err => {
          window.console.log(err)
        })
      },
      picChange(e, index) {
        // window.console.log(e)
        window.console.log(index)
        let file = e.target.files[0]
        if(file) {
          let reader = new FileReader()
          let vm = this
          reader.readAsDataURL(file)
          let img
          if(index !== undefined) {
            img = document.getElementsByClassName('img' + index)[0]
          } else {
            img = document.getElementById('img')
          }
          reader.onload = function() {
            if(index !== undefined) {
              vm.imgIndex = this.result
            } else {
              vm.imgUrl = this.result
            }
            var width = 120, //图像大小
            quality = 0.8, //图像质量
            canvas = document.createElement("canvas"),
            drawer = canvas.getContext("2d");
            img.onload = function () {
              canvas.width = width;
              canvas.height = width * (img.height / img.width);
              drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
              if(index !== undefined) {
                vm.imgIndex = canvas.toDataURL('image/png', quality)
                vm.file = vm.dataURItoBlob(vm.imgIndex)
              } else {
                vm.imgUrl = canvas.toDataURL("image/png", quality);
                vm.file = vm.dataURItoBlob(vm.imgUrl)
              }
            }
          }
        }
      },
      dataURItoBlob(base64Data) {
        var byteString;
        if (base64Data.split(",")[0].indexOf("base64") >= 0)
          byteString = atob(base64Data.split(",")[1]);
        else byteString = unescape(base64Data.split(",")[1]);
        var mimeString = base64Data
          .split(",")[0]
          .split(":")[1]
          .split(";")[0];
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], { type: mimeString });
      },
      upload() {
        let formData = new FormData()
        if(this.file === '') {
          this.ishidden = false
          this.msg = "请添加图片"
          return
        }
        if(this.name === '') {
          this.ishidden = false
          this.msg = "请输入菜名"
          return
        }
        formData.append('file', this.file)
        formData.append('name', this.name)
        formData.append('price', this.price)
        formData.append('btel', this.btel)
        this.$axios({
          method: 'post',
          url: '/menu/upload',
          data: formData,
          header: {'Content-Type': 'multipart/form-data'}
        }).then(res => {
          window.console.log(res)
          if(res.data && res.status === 200) {
            let {code, msg} = res.data
            if(code === 1) {
              this.msg = msg
              this.ishidden = false
              this.imgUrl = require('@/assets/images/add.jpg')
              this.price = 0
              this.name = ''
              // this.$router.go(0)
              this.init()
            } else {
              this.msg = msg
              this.ishidden = false
            }
          }
        })
      },
      del() {
        this.imgUrl = require('@/assets/images/add.jpg')
        this.file = ''
      },
      cancel() {
        this.imgUrl = require('@/assets/images/add.jpg')
        this.name = ''
        this.price = 0
      },
      idel(index) {
        let name = this.menus[index].name
        this.$axios({
          method: 'post',
          url: '/menu/del',
          data: {
            name: name,
            btel: this.btel
          }
        }).then(res => {
          if(res.data && res.status === 200) {
            let code = res.data.code
            if(code === 1) {
              // this.menus = res.data.menus
              this.init()
            }
          }
        })
      },
      uploadOne(index) {
        this.isupdate = index
        this.imgIndex = this.menus[index].pic
      },
      confirm(index) {
        let formData = new FormData()
        if(this.file !== '') {
          formData.append('file', this.file)
        }
        window.console.log(this.file)
        formData.append('btel', this.$store.getters.btel)
        formData.append('id', this.menus[index]._id)
        formData.append('name', this.menus[index].name)
        formData.append('price', this.menus[index].price)
        this.$axios({
          method: 'post',
          url: '/menu/update',
          data: formData,
          header: {'Content-Type': 'multipart/form-data'}
        }).then(res => {
          window.console.log(res)
          if(res.data && res.status === 200) {
            let code = res.data.code
            if(code === 1) {
              this.isupdate = -1
              this.file = ''
              // this.$router.go(0)
              this.init()
            } else {
              this.menus = res.data.menus
              this.isupdate = index
              alert(res.data.msg)
            }
          }
        })
      },
      cancelOne() {
        this.isupdate = -1
        this.file = ''
      }
    }
  }
</script>

<style lang="scss" scoped>
.menu .content {
  margin: 20px 100px;
  overflow: hidden;
  .left {
    float: left;
    width: 120px;
  }
  .right {
    background-color: #fff;
    margin: 0 20px 0 280px; 
    border: 1px solid #e5e5e5;
    padding: 0 20px 20px;
    .add {
      padding:0 0 0 80px;
      height: 200px;
      position: relative;
      border-bottom: 2px solid #e5e5e5;
      .le {
        float: left;
        text-align: center;
        width: 122px;
        a {
          font-size: 12px;
          color: #47a7dd;
        }
        input {
          position: absolute;
          width: 120px;
          height: 120px;
          margin: 0 auto;
          z-index: 100;
          opacity: 0;
          cursor: pointer;
          top: 50px;
          left: 90px;
        }
        img {
          position: absolute;
          top: 50px;
          left: 90px;
          width: 120px;
          height: 120px;
          border: 1px solid #e5e5e5;
        }
        span {
          z-index: 1001;
        }
      }
      .rig {
        margin-left: 180px;
        overflow: hidden;
        .rig-item {
          float: left;
          margin: 10px 10px;
          width: 200px;
        }
        label {
          display: block;
          margin: 15px 10px 10px;
        }
        input {
          outline: none;
          height: 32px;
          padding: 10px;
          box-sizing: border-box;
        }
        .btn {
          margin-left: 260px;
          position: relative;
          button {
            display: block;
            margin-top: 53px;
            width: 80px;
            height: 30px;
            // border: none;
            background-color: #47a7dd;
            color: #fff;
            border-radius: 5px;
            // cursor: pointer;
          }
          span {
            position: absolute;
            display: block;
            top: 30px;
            left: 100px;
            font-size: 16px;
            padding: 5px 10px;
            height: 30px;
            line-height: 30px;
            background-color: #e5e5e5;
          }
          .hidden {
            visibility: hidden;
          }
        }
      }
    }
    .all {
      // margin-top: 20px;
      width: 100%;
      .box {
        display: flex;
        justify-content: flex-start;
        flex-flow: row wrap;
      }
      .item {
        width: 320px;
        height: 120px;
        border: 1px solid #e5e5e5;
        overflow: hidden;
        margin: 30px;
        background-color: #f6f6f6; 
        position: relative;
        .item-cover {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #e5e5e5;
          .le {
            float: left;
            text-align: center;
            width: 122px;
            a {
              font-size: 12px;
              color: #47a7dd;
            }
            input {
              position: absolute;
              width: 120px;
              height: 120px;
              margin: 0 auto;
              z-index: 100;
              opacity: 0;
              cursor: pointer;
            }
            img {
              width: 120px;
              height: 120px;
              // border: 1px solid #e5e5e5;
            }
            span {
              z-index: 1001;
            }
          }
          .rig {
            margin-left: 125px;
            overflow: hidden;
            .rig-item {
              float: left;
              font-size: 14px;
              margin: 5px 0;
              // width: 200px;
            }
            input {
              outline: none;
              height: 30px;
              // padding: 10px;
              width: 150px;
              box-sizing: border-box;
              margin: 5px;
            }
            .btn {
              button {
                width: 80px;
                height: 30px;
                // border: none;
                background-color: transparent;
                color: blue;
                // cursor: pointer;
              }
            }
          }
        }
        .item-le {
          float: left;
          img {
            border-right: 1px solid #e5e5e5;
          }
        } 
        .item-rig {
          margin-left: 140px;
          button {
           margin: 0 auto;
          //  border: none;
           background: none;
           color: red;
          //  cursor: pointer;
           width: 60px;
          }
        }
      }
    }
  }
}
</style>