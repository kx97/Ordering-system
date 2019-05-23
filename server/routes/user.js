const router = require('koa-router')()
const redis = require('koa-redis')
const User = require('../dbs/models/user').Users

// 创建 和 验证 token 
const createToken = require('../token/createToken')
const checkToken = require('../token/checkToken')

// 创建接口的统一前缀
router.prefix('/user')

// 获取 Redis 的客户端
const Recli = new redis().client

// 注册
router.post('/register', async function(ctx, next) {
  const {name, tel, code, pwd} = ctx.request.body
  if(code) {
    // 检验 验证码是否正确
    // 拿到 存储的验证码
    const saveCode = await Recli.hget(`tel:${tel}`, 'code')
    // 拿到验证码的过期时间
    const saveExpire = await Recli.hget(`tel:${tel}`, 'expire')

    console.log(ctx.request.body)
    console.log('验证码：', saveCode)
    console.log('过期时间：', saveExpire)

    // 检验输入的验证码是否和存储的相同
    if(code === saveCode) {
      if(new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          "code": 1,
          "msg": "验证码已过期，请重新获取"
        }
        return
      }
    } else {
      ctx.body = {
        "code": 0,
        "msg": "请输入正确的验证码"
      }
      return
    }
  } else {
    ctx.body = {
      "code": 0,
      "msg": "请填写验证码"
    }
    return
  }
  // 检验 手机号是否已经注册
  const newTel = await User.find({telNumber: tel})
  if(newTel.length) {
    ctx.body = {
      "code": 0,
      "msg": "此手机号早已被注册"
    }
    return 
  } else {
    const newUser = await User.create({
      userName: name,
      telNumber: tel,
      password: pwd,
      token: createToken(this.telNumber)
    })

    if(newUser) {
      ctx.body = {
        "code": 1,
        "msg": "注册成功，请前往登录"
      }
    } else {
      ctx.body = {
        "code": 0,
        "msg": "注册失败"
      }
      return
    }
  }
  await next()
})

// 登录
router.post('/login', async function(ctx, next) {
  console.log(ctx.request.body)
  const {tel, pwd} = ctx.request.body
  let doc = await User.findOne({telNumber: tel})
  if(!doc) {
    ctx.body = {
      "code": 0,
      "msg": "此手机号未完成注册"
    }
    return
  }
  if(ctx.request.body.code) {
    let code = ctx.request.body.code
    let saveCode = await Recli.hget(`tel:${tel}`, 'code')
    let saveExpire = await Recli.hget(`tel:${tel}`, 'expire')
    console.log('savecode', saveCode)
    if(code === saveCode) {
      if(new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          "code": 0,
          "msg": '验证码过期，请重新获取'
        }
        return
      } else {
        await User.update({"telNumber": tel}, {$set: {"password": pwd}})
        // let name = await User.findOne({telNumber: tel})
        let token = createToken(tel)
        doc.token = token
        try {
          await doc.save()
          ctx.body = {
            "code": 1,
            "msg": "密码已修改，登录成功",
            name: doc.userName,
            tel: doc.telNumber,
            address: doc.address,
            token
          }
        } catch (err) {
          ctx.body = {
            "code": 0,
            "msg": "密码修改失败，请重新修改"
          }
          return
        }
      }
    } else {
      ctx.body = {
        "code": 0,
        "msg": "验证码错误，请重新输入"
      }
      return
    } 
  } else {
     if(doc.password !== pwd) {
      ctx.body = {
        "code": 0,
        "msg": "用户名或密码错误"
      }
      return
    } else if(doc.password === pwd) {
      console.log('密码正确')
      // let name = await User.findOne({telNumber: tel})
      console.log(doc.address)
      let token = createToken(tel)
      doc.token = token
      try {
        await doc.save()
        ctx.body = {
          "code": 1,
          "msg": "登录成功",
          name: doc.userName,
          tel: doc.telNumber,
          address: doc.address,
          token
        }
      } catch (error) {
        ctx.body = {
          "code": 0,
          "msg": "登录失败，请重新登录"
        }
      }
    }
  }
  await next()
})

// 充值
router.post('/addMon', checkToken,async (ctx, next) => {
  let {tel, money} = ctx.request.body
  let doc = await User.updateOne({telNumber: tel}, {$inc: {account: money}})
  if(doc) {
    let user = await User.findOne({telNumber: tel}, {account: 1})
    ctx.body = {
      code: 1,
      msg: '充值成功',
      account: user.account
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '充值失败'
    }
    return
  }
})

module.exports = router
