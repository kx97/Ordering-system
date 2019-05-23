const user = {
  state: {
    token: sessionStorage.getItem('token'),
    tel: sessionStorage.getItem('tel'),
    name: sessionStorage.getItem('name')
  },

  mutations: {
    BIND_LOGIN: (state, data) => {
      sessionStorage.setItem('token', data)
      state.token = data
    },
    BIND_LOGOUT: (state) => {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('tel')
      sessionStorage.removeItem('name')
      state.token = null
    },
    SAVE_NAME: (state, data) => {
      sessionStorage.setItem('name', data),
      state.name = data
    },
    SAVE_TEL: (state, data) => {
      sessionStorage.setItem('tel', data)
      state.tel = data
    }
  }
}

export default user