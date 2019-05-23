const router = require('koa-router')()
const redis = require('koa-redis')
const mongoose = require('mongoose')
const SMSClient = require('@alicloud/sms-sdk')
const OSS = require('ali-oss')
const fs = require('fs')
const multer = require('koa-multer')
const config = require('../dbs/config') 
const User = require('../dbs/models/user').Users 
const Busi = require('../dbs/models/business').Busis
const Order = require('../dbs/models/order').Orders
const Assess = require('../dbs/models/assess').Assess
const Menu = require('../dbs/models/menu').Menus
const Review = require('../dbs/models/review').Review
const Admin = require('../dbs/models/admins').Admin

const Recli = new redis().client
const checkToken = require('../token/checkToken')
const checkBtoken = require('../token/checkBtoken')

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

router.prefix('/')

router.get('/getRe', async (ctx, next) => {
  let reviews = await Review.find({})
  if(reviews.length > 0) {
    ctx.body = {
      code: 1,
      msg: '获取成功',
      reviews
    } 
  } else {
      ctx.body = {
        code: 0,
        msg: '获取失败'
      }
      return
    }
})

router.post('/admin', async (ctx, next) => {
  let {name, pwd} = ctx.request.body
  // await Admin.create({
  //   name,
  //   pwd
  // })
  let admin = await Admin.findOne({name: name}, {name: 1, pwd: 1})
  console.log(admin)
  if(admin.pwd === pwd) {
    ctx.body = {
      code: 1,
      msg: '登录成功',
      admin: admin.name
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '登录失败'
    }
    return
  }
})

router.post('/review', async (ctx, next) => {
  if(ctx.request.body.success) {
    let {id} = ctx.request.body
    id = mongoose.Types.ObjectId(id)
    let review = await Review.findOne({_id: id}, {license: 1, btel: 1})
    let doc = await Busi.updateOne({telNumber: review.btel}, {$set: {license: review.license}})
    if(doc) {
      await Review.deleteOne({_id: id})
      let reviews = await Review.find({})
      ctx.body = {
        code: 1,
        msg: '审核成功',
        reviews
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '审核失败'
      }
      return 
    }
  } else {
    let {id} = ctx.request.body
    id = mongoose.Types.ObjectId(id)
    let doc = await Review.deleteOne({_id: id})
    let reviews = await Review.find({})
    if(doc) {
      ctx.body = {
        code: 1,
        msg: '删除成功',
        reviews
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '删除失败'
      }
      return 
    }
  }
  await next()
})

// 搜索结果
router.post('/search', async function(ctx, next) {
  let re = ctx.request.body
  console.log(re)
  let busis = []
  if(re.tag) {
    let tag = re.tag
    console.log(tag)
    busis = await Busi.find({"tags":{$regex: tag}}, {"storeName": 1, telNumber: 1, state: 1, time: 1, tags: 1, pic: 1})
    if(busis.length === 0) {
      ctx.body = {
        code: 0,
        msg: '没有找到相关店铺'
      }
      return
    } else {
      ctx.body = {
        code: 1,
        msg: '查找成功',
        busis
      }
    }
  }
  if(re.busi === '') {
    busis = await Busi.find({}, {"storeName": 1, telNumber: 1, state: 1, time: 1, tags: 1, pic: 1})
    if(busis.length === 0) {
      ctx.body = {
        code: 0,
        msg: '没有找到相关店铺'
      }
      return
    } else {
      ctx.body = {
        code: 1,
        msg: '查找成功',
        busis
      }
    }
  }
  if(re.busi) {
    let busi = re.busi
    console.log(busi)
    busis = await Busi.find({"storeName": {$regex: busi}}, {"storeName": 1, telNumber: 1, state: 1, time: 1, tags: 1, pic: 1})
    if(busis.length === 0) {
      ctx.body = {
        code: 0,
        msg: '没有找到相关店铺'
      }
      return
    } else {
      ctx.body = {
        code: 1,
        msg: '查找成功',
        busis
      }
    }
  }
  await next()
})

