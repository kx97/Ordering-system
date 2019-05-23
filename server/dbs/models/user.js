const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  telNumber: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  address: {
    type: Array
  },
  account: {
    type: Number
  },
  orderIds: {
    type: Array
  }
})

module.exports = {
  Users: mongoose.model('User', userSchema)
}