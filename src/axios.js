import axios from 'axios'
// import router from '@/router/router'
import store from '@/store/store'

// 服务器端拦截
axios.defaults.timeout = 5000,
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.baseURL='http://127.0.0.1:3000'

axios.interceptors.request.use(
  config => {
    if(store.getters.token) {
      // 存在 token 就在每个 HTTP 的 header 上添加 token
      config.headers.Authorization = `token ${store.getters.token}` 
      window.console.log('拿到 token ')
    } 
    if(store.getters.btoken) {
      config.headers.Authorization = `btoken ${store.getters.btoken}` 
      window.console.log('拿到 btoken ')
    }
    window.console.log('request 请求配置', config)
    return config
  }, 
  err => {
    return Promise.reject(err)
  }
)

// HTTP response 拦截器
axios.interceptors.response.use(
  response => {
    window.console.log('响应成功', response)
    return response
  },
  err => {
    if(err.response) {
      switch (err.response.status) {
        case 401: 
        alert('没有登录') 
        break
        default: 
        window.console.log('服务器出错，请稍后重试！')
        alert('服务器出错，请稍后重试')
      }
    }
    return Promise.reject(err.response)
  }
)

export default axios
