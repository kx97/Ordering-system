const jwt = require('jsonwebtoken')

module.exports = async (ctx, next) => {
  // 检查是否存在 token
  // axios.js 中设置的 authorization
  const authorizationn = ctx.get('Authorization')
  if(authorizationn ==='' || authorizationn.split(' ')[0] !== 'btoken') {
    ctx.throw(401, 'no token detected in http headerAuthorization')
    return
  }
  const token = authorizationn.split(' ')[1]
  // console.log(token)
  // 检查 token 是否过期
  let decoded = jwt.decode(token, 'cedric1990')
  console.log(decoded)
  
  return next();
}