<template>
  <div class="business">
    <m-header/>
    <div class="content">
      <div class="left">
        <b-links/>
      </div>
      <div class="right">
        <div class="busi-info">
          <h3 class="h3">店铺信息</h3>
          <div class="box">
            <button @click="uppic">上传</button>
            <div class="img">
              <input type="file" name="pic" id="pic" @change="picChange($event)" accept="image/gif,image/jpeg,image/jpg,image/png">
              <img :src="imgUrl" alt="头像" id="img">
            </div>
            <div class="info">你的店铺 <strong style="color: #444; font-size: 18px;"> {{name}}</strong></div>
            <div class="le">
              <router-link to="/menu">
                <p>菜单</p>
                <p>{{mcount}} 个</p>
              </router-link>
            </div>
            <div class="le">
              <router-link to="/order?state=2">
                <p>待处理订单</p>
                <p>{{ocount}}个</p>
              </router-link>
            </div>
            <div class="le">
              <p>店铺钱包</p>
              <p>{{account}} 元</p>
            </div>
          </div>
        </div>
        <div class="setting">
          <h3 class="h3">店铺设置</h3>
          <div class="box">
            <div class="rig">
              <label>你的店铺正在 <span style="font-size: 22px; color: #0089dc">{{state}}</span> 中</label>
              <button @click="updstate">{{btnText}}</button>
              &nbsp;&nbsp;&nbsp;
              <label>配送时间</label>
              <input type="number" name="time" id="time" v-model="time">&nbsp;分钟
              <button @click="uptime">修改</button>
            </div>
            <div class="le">
              <label for="stoname">店铺名</label>
              <input type="text" name="stoname" id="stoname" v-model="iname">
              <button @click="updname">更换</button>
            </div>
            <div class="tags">
              <h4>店铺标签：<span style="font-weight: normal"> {{checkedTag}}</span></h4>
              <button @click="uptags">确定</button>
              <div class="tags-box" v-for="(tag, index) in tags" :key="index">
                <div class="tag-box">
                  <label :for="tag.id">{{tag.value}}</label>
                  <input type="checkbox" name="tag" :value="tag.value" :id="tag.id" @change="changeTags">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="infos">
          <h3 class="h3">上传审核</h3>
          <p v-if="license">审核已通过，可以进行营业</p>
          <p v-else-if="li">正在审核，请稍等</p>
          <div class="license-box" v-else>
            <label for="license">食品经营执照（图片）</label>
            <input type="file" name="license" id="license" @change="files($event)" accept="image/gif,image/jpeg,image/jpg,image/png">
            <button @click="upfiles">上传审核</button>
          </div>
          <!-- <img :src="license" alt=""> -->
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
        name: this.$store.getters.storeName,
        iname: this.$store.getters.storeName,
        imgUrl: require('@/assets/images/user.png'),
        file: '',
        file1: '',
        mcount: 0,
        ocount: 0,
        account: 0,
        time: 0,
        state: '',
        btnText: '',
        tags: [
          {value: '美食', id: 'ms'},
          {value: '炸鸡', id: 'zj'},
          {value: '快餐', id: 'kc'},
          {value: '小吃', id: 'xc'},
          {value: '饮品', id: 'yp'},
          {value: '甜品', id: 'tp'},
        ],
        checkedTag: '',
        license: '',
        li: ''
      }
    },
    watch: {
      '$route'() {
        this.init()
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.$axios({
          method: 'post',
          url: '/get/busi',
          data: {
            btel: this.$store.getters.btel
          }
        }).then(res => {
          if(res.data.code === 1) {
            let {busi, mcount, ocount, license} = res.data
            if(busi.pic) {
              this.imgUrl = busi.pic
            }
            if(busi.license) {
              this.license = busi.license
            }
            this.li = license
            this.state = busi.state
            this.checkedTag = busi.tags
            this.time = busi.time
            this.mcount = mcount
            this.ocount = ocount
            this.account = busi.account
            this.btnText = this.state === "营业" ? "打烊" : "营业"
          }
          window.console.log(res)
        })
      },
      updname() {
        let vm = this
        this.$axios({
          method: 'post',
          url: '/busi/update',
          data: {
            tel: this.$store.getters.btel,
            newName: this.iname,
            isname: true
          }
        }).then(res => {
          if(res.data && res.status === 200) {
            let {code, name} = res.data
            if(code === 1) {
              vm.$store.commit("SAVE_BNAME", name)
              vm.name = vm.$store.getters.storeName
            }
          }
        })
      },
      updstate() {
        let state;
        if(this.license === '') {
          alert('你需要上传许可证进行验证，才能营业')
          return
        }
        if(this.btnText === '打烊') {
          state = '打烊'
        } else {
          state = "营业"
        }
        let vm = this
        this.$axios({
          method: 'post',
          url: '/busi/update',
          data: {
            tel: this.$store.getters.btel,
            state,
            isstate: true
          }
        }).then(res => {
          if(res.data && res.status === 200) {
            window.console.log(res.data)
            let {code, state} = res.data
            if(code === 1) {
              vm.state = state
              vm.btnText = this.state === "营业" ? "打烊" : "营业"
            }
          }
        })
      },
      changeTags() {
        let taglist = document.getElementsByName('tag')
        let tagbox = document.getElementsByClassName('tag-box')
        let check = []
        for(let i = 0; i < taglist.length; i++) {
          if(taglist[i].checked === true) {
            tagbox[i].className = 'tag-box tag-checked'
            check.push(taglist[i].value)
          } else {
            tagbox[i].className = 'tag-box'
          }
        }
        this.checkedTag = check.join('; ')
        window.console.log(check)
      },
      uptags() {
        let btel = this.$store.getters.btel
        let vm = this
        this.$axios({
          method: 'post',
          url: '/busi/update',
          data: {
            btel: btel,
            tags: this.checkedTag,
            istags: true
          }
        }).then(res => {
          window.console.log(res)
          vm.checkedTag = res.data.tags
        })
      },
      uptime() {
         let btel = this.$store.getters.btel
        let vm = this
        this.$axios({
          method: 'post',
          url: '/busi/update',
          data: {
            btel: btel,
            time: this.time,
            istime: true
          }
        }).then(res => {
          window.console.log(res)
          vm.time = res.data.time
        })
      },
      picChange(e) {
        let file = e.target.files[0]
        if(file) {
          let reader = new FileReader()
          reader.readAsDataURL(file)
          let vm = this
          let img = document.getElementById('img')
          reader.onload = function() {
            vm.imgUrl = this.result
            var width = 180, quality = 0.8,
            canvas = document.createElement('canvas'),
            drawer = canvas.getContext('2d')
            img.onload = function() {
              canvas.width = width
              canvas.height = width / img.width * img.height
              drawer.drawImage(img, 0, 0, canvas.width, canvas.height)
              vm.imgUrl = canvas.toDataURL('image/png', quality)
              vm.file = vm.dataURItoBlob(vm.imgUrl)
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
      uppic() {
        let formDate = new FormData()
         if(this.file === '') {
          alert('请添加图片')
          return
        }
        formDate.append('file', this.file)
        formDate.append('btel', this.$store.getters.btel)
        this.$axios({
          method: 'post',
          url: '/busi/updatepic',
          data: formDate
        }).then(res => {
          window.console.log(res)
          if(res.data.code === 1) {
            let img = document.getElementById('img')
            let vm = this
            alert('上传成功')
            img.onload = function() {
              vm.imgUrl = res.data.pic
            }
            // window.location.reload()
          }
        })
      },
      files(e) {
        this.file1 = e.target.files[0]
        window.console.log(this.file1)
      },
      upfiles() {
        if(this.file1 !== '') {
          let formDate = new FormData()
          formDate.append('file', this.file1)
          formDate.append('btel', this.$store.getters.btel)
          this.$axios({
            method: 'post',
            url: '/upfiles',
            data: formDate
          }).then(res => {
            window.console.log(res)
            if(res.data.code === 1) {
              this.init()
            }
          })
        } else {
          alert('请确认文件已选择')
          return
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.business .content {
  margin: 20px 100px;
  overflow: hidden;
  .left {
    float: left;
  }
  .right {
    margin: 0 20px 0 280px; 
    .busi-info,
    .setting,
    .infos {
      width: 100%;
      border: 1px solid #e5e5e5;
      background-color: #fff;
      padding: 0 20px 20px;
      box-sizing: border-box;
    }
    .busi-info {
      height: 200px;
      .box {
        width: 100%;
        overflow: hidden;
        display: flex;
        justify-content: space-around;
        .img {
          position: relative;
          width: 180px;
          height: 100px;
          #pic {
            position: absolute;
            width: 100%;
            height: 100%;
            margin: 0 auto;
            z-index: 100;
            opacity: 0;
            cursor: pointer;
            left: 0;
          }
          img {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 5px;
            left: 0;
          }
        }
        div {
          width: 20%;
          height: 100%;
          text-align: center;
          a {
            color: #666;
          }
        }
        .info {
          margin-top: 20px;
          padding-right: 10px;
          font-size: 16px;
        }
        .le {
          border-left: 1px solid #e5e5e5;
        }
      }
    }
    .setting {
      margin-top: 20px;
      // background-color: #fff;
      .box {
        width: 700px;
        padding: 0 40px 30px;
        box-sizing: border-box;
        label {
          font-weight: bold;
        }
        button {
          margin-left: 20px;
          background-color: #0089dc;
          width: 80px;
          height: 32px;
          font-size: 16px;
          color: #fff;
          border-radius: 5px;
        }
        .le {
          padding: 30px 20px;
          input {
            margin-left: 20px; 
            padding: 10px;
            width: 200px;
            height: 36px;
            box-sizing: border-box;
            font-size: 16px;
          }
        }
        .rig {
          padding: 20px;
          line-height: 32px;
          border-bottom: 2px solid #ccc;
          input {
            margin-left: 10px;
            width: 50px;
            height: 30px;
            box-sizing: border-box;
            font-size: 16px;
          }
          #time {
            text-align: center;
          }
        }
        .tags {
          padding: 0 30px;
          border-top: 2px solid #ccc;
          position: relative;
          overflow: hidden;
          button {
            position: absolute;
            top: 15px;
            right: 100px;
          }
          .tag-box {
            width: 60px;
            height: 30px;
            line-height: 30px;
            border: 1px solid #f6f6f6;
            float: left;
            margin: 10px;
            text-align: center;
            background-color: #e6e6e6;
            label {
              cursor: pointer;  
              display: block;
              font-weight: normal;
              margin: 0 auto;
              width: 100%; 
            }
            input {
              visibility: hidden;
            }
          }
          .tag-checked {
            color: #fff;
            background-color: #109cf3;
          }
        }
      }
    }  
    .infos {
      margin-top: 20px;
      min-height: 200px;
      label {
        margin: 10px;
      }
      input {
        width: 200px;
      }
      button {
        font-size: 18px;
        background-color: #0089dc;
        color: #fff;
        margin: 20px;
        padding: 10px;
        border-radius: 4px;
      }
    }
  }    
}

</style>