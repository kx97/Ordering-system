const router = require('koa-router')()
const Busi = require('../dbs/models/business').Busis
const redis = require('koa-redis')
const OSS = require('ali-oss')
const fs = require('fs')
const multer = require('koa-multer')
const config = require('../dbs/config') 
const Recli = new redis().client

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "server/public/upload/")
  },
  filename: function (req, file, cb) {
    var fileFormat = (file.mimetype).split("/")[1];  //以点分割成数组，数组的最后一项就是后缀名
    cb(null, Date.now() + "." + fileFormat);
  }
})

const upload = multer({storage: storage});
const client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: config.sendsms.accessKeyId,
  accessKeySecret: config.sendsms.secretAccessKey,
  bucket: 'test-dingd'
})

const createToken = require('../token/createToken')
const checkBtoken = require('../token/checkBtoken')

router.prefix('/busi')

router.post('/updatepic', upload.single('file'), async (ctx, next) => {
  let file = ctx.req.file
  let btel = ctx.req.body.btel
  let filename = file.filename
  let uplodePath = '/images/' + filename 
  client.put(uplodePath, file.path).then(res => {
    fs.unlink(file.path, async function(err) {
      if(err) {
        return console.log(err)
      } else {
        return console.log('文件删除成功'); 
      }
    })
  })
  let path = "http://test-dingd.oss-cn-beijing.aliyuncs.com/images/"
  let pic = path + filename
  console.log(pic)
  let doc = await Busi.updateOne({telNumber: btel}, {$set: {pic: pic}}) 
  console.log(doc)
  if(doc) {
    let busi = await Busi.findOne({telNumber: btel}, {pic: 1})
    console.log(busi)
    ctx.body = {
      code: 1,
      msg: '修改成功',
      pic: busi.pic
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '修改失败'
    }
    return
  }
  await next()
})

router.post('/register', async (ctx, next) => {
  console.log(ctx.request.body)
  let {name,tel, code, pwd} = ctx.request.body
  let saveCode = await Recli.hget(`tel:${tel}`, 'code')
  let saveExpire = await Recli.hget(`tel:${tel}`, 'expire')

  if(new Date().getTime() - saveExpire > 0) {
    ctx.body = {
      code: 0,
      msg: "验证码过期，请重新获取"
    }
    return 
  } else {
    if(code === saveCode) {
      let doc = await Busi.findOne({telNumber: tel})
      if(doc) {
        ctx.body = {
          code: 0,
          msg: "手机号早已被注册"
        }
        return
      } else {
        const newBusi = await Busi.create({
          storeName: name,
          telNumber: tel,
          password: pwd,
          token: createToken(tel),
          state: "打烊",
          tags:'美食',
          saleCount: 0,
          time: 50,
          pic: '',
          account: 0
        })
        if(newBusi) {
          ctx.body = {
            code: 1,
            msg: "注册成功，请前往登录"
          }
        } else {
          ctx.body = {
            code: 0,
            msg: "注册失败，请重新注册"
          }
          return 
        }
      }
    } else {
      ctx.body = {
        code: 0,
        msg: "验证码不正确，请重新输入"
      }
      return
    }
  }

  // const newBusi = await Busi.create({
  //   storeName: name,
  //   telNumber: tel,
  //   password: pwd,
  //   token: createToken(tel),
  //   state: "打烊",
  //   tags:'美食',
  //   saleCount: 0,
  //   time: 50
  // })
  // if(newBusi) {
  //   ctx.body = {
  //     code: 1,
  //     msg: "注册成功，请前往登录"
  //   }
  // } else {
  //   ctx.body = {
  //     code: 0,
  //     msg: "注册失败，请重新注册"
  //   }
  //   return 
  // }
  await next()
})

