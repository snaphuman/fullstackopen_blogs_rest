const Blog = require('../models/blog')

const findBlogById = async (id) => {
  const blog = await Blog.findById(id)
  return blog.toJSON()
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'lorem ipsum dolor sit amet'
  })

  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})

  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  nonExistingId,
  blogsInDb,
  findBlogById
}