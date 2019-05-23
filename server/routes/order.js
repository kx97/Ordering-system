const router = require('koa-router')()
let mongoose = require('mongoose')
const Order = require('../dbs/models/order').Orders
const User = require('../dbs/models/user').Users
const Menu = require('../dbs/models/menu').Menus
const Busi = require('../dbs/models/business').Busis

router.prefix('/order')
const checkToken = require('../token/checkToken')
const checkBtoken = require('../token/checkBtoken')

// 商家确认送达
router.post('/arri', checkBtoken, async (ctx, next) => {
  let {id} = ctx.request.body
  id = mongoose.Types.ObjectId(id)
  let arriTime = Date.now() + 8 * 1000 * 60 * 60
  let doc = await Order.updateOne({_id: id}, {$set: {arriTime: arriTime}})
  if(doc) {
    ctx.body = {
      code: 1,
      msg: '确认修改'
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
// 商家接受订单
router.post('/accept', checkBtoken, async (ctx, next) => {
  let {id, price, btel, tel} = ctx.request.body
  id = mongoose.Types.ObjectId(id)
  let busi = await Busi.findOne({telNumber: btel}, {time: 1})
  let orderTime = Date.now() + 8 * 1000 * 60 * 60
  let doc = await Order.updateOne({_id: id}, {$set: {orderTime, state: 1}})
  if(doc) {
    let order = await Order.findOne({_id: id})
    for(let j = 0; j < order.menu.length; j++) {
      await Menu.updateOne({btel: btel, name: order.menu[j].name}, {$inc: {saleCount: order.menu[j].num}})
    }
    ctx.body = {
      code: 1,
      msg: '接单成功'
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '接单失败'
    }
    return
  }

  await next()
})
// 商家拒绝订单
router.post('/refuse', checkBtoken, async (ctx, next) => {
  let {id} = ctx.request.body
  id = mongoose.Types.ObjectId(id)
  let doc = await Order.updateOne({_id: id}, {$set: {state: 3}})
  if(doc) {
    ctx.body = {
      code: 1,
      msg: '订单已拒绝'
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '订单拒绝失败'
    }
    return
  }
  await next()
})
// 用户插入订单
router.post('/insert', checkToken, async (ctx, next) => {
  let {tel, addr, bname, btel, time, menu, price, state} = ctx.request.body
  // console.log(ctx.request.body)
  let bstate = await Busi.findOne({telNumber: btel}, {state: 1})
  if(bstate.state === '打烊') {
    ctx.body = {
      code: 0,
      msg: '商家已打烊'
    }
    return
  } else {
    if(addr === undefined) {
      ctx.body = {
        code: 0,
        msg: '地址没有添加'
      }
      return
    } else {
      let doc = await User.findOne({telNumber: tel}, {account: 1})
      // console.log(doc.account)
      if(doc.account >= price) {
        let orderTime = Date.now() + 8 * 1000 * 60 * 60
        let order = await Order.create({
          tel, 
          addr,
          bname,
          btel,
          menu,
          price,
          orderTime,
          state,
          isAssess: false
        })
        // console.log(order)
        if(order) {
          await User.updateOne({telNumber: tel}, {$push: {orderIds: {id: order._id}}})
          await Busi.updateOne({telNumber: btel}, {$push: {orderIds: {id: order._id}}})
          ctx.body = {
            code: 1,
            msg: '等待商家接单'
          }
        } else {
          ctx.body = {
            code: 0,
            msg: '下单失败，请重新下单'
          }
          return
        }
      } else {
        ctx.body = {
          code: 0,
          msg: '账户余额不足'
        }
        return
      }
    }
  }
  await next()
})
// 用户购物车插入订单
router.post('/many', checkToken, async (ctx, next) => {
  let {tel, addr, orders, total} = ctx.request.body
  let btels = []
  orders.forEach(function(ele) {
    btels.push(ele.btel)
  })
  console.log(btels)
  let bnames = []
  let indexs = []
  for(let n = 0; n < btels.length; n++) {
    let bstate = await Busi.findOne({telNumber: btels[n]}, {state: 1})
    if(bstate.state === '打烊') {
      bnames.push(orders[n].bname)
      indexs.push(n)
    }
  }
  if(bnames.length > 0) {
    let str = ''
    bnames.forEach(function(ele) {
      str += ele + ' '
    })
    ctx.body = {
      code: 0,
      msg: str + '已打烊，请重新下单',
      indexs
    }
    return
  } else {
    let doc = await User.findOne({telNumber: tel}, {account: 1})
    console.log(orders)
    let ords = []
    if(doc.account >= total) {
      for(let i = 0; i < orders.length; i++) {
        let orderTime = Date.now() + 8 * 1000 * 60 * 60
        let o = {
          tel,
          addr,
          bname: orders[i].bname,
          btel: orders[i].btel,
          menu: orders[i].menu,
          price: orders[i].total,
          orderTime,
          state: 2,
          isAssess: false
        }
        ords.push(o)
      }
      let order = await Order.insertMany(ords)
      console.log(order)
      if(order.length === orders.length) {
        console.log(order._id)
        order.forEach(async function(ele) {
          await User.updateOne({telNumber: tel}, {$push: {orderIds: {id: ele._id}}})
          await Busi.updateOne({telNumber: ele.btel}, {$push: {orderIds: {id: ele._id}}})
        })
        ctx.body = {
          code: 1,
          msg: '等待商家接单'
        }
      } else {
        ctx.body = {
          code: 0,
          msg: '下单失败，请重新下单'
        }
        return
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '账户余额不足'
      }
    }

  }
  await next()
})
// 用户获取订单
router.post('/get/user', checkToken, async function(ctx, next) {
    let {utel, state} = ctx.request.body
    let user = await User.findOne({telNumber: utel}, {orderIds: 1})
    let orders = []
    let arris = []
    let orderIds = user.orderIds
    for(let i = orderIds.length - 1; i >= 0; i--) {
      let order = await Order.findOne({'_id': orderIds[i].id, "state": state})
      if(order) {
        if(order.state === 1) {
          let busi = await Busi.findOne({telNumber: order.btel}, {time: 1})
          let arri = Date.parse(order.orderTime) + busi.time * 1000 * 60
          arris.push(new Date(arri))
          // console.log(new Date(arri))
        }
        orders.push(order)
      }
    }
    if(orders.length !== 0) {
      for(let i = 0; i < orders.length; i++) {
        let lastTime = Date.parse(orders[i].orderTime) + 2 * 1000 * 3600
        if(lastTime < Date.now() && orders[i].state === 1 && orders[i].arriTime) {
          let id = orders[i]._id
          await Order.updateOne({_id: id}, {$set: {state: 0}})
        }
      }
      ctx.body = {
        code: 1,
        msg: '获取成功',
        orders,
        arris
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
// 商家获取订单
router.post('/get/busi', checkBtoken, async (ctx, next) => {
    let {btel, state} = ctx.request.body
    let busi = await Busi.findOne({telNumber: btel}, {orderIds: 1, time: 1})
    console.log(busi)
    let orders = []
    let arris = []
    let orderIds = busi.orderIds
    for(let i = orderIds.length - 1; i >=0 ; i--) {
      let order = await Order.findOne({'_id': orderIds[i].id, "state": state})
      if(order) {
        let arri = Date.parse(order.orderTime) + busi.time * 1000 * 60
        arris.push(new Date(arri))
        console.log(arris)
        orders.push(order)
      }
    }
    // console.log(orders)
    if(orders.length !== 0) {
      ctx.body = {
        code: 1,
        msg: '获取成功',
        orders,
        arris
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
// 用户确认订单
router.post('/confirm', checkToken, async (ctx, next) => {
  let {id, tel} = ctx.request.body
  id = mongoose.Types.ObjectId(id)
  let or = await Order.findOne({_id: id})
  if(!or.arriTime) {
    ctx.body = {
      code: -1,
      msg: '商家还没有确认送达，不能收货'
    }
    return
  } else {
    let doc = await Order.updateOne({_id: id}, {$set: {state: 0}})
    console.log(doc)
    if(doc.nModified !== 0) {
      let or = await Order.findOne({_id: id}, {btel: 1, price: 1, tel: 1})
      await User.updateOne({telNumber: or.tel}, {$inc: {account: -or.price}})
      await Busi.updateOne({telNumber: or.btel}, {$inc: {account: or.price}})
      ctx.body = {
        code: 1,
        msg: '修改成功'
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
// 用户删除订单
router.post('/del/user', checkToken, async (ctx, next) => {
  let id = ctx.request.body.id
  id = mongoose.Types.ObjectId(id)
  // console.log(typeof id)
    let tel = ctx.request.body.tel
    let doc = await User.updateOne({"telNumber": tel}, {$pull: {"orderIds": {"id": id}}})
    console.log(doc)
    if(doc.nModified !== 0) {
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
// 商家删除订单
router.post('/del/busi', checkBtoken, async (ctx, next) => {
    let btel = ctx.request.body.btel
    let doc = await Busi.updateOne({"telNumber": btel}, {$pull: {"orderIds": {"id": id}}})
    // console.log(doc)
    if(doc.nModified !== 0) {
      let busi = await Busi.findOne({telNumber: btel}, {orderIds: 1})
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
