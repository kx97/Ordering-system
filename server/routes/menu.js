const router = require('koa-router')()
const multer = require('koa-multer')
const mongoose = require('mongoose')
const fs = require('fs')
const Menu = require('../dbs/models/menu').Menus
const OSS = require('ali-oss')
const config = require('../dbs/config') 

router.prefix('/menu')

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

// 商家上传图片
router.post('/upload', upload.single("file"), async (ctx, next) => {
  // console.log(ctx.req.file)
  let file = ctx.req.file
  let filename = file.filename
  let uploadPath = '/images/' + filename
  let {name, price, btel} = ctx.req.body
  let saleCount = 0 
  const resu = await Menu.findOne({"name": name, "btel": btel})
  // console.log(resu)
  if(resu) {
    ctx.body = {
      code: 0,
      msg: '菜名已存在，请更换'
    }
    return
  } else {
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
    let doc = await Menu.create({
      btel,
      pic,
      name,
      price,
      saleCount
    })
    if(doc) {
      // let menus =await Menu.find({"btel": btel}, {"pic": 1, "name": 1, "price": 1, "saleCount": 1})
      ctx.body = {
        code: 1,
        msg: '添加成功'
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '添加失败'
      }
      return
    } 
  }
  await next()
})
// 商家获取菜单
router.post('/get', checkBtoken, async (ctx, next) => {
  let btel = ctx.request.body.btel
  // console.log(btel)
  let menus = await Menu.find({"btel": btel}, {"pic": 1, "name": 1, "price": 1, "saleCount": 1})
  if(menus.length === 0) {
    ctx.body = {
      code: 0,
      msg: '没有菜品信息'
    }
    return
  } else {
    ctx.body = {
      code: 1,
      msg: '查询成功',
      menus
    }
  }


  await next()
})
// 商家删除菜品
router.post('/del', checkBtoken, async (ctx, next) => {
  let {name, btel} = ctx.request.body
  let doc = await Menu.deleteOne({"btel": btel, "name": name})
  if(doc) {
    // let menus = await Menu.find({'btel': btel})
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
// 商家修改菜品
router.post('/update', upload.single("file"), async (ctx, next) => {
  let {name, price, btel, id} = ctx.req.body
  id = mongoose.Types.ObjectId(id)
  let menu = await Menu.findOne({_id: id}, {name: 1})
  let a = await Menu.updateOne({_id: id}, {$set: {name: ''}})
  console.log(a)
  const resu = await Menu.findOne({"name": name, "btel": btel})
  // console.log(resu)
  if(resu) {
    await Menu.updateOne({_id: id}, {$set: {name: menu.name}})
    // let menus =await Menu.find({"btel": btel}, {"pic": 1, "name": 1, "price": 1, "saleCount": 1})
    ctx.body = {
      code: 0,
      msg: '菜名已存在，请更换'
    }
    return
  } else {
    let doc
    console.log(ctx.req.file)
    if(ctx.req.file) {
      var file = ctx.req.file
      var filename = file.filename
      var uploadPath = '/images/' + filename
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
      
      doc = await Menu.update({_id: id}, {
        pic,
        name,
        price
      })
    } else {
      doc = await Menu.updateMany({_id: id}, {
        name,
        price
      })
    }
    if(doc.nModified !== 0) {
      // let menus =await Menu.find({"btel": btel}, {"pic": 1, "name": 1, "price": 1, "saleCount": 1})
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
module.exports = router