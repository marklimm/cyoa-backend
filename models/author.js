const mongoose = require('mongoose')

const Schema = mongoose.Schema

const authorSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  createdDate: {
    type: Date,
    required: true
  },
  books: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Book'
    }
  ]
})

module.exports = mongoose.model('Author', authorSchema)
