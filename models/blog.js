const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
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

