// 1、创建一个 vue 实例
const fs = require("fs");
const koa = require('koa')
const koarouter = require('koa-router')
const koaCors = require('koa2-cors')
const path = require('path')
const koaStatic = require('koa-static')
const koabody = require('koa-body')
const bodyparser = require('koa-bodyparser')
const app = new koa()

app.use(koaCors())

// mongoose引入
const mongoose = require('mongoose')
const dbcfg = require('./dbs/config')

// Redis 引入
const session = require('koa-generic-session')
const redis = require('koa-redis')
// app.keys = ['key1', 'key2']
// app.use(session({
//   key: 'vueEle',
//   prefix: 'vueEle:uid',
//   store: new redis()
// }))


// bodyparser 中间件
app.use(bodyparser())

// 设置跨域处理
// app.use(async(ctx, next) => {
//   // 允许来自所有域名的访问
//   ctx.set('Access-Control-Allow-Origin', '*')
//   // 设置允许的 HTTP 请求方法
//   ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE')
//   // 服务器支持的所有头信息字段
//   ctx.set('Access-Control-Allow-Headers', 'x-requested-with, accept, origin, content-type')
//   // 设置请求中的媒体类型信息
//   ctx.set('Content-Type', 'application/json;charset=utf-8')
//   // 允许发送 cookie
//   ctx.set('Access-Control-Allow-Credentials', true)
//   // 设置请求的有效期
//   ctx.set('Access-Control-Max-Age', 300)
//   // 需要获取其他字段
//   ctx.set("Access-Control-Expose-Headers", "myData")

//   await next()
// })

// router 引入
const user = require('./routes/user')
const index = require('./routes/index')
const busi = require('./routes/busi')
const menu = require('./routes/menu')
const order = require('./routes/order')
const assess = require('./routes/assess')
// routers 添加

// 数据库连接
mongoose.connect(dbcfg.dbs, {
  useCreateIndex: true,
  useNewUrlParser: true
})

app.use(async function(ctx, next) {
  ctx.body = "hello koa2!"
  // ctx.end
  await next()
  
}) 

app.use(user.routes(), user.allowedMethods())
app.use(index.routes(), index.allowedMethods())
app.use(busi.routes(), busi.allowedMethods())
app.use(menu.routes(), menu.allowedMethods())
app.use(order.routes(), order.allowedMethods())
app.use(assess.routes(), assess.allowedMethods())

app.listen(3000)