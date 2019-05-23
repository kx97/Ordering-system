const mongoose = require('mongoose')
const Schema = mongoose.Schema
const menuSchema = new Schema({
  btel: {
    type: String,
    required: true
  },
  pic: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  saleCount: {
    type: Number,
    required: true
  }
})
module.exports = {
  Menus: mongoose.model('Menu', menuSchema)
}