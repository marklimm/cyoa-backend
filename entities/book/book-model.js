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
  authors: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Author'
    }
  ]
}, { timestamps: true })

module.exports = mongoose.model('Book', bookSchema)