router.post('/login', async (ctx, next) => {
  // console.log("111")
  console.log(ctx.request.body)
  let {tel, pwd} = ctx.request.body
  let doc = await Busi.findOne({"telNumber": tel})
  if(doc) {
    if(ctx.request.body.code) {
      let code = ctx.request.body.code
      let saveCode = await Recli.hget(`tel:${tel}`, 'code')
      let saveExpire = await Recli.hget(`tel:${tel}`, 'expire')
      if(new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: 0,
          msg: "验证码已过期，请重新获取"
        }
        return
      } else {
        if(code === saveCode) {
          await Busi.updateOne({"telNumber": tel}, {$set: {"password": pwd}})
          // let name = await Busi.findOne({telNumber: tel})
          let token = createToken(tel)
          doc.token = token
          try {
            await doc.save()
            ctx.body = {
              code: 1,
              msg: "密码已修改，登录成功",
              name: doc.storeName,
              tel: doc.telNumber,
              state: doc.state,
              tags: doc.tags,
              token
            }
          } catch (err) {
            ctx.body = {
              code: 0,
              msg: "密码修改失败，请重新提交"
            }
            return
          }
        } else {
          ctx.body = {
            code: 0,
            msg: "验证码错误，请重新输入"
          }
          return
        }
      }
    } else {
      if(pwd !== doc.password) {
        ctx.body = {
          code: 0,
          msg: "密码错误，请重新输入"
        }
        return
      } else {
        let token = createToken(tel)
        doc.token = token
        try {
          await doc.save()
          ctx.body = {
            code: 1,
            msg: "登录成功",
            name: doc.storeName,
            tel: doc.telNumber,
            state: doc.state,
            tags: doc.tags,
            token
          }
        } catch (err) {
          ctx.body = {
            code: 0,
            msg: "登录失败，请重新登录"
          }
          return
        }
      }
    }
  } else {
    ctx.body = {
      code: 0,
      msg: "此手机号未注册，请前往注册"
    }
    return
  }
  await next()
})

router.post('/update', checkBtoken,async (ctx, next) => {
  console.log(ctx.request.body)
  if(ctx.request.body.isname) {
    let {tel, newName} = ctx.request.body
    let doc = await Busi.update({"telNumber": tel}, {$set: {"storeName": newName}})
    if(doc) {
      let busi = await Busi.findOne({"telNumber": tel})
      console.log(busi)
      ctx.body = {
        code: 1,
        msg: "修改成功",
        name: busi.storeName
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '修改失败'
      }
      return
    }
  }
  if(ctx.request.body.isstate) {
    let {tel, state} = ctx.request.body
    let li = await Busi.findOne({telNumber: tel})
    if(li.license) {
      let doc = await Busi.updateOne({"telNumber": tel}, {$set: {"state": state}})
      if(doc) {
        let busi = await Busi.findOne({"telNumber": tel})
        ctx.body = {
          code: 1,
          msg: "修改成功",
          state: busi.state
        }
      } else {
        ctx.body = {
          code: 0,
          msg: "修改失败"
        }
        return
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '你还没有经验许可，不能营业'
      }
      return
    }
  }
  if(ctx.request.body.istags) {
    let {btel, tags} = ctx.request.body
    let doc = await Busi.updateOne({"telNumber": btel}, {$set: {'tags': tags}})
    if(doc.nModified !== 0) {
      let busi = await Busi.findOne({"telNumber": btel}) 
      ctx.body = {
        code: 1,
        msg: 'tag 修改成功',
        tags: busi.tags
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '修改失败'
      }
      return
    }
  }
  if(ctx.request.body.istime) {
    let {btel, time} = ctx.request.body
    let doc = await Busi.updateOne({"telNumber": btel}, {$set: {'time': time}})
    if(doc.nModified !== 0) {
      let busi = await Busi.findOne({"telNumber": btel}) 
      ctx.body = {
        code: 1,
        msg: 'tag 修改成功',
        time: busi.time
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '修改失败'
      }
      return
    }
  }
  await next()
})




module.exports = router
