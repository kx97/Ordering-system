const getters = {
  token: state => state.user.token,
  name: state => state.user.name,
  tel: state => state.user.tel,
  btoken: state => state.business.btoken,
  storeName: state => state.business.storeName,
  btel: state => state.business.btel,
  bstate: state => state.business.bstate,
  btags: state => state.business.btags,
  items: state => state.shopcar.items,
  total: state => state.shopcar.total,
  admin: state => state.admin.admin
}

export default getters