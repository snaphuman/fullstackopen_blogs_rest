const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, curr) =>
    sum += curr.likes, 0
  )
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((fav, curr) =>
  {
    const { title, likes, author } = curr.likes > fav.likes ? curr : fav
    return { title, likes, author }
  })
}

const mostBlogs = (blogs) => {
  const count = _.countBy(blogs, 'author')

  return Object.entries(count).reduce((most, [a, t]) => {
    const current = { author: a, blogs: t }
    return current.blogs > most.blogs ? current : most
  }, { author: '', blogs: 0 })
}

const mostLikes = (blogs) => {
  const groups = _.groupBy(blogs, 'author')

  return Object.entries(groups).reduce((most, [author, b]) => {
    const total = totalLikes(b)
    const current = { author, likes: total }

    return current.likes > most.likes ? current : most
  }, { author: '', likes: 0 })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}