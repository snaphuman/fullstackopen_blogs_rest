const router = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

router.get('/', async (req, res) => {
  const blogs = await Blog.find({})
                          .populate('user', {username: 1, name: 1})
  res.json(blogs)
})

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if(blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

router.post('/', async (req, res) => {
  const { title, author, url, likes, userId } = req.body

  if(!req.verifiedToken.id) {
    return res.status(401).json({error: 'token invalid'})
  }

  const user = await User.findById(req.user.id)

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user.id
  })

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  res.status(201).json(result)
})

router.delete('/:id', userExtractor, async (req, res) => {
  if(!req.verifiedToken.id) {
    return res.status(401).json({error: 'token invalid'})
  }

  const blog = await Blog.findById(req.params.id)

  if(!blog) {
    return res.status(401).json({error: 'blog not found'})
  }

  if(req.user.id !== blog.user.toString()) {
    return res.status(401).json({error: 'no authorized to delete this blog'})
  }

  await Blog.findByIdAndDelete(req.params.id)

  res.status(204).end()
})

router.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body
  const blog = { title, author, url, likes }

  const result = await Blog.findByIdAndUpdate(
    req.params.id,
    blog, {
      new: true,
      runValidators: true,
      context: 'query'
    })

  res.send(result)
})

module.exports = router