// 相关信息获取
router.post('/get/busi', checkBtoken, async (ctx, next) => {
    let {btel} = ctx.request.body
    let mcount = await Menu.find({btel: btel}).countDocuments()
    let menus = await Menu.find({btel: btel})
    let saleCount = 0
    for(let i = 0; i < menus.length; i++) {
      saleCount += menus[i].saleCount
    }
    // let o = await Order.find({btel: btel, state: 1})
    let ocount = await Order.find({btel: btel, state: 2}).countDocuments()
    // let assess = await Assess.find({btel: btel}, {uname: 1, time: 1, content: 1, reply: 1})
    let busi = await Busi.findOne({telNumber: btel}, {pic: 1, storeName: 1, tags: 1, time: 1, state: 1, account: 1, license: 1})
    await Busi.updateOne({telNumber: btel}, {$set: {saleCount: saleCount}})
    if(busi) {
      let li = await Review.findOne({btel: btel})
      let license = true
      if(!li) {
        license = false
      }
      ctx.body = {
        code: 1, 
        msg: '获取成功',
        busi,
        mcount,
        ocount,
        license
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '获取失败'
      }
      return
    }
    await next()
})

router.post('/get/user', checkToken,async (ctx, next) => {
  // console.log()
    let tel = ctx.request.body.tel
    let ocount = await Order.find({tel: tel, state: 1}).countDocuments()
    let acount = await Assess.find({utel: tel}).countDocuments()
    let user = await User.findOne({telNumber: tel}, {address: 1, account: 1})
    if(user) {
      ctx.body = {
        code: 1, 
        msg: '获取成功',
        address: user.address,
        account: user.account,
        ocount,
        acount
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '获取失败'
      }
      return
    }
  await next()
})
router.post('/get/busiAll', async (ctx, next) => {
  let {btel} = ctx.request.body
  // let mcount = await Menu.find({btel: btel}).countDocuments()
  let menus = await Menu.find({btel: btel})
  let saleCount = 0
  for(let i = 0; i < menus.length; i++) {
    saleCount += menus[i].saleCount
  }
  let o = await Order.find({btel: btel, state: 1})
  // let ocount = await Order.find({btel: btel, state: 2}).countDocuments()
  let assess = await Assess.find({btel: btel}, {uname: 1, time: 1, content: 1, reply: 1})
  let busi = await Busi.findOne({telNumber: btel}, {pic: 1, storeName: 1, tags: 1, time: 1, state: 1, account: 1, license: 1})
  await Busi.updateOne({telNumber: btel}, {$set: {saleCount: saleCount}})
  if(busi) {
    ctx.body = {
      code: 1, 
      msg: '获取成功',
      busi,
      menus,
      assess
    } 
  } else {
    ctx.body = {
      code: 0,
      msg: '获取失败'
    }
    return
  }
  await next()
})
// 验证码发送
router.post('/sendsms', async function(ctx, next) {
  console.log('11111')
  const tel = ctx.request.body.tel
  const saveExpire = await Recli.hget(`tel: ${tel}`, 'expire')
  console.log(ctx.request.body)
  console.log('当前时间：', new Date().getTime())
  console.log('过期时间：', saveExpire)

  // 检查验证码是否过期， 防止用户频繁发送验证码
  if(saveExpire && new Date().getTime() - saveExpire < 0 ) {
    ctx.body = {
      code: 0,
      msg: '发送过于频繁，请稍后重试'
    }
    console.log(ctx.body)
    return
  }
  const data = {
    accessKeyId: config.sendsms.accessKeyId,
    secretAccessKey: config.sendsms.secretAccessKey,
    sendcode: config.sendsms.codeRandom,
    SignName: config.sendsms.SignName,
    TemplateCode: config.sendsms.TemplateCode,
    expire: config.sendsms.expire
  }
  let smsClient = new SMSClient({
    accessKeyId: data.accessKeyId,
    secretAccessKey: data.secretAccessKey
  })

  const s = await smsClient.sendSMS({
    "PhoneNumbers": tel,
    "SignName": data.SignName,
    "TemplateCode": data.TemplateCode,
    "TemplateParam": `{code: ${data.sendcode}}`
  })
  console.log(s)
  if(s.Code === 'OK' && s.Message === 'OK') {
    Recli.hmset(`tel:${tel}`, 'code', data.sendcode, 'expire', data.expire)
    ctx.body = {
      "code": 1, 
      "msg": "验证码已发送，请注意查收"
    }
    console.log(ctx.response)
  } else {
    ctx.body = {
      "code": 0, 
      "msg": "验证码发送失败, 重新点击发送"
    }
    console.log(ctx.body)
  } 
  // ctx.body = {
  //   code: 1,
  //   msg: 2
  // }
  await next()
})

