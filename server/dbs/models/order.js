const mongoose = require("mongoose")
const Schema = mongoose.Schema
const orderSchema = new Schema({
  tel: {
    type: String,
    required: true
  },
  addr: {
    type: Object,
    required: true
  },
  btel: {
    type: String,
    required: true
  },
  bname: {
    type: String,
    required: true
  },
  menu: {
    type: Array
  },
  price: {
    type: Number
  },
  orderTime: {
    type: Date,
    required: true
  },
  arriTime: {
    type: Date
  },
  lastTime: {
    type: Date
  },
  state: {
    type: Number,
    required: true
  },
  isAssess: {
    type: Boolean
  },
  refuse: {
    type: Boolean
  }
})
module.exports = {
  Orders: mongoose.model('order', orderSchema)
}