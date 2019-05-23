import vue from 'vue'
import vuex from 'vuex'
import user from './modules/user'
import business from './modules/business'
import shopcar from './modules/shopcar'
import admin from './modules/admin'

import getters from './getters'

vue.use(vuex)

const store = new vuex.Store({
  modules: {
    user,
    business,
    shopcar,
    admin
  },
  getters
})

export default store