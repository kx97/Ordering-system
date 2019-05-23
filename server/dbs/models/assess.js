const mongoose = require('mongoose')
const Schema = mongoose.Schema
const assessSchema = new Schema({
  orderId: {
    type: String,
    required: true,
    unique: true 
  },
  uname: {
    type: String,
    required: true
  },
  utel: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  bname: {
    type: String,
    required: true
  },
  btel: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  reply: {
    type: String
  }
})
module.exports = {
  Assess: mongoose.model('assess', assessSchema)
}