// 地址管理
router.post('/address', checkToken, async (ctx, next) => {
  // console.log(ctx.request.body)
  let tel = ctx.request.body.tel
  if(ctx.request.body.del) {
    // 用户删除地址
    let index = ctx.request.body.index
    let d = await User.update({"telNumber": tel}, {$pull: {"address": {"index": index}}})
    console.log(d)
    if(d.nModified === 1) {
      let user = await User.findOne({"telNumber": tel})
      ctx.body = {
        code: 1,
        msg: '删除成功',
        address: user.address
      }
    } else {
      ctx.body = {
        code: 0,
        msg: "删除失败"
      }
      return
    }
  } else if(ctx.request.body.get) {
    // console.log('get')
    // 用户获取地址
    let tel = ctx.request.body.tel
    let doc = await User.findOne({"telNumber": tel})
    if(doc) {
      ctx.body = {
        code: 1,
        msg: "获取成功",
        address: doc.address
      }
    } else {
      ctx.body = {
        code: 0,
        msg: "获取失败"
      }
      return
    }
  }
  else {
    // 用户修改地址
    let {name, sex, addr, atel, index} = ctx.request.body
    let doc = await User.findOne({"telNumber": tel, "address.index": index})
    console.log(doc)
    if(doc !== null) {
      console.log('修改')
      let a = await User.update({"telNumber": tel, "address.index": index}, {$set: {"address.$": {name, sex, addr, atel, index}}})
      if(a.nModified !== 0) {
        let user = await User.findOne({"telNumber": tel})
        ctx.body = {
          code: 1,
          msg: "修改成功",
          address: user.address
        }
      } else {
        ctx.body = {
          code: 0,
          msg: "修改失败"
        }
        return
      }
    } else {
      // console.log('添加')
      // 用户添加地址
      let a = await User.update({"telNumber": tel}, {$addToSet: {address: {name, sex, addr, atel, index}}})
      if(a.nModified !== 0) {
        let user = await User.findOne({"telNumber": tel})
        ctx.body = {
          code: 1,
          msg: "添加成功",
          address: user.address
        }
      } else {
        ctx.body = {
          code: 0,
          msg: "添加失败"
        }
        return
      }
    }
  }
  await next()
})
// 获取首页的推荐店铺
router.post('/getstore', async (ctx, next) => {
  if(ctx.request.body.favo === false) {
    let stores = await Busi.find({}, {storeName: 1, telNumber: 1, saleCount: 1}).sort({saleCount: -1}).limit(3)
    stores.forEach(async function(ele) {
      let menus = await Menu.find({btel: ele.telNumber}, {saleCount: 1})
      let saleCount = 0
      for(let i = 0; i < menus.length; i++) {
        saleCount += menus[i].saleCount
      }
      ele.saleCount = saleCount
      await Busi.updateOne({telNumber: ele.telNumber}, {$set: {saleCount: saleCount}})
    })
    console.log(stores)
    if(stores.length !== 0) {
      ctx.body = {
        code: 1,
        msg: '获取成功',
        stores
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '获取失败'
      }
      return
    }
  } else {
    let ten = await Busi.aggregate([{$sample: {size: 5}}])
    let stores = []
    for(let i = 0; i < ten.length; i++) {
      let store = {
        storeName: ten[i].storeName,
        telNumber: ten[i].telNumber,
        tags: ten[i].tags,
        time: ten[i].time,
        pic: ten[i].pic
      }
      stores.push(store)
    }
    console.log(stores)
    if(stores.length !== 0) {
      ctx.body = {
        code: 1,
        msg: '获取成功',
        stores
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '获取失败'
      }
      return
    }
  }
  await next()
})

// 商家上传审核文件
router.post('/upfiles', upload.single('file'),async (ctx, next) => {
  console.log(ctx.req.file)
  let btel = ctx.req.body.btel
  let file = ctx.req.file
  let filename = file.filename
  let uploadPath = '/images/' + filename
  
  client.put(uploadPath, file.path).then(res => {
    fs.unlink(file.path, async function(err) {
      if (err) {
        return console.log(err)
      } else {
        return console.log('文件删除成功'); 
      }
    })
  })
  
  let path = "http://test-dingd.oss-cn-beijing.aliyuncs.com/images/"
  let pic = path + filename
  let doc = await Review.create({btel: btel, license: pic})
  if(doc) {
    ctx.body = {
      code: 1,
      msg: '等待审核'
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '上传失败'
    }
    return
  }

  await next()
})


module.exports = router