const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    required: true
  },
  authors: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Author'
    }
  ]
})

module.exports = mongoose.model('Book', bookSchema)
