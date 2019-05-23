const business = {
  state: {
    btoken: sessionStorage.getItem('btoken') || null,
    storeName: sessionStorage.getItem('storeName') || '',
    btel: sessionStorage.getItem('btel') || ''
    // bstate: sessionStorage.getItem('bstate') || '',
    // btags: sessionStorage.getItem('btags') || ''
  },
  mutations: {
    BIND_BLOGIN: (state, data) => {
      sessionStorage.setItem('btoken', data)
      state.btoken = data
    },
    BIND_BLOGOUT: (state) => {
      sessionStorage.removeItem('btoken')
      sessionStorage.removeItem("storeName")
      sessionStorage.removeItem("btel")
      // sessionStorage.removeItem("bstate")
      // sessionStorage.removeItem("btags")
      state.btoken = null
    },
    SAVE_BNAME: (state, data) => {
      sessionStorage.setItem('storeName', data)
      state.storeName = data
    },
    SAVE_BTEL: (state, data) => {
      sessionStorage.setItem('btel', data)
      state.btel = data
    }
    // SAVE_BSTATE: (state, data) => {
    //   sessionStorage.setItem("bstate", data)
    //   state.bstate = data
    // },
    // SAVE_BTAGS: (state, data) => {
    //   sessionStorage.setItem('btags', data)
    //   state.btags = data
    // }
  }
}

export default business