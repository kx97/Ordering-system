const router = require('koa-router')()
const mongoose = require('mongoose')
const Assess = require('../dbs/models/assess').Assess
const User = require('../dbs/models/user').Users
const Order = require('../dbs/models/order').Orders
const Busi = require('../dbs/models/business').Busis

router.prefix('/assess')

const checkToken = require('../token/checkToken')
const checkBtoken = require('../token/checkBtoken')

// 用户进行留言
router.post('/insert', checkToken, async (ctx, next) => {
  let {orderId, utel, btel, bname, content} = ctx.request.body
  let user = await User.findOne({telNumber: utel}, {userName: 1})
  let uname = user.userName
  let time = Date.now() + 8 * 3600 * 1000
 
  let doc = await Assess.create({
    orderId,
    utel,
    uname,
    btel,
    bname,
    time,
    content
  })
  console.log(doc)
  if(doc) {
    orderId = mongoose.Types.ObjectId(orderId)
    await Order.updateOne({_id: orderId}, {$set: {isAssess: true}})
    ctx.body = {
      code: 1,
      msg: '评论成功'
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '评价失败'
    }
    return
  }
  await next()
})
// 用户获取留言
router.post('/get/user', checkToken, async (ctx, next) => {
  let assess = []
  let utel = ctx.request.body.utel
  assess = await Assess.find({utel: utel}, {bname: 1, content: 1, time: 1, reply: 1}).sort({time: -1})
  if(assess.length !== 0) {
    ctx.body = {
      code: 1,
      msg: '查找成功',
      assess
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '查找失败'
    }
    return 
  }
  await next()
})
// 商家获取留言
router.post('/get/busi', checkBtoken, async (ctx, next) => {
  let assess = []
  let btel = ctx.request.body.btel
  assess = await Assess.find({btel: btel}, {uname: 1, content: 1, time: 1, reply: 1}).sort({time: -1})
  if(assess.length !== 0) {
    ctx.body = {
      code: 1,
      msg: '查找成功',
      assess
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '查找失败'
    }
    return 
  }
  await next()
})
// 商家回复留言
router.post('/addreply', checkBtoken, async (ctx, next) => {
  let {id, reply, btel} = ctx.request.body
  id = mongoose.Types.ObjectId(id)
  console.log(id, typeof id)
  let ass = await Assess.findOne({"_id": id})
  console.log(ass)
  let doc = await Assess.updateOne({_id: id}, {$set: {reply: reply}})
  console.log(doc)
  if(doc.nModified !== 0) {
    let assess = await Assess.find({btel: btel}, {uname: 1, content: 1, time: 1, reply: 1})
    ctx.body = {
      code: 1,
      msg: "修改成功",
      assess
    }
  } else {
    ctx.body = {
      code: 0,
      msg: "修改失败"
    }
    return
  }
  await next()
})
// 用户清理留言
router.post('/clearAll', checkToken, async (ctx, next) => {
  let utel = ctx.request.body.utel
  let doc = await Assess.updateMany({utel: utel}, {$unset: {utel: ''}})
  console.log(doc)
  if(doc) {
    ctx.body = {
      code: 1,
      msg: '删除成功'
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '删除失败'
    }
    return
  }

  await next()
})
module.exports = router