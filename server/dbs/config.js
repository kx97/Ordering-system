module.exports = {
  dbs: 'mongodb://localhost:27017/dbs',
  redis: {
    get host() {
      return '127.0.0.1'
    },
    get port() {
      return 6379
    }
  },
  sendsms: {
    get accessKeyId() {
      return ''
    },
    get secretAccessKey() {
      return ''
    },
    get SignName() {
      return ''
    },
    get TemplateCode() {
      return ''
    },
    // 生成随机验证码
    get codeRandom() {
      let str = ''
      for(let i = 0; i < 6; i++) {
        let code = Math.floor(Math.random() * 10)
        str += code
      }
      return str
    },
    // 定义 验证码过期时间
    get expire() {
        return new Date().getTime() + 50 * 60 * 1000
    }
  }
}