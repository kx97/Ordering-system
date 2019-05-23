import vue from 'vue'
import vueRouter from 'vue-router'
import routes from './index'
import store from '../store/store';

vue.use(vueRouter)
let base = `${process.env.BASE_URL}`

const router = new vueRouter({
  mode: 'history',
  base,
  routes
})

// 路由拦截
// 页面刷新时重新赋值 token
if(sessionStorage.getItem('token')) {
  store.commit('BIND_LOGIN', sessionStorage.getItem('token'))
}
if(sessionStorage.getItem('btoken')) {
  store.commit("BIND_BLOGIN", sessionStorage.getItem("btoken"))
}
// 全局导航钩子
router.beforeEach((to, from, next) => {
  // 路由改变修改页面 title
  if(to.meta.title) {
    document.title = to.meta.title
  }
  if(to.meta.userLogin) {
    if(sessionStorage.getItem('token') !== null) {
      if(Object.keys(from.query).length === 0) {
        // 处理路由来源是否有query，处理不是目的跳转的情况
        next()
      } else {
        let redirect = from.query.redirect
        if(to.path === redirect) {
          // 避免 next 无限循环
          next()
        } else {
          next({path: redirect})
        }
      } 
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  } else if(to.meta.busiLogin) {
    if(sessionStorage.getItem("btoken") !== null) {
      if(Object.keys(from.query).length === 0) {
        next()
      } else {
        let redirect = from.query.redirect
        if(to.path === redirect) {
          next()
        } else {
          next({path: redirect})
        }
      }
    } else {
      next({
        path: '/blogin',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
})


export default router