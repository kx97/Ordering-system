const admin = {
  state: {
    admin: sessionStorage.getItem('admin') || ''
  },
  mutations: {
    BIND_ADMIN: (state, data) => {
      sessionStorage.setItem('admin', data)
      state.admin = data
    }
  }
}
export default admin