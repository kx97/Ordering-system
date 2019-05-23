import homePage from '@/App.vue'

import register from './pages/user/register.vue'
import login from './pages/user/login.vue'
import mypage from './pages/user/mypage.vue'
import myorder from './pages/user/myorder.vue'
import mycar from './pages/user/mycar.vue'
import myassess from './pages/user/myassess.vue'

// 店铺注册
import business from './pages/business/business.vue'
import blogin from './pages/business/blogin.vue'
import busienter from './pages/business/busienter.vue'
import menu from './pages/business/menu.vue'
import order from './pages/business/order.vue'
import assess from './pages/business/assess.vue'

// 店铺界面
import info from './pages/info.vue'
// 搜索结果
import search from './pages/search.vue'

import admin from './pages/admin.vue'

const routes = [
  {
    path: '/',
    component: homePage,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/info',
    component: info,
    meta: {
      title: '店铺'
    }
  },
  {
    path: '/search',
    component: search,
    meta: {
      title: '搜索结果'
    }
  },
  // 用户模块
  {
    path: '/login',
    component: login,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/register',
    component: register,
    meta: {
      title: '注册'
    }
  },
  {
    path: '/mypage',
    component: mypage,
    meta:{
      title: '个人中心',
      userLogin: true
    }
  },
  {
    path:'/myorder',
    component: myorder,
    meta: {
      title: '我的订单',
      userLogin: true
    }
  },
  {
    path:'/mycar',
    component: mycar,
    meta: {
      title: '购物车',
      userLogin: true
    }
  },
  {
    path:'/myassess',
    component: myassess,
    meta: {
      title: '我的评价',
      userLogin: true
    }
  },
  // 商家相关
  {
    path: '/blogin',
    component: blogin,
    meta: {
      title: '商家登录'
    }
  },
  {
    path: '/busienter',
    component: busienter,
    meta: {
      title: "商家入驻"
    }
  },
  {
    path: '/business',
    component: business,
    meta:{
      title: '商家中心',
      busiLogin: true
    }
  },
  {
    path: '/order',
    component: order,
    meta: {
      title: '订单管理',
      busiLogin: true
    }
  },
  {
    path: '/menu',
    component: menu,
    meta: {
      title: '菜单管理',
      busiLogin: true
    }
  },
  {
    path: '/assess',
    component: assess,
    meta: {
      title: '留言板',
      busiLogin: true
    }
  },
  {
    path: '/admin',
    component: admin,
    meta: {
      title: '管理员中心'
    }
  }
]

export default routes