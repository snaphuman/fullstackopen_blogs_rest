const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: String,
  url: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

schema.set('toJSON', {
  transform: (document, obj) => {
    obj.id = obj._id.toString()
    delete obj._id
    delete obj.__v
  }
})

const Blog = mongoose.model('Blog', schema)

module.exports = Blog

