const mongooes = require('mongoose')
const Schema = mongooes.Schema
const busiSchema = new Schema({
  pic: {
    type: String
  },
  storeName: {
    type: String,
    require: true
  },
  telNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  time: {
    type: Number
  },
  tags: {
    type: String
  },
  saleCount: {
    type: Number
  },
  orderIds: {
    type: Array
  },
  account: {
    type: Number
  },
  license: {
    type: String
  },
  token: {
    type: String,
    required: true
  }
})

module.exports = {
  Busis: mongooes.model('Busi', busiSchema)
}