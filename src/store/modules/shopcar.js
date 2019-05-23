const shopcar = {
  state: {
    items: sessionStorage.getItem('items') || null,
    total: sessionStorage.getItem('total') || 0
  },
  mutations: {
    ADDITEM: (state, data) => {
      let temp
      if(state.items === null) {
        temp = []
      } else {
        temp = JSON.parse(state.items)
      }
      window.console.log("data", data)
      if(temp.length === 0) {
        let obj = {}
        obj.btel = data.btel
        obj.bname = data.bname
        obj.time = data.time
        obj.menu = []
        let menu = {
          pic: data.pic,
          name: data.name,
          price: data.price,
          num: data.num
        }
        obj.menu.push(menu)
        window.console.log("obj", obj)
        temp.push(obj)
      } else {
        let obj = {}
        obj.btel = data.btel
        obj.bname = data.bname
        obj.time = data.time
        obj.menu = []
        let menu = {
          pic: data.pic,
          name: data.name,
          price: data.price,
          num: data.num
        }
        let index = -1
        for(let i = 0; i < temp.length; i++) {
          if(temp[i].btel === obj.btel) {
            index = i
          }
          window.console.log("index", index)
        }
        if(index !== -1 ) {
          for(let j = 0; j < temp[index].menu.length; j++) {
            if(temp[index].menu[j].name === menu.name) {
              temp[index].menu[j].num += menu.num
              break;
            } else {
              temp[index].menu.push(menu)
              break;
            }
          }
        } else {
          obj.menu.push(menu)
          window.console.log("obj", obj)
          temp.push(obj)
        } 
      }
      sessionStorage.setItem('items', JSON.stringify(temp))
      state.items = JSON.stringify(temp)
    },
    DEL_MENU: (state, data) => {
      let {index, i} = data
      let temp
      if(state.items === null) {
        temp = []
      } else {
        temp = JSON.parse(state.items)
      }
      window.console.log(temp)
      if(temp[index].menu.length === 1) {
        window.console.log(temp[index].menu)
        temp.splice(index, 1)
      } else {
        temp[index].menu.splice(i, 1)
      }
      sessionStorage.setItem('items', JSON.stringify(temp))
      state.items = JSON.stringify(temp)
    },
    ADDNUM: (state, data) => {
      let {index, i} = data
      let temp
      if(state.items === null) {
        temp = []
      } else {
        temp = JSON.parse(state.items)
      }
      temp[index].menu[i].num++
      sessionStorage.setItem('items', JSON.stringify(temp))
      state.items = JSON.stringify(temp)
    },
    REDNUM: (state, data) => {
      let {index, i} = data
      let temp
      if(state.items === null) {
        temp = []
      } else {
        temp = JSON.parse(state.items)
      }
      temp[index].menu[i].num--
      sessionStorage.setItem('items', JSON.stringify(temp))
      state.items = JSON.stringify(temp)
    },
    TOTAL: (state, data) => {
      state.total = data
      sessionStorage.setItem('total', data)
    },
    CLEAR: (state) => {
      sessionStorage.removeItem('items')
      state.items = null
    }
  }
}
export default shopcar