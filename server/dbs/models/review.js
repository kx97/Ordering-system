const mongoose = require('mongoose')
const Schema = mongoose.Schema
const reviewSchema = new Schema({
  btel: {
    type: String,
    required: true,
    unique: true
  },
  license: {
    type: String,
    required: true
  }
})

module.exports = {
  Review: mongoose.model('review', reviewSchema)
}