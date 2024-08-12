const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const blogsMock = require('../mocks/blogsMock')
const { blogsInDb, findBlogById } = require('./blogs_api_helper.test')
const { usersInDb } = require('./users_api_helper.test')

describe('blogs API', () => {
  const [blog1, blog2] = blogsMock
  const items = [blog1, blog2]

  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogPromises = items.map(async (item) => {
      const blogObj = new Blog(item)
      return blogObj.save()
    })

    await Promise.all(blogPromises)
  })

  describe('/api/blogs', () => {
    test('get blogs should response as JSON', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('blogs identifier should be id', async () => {
      const response = await api.get('/api/blogs')
      response.body.forEach(blog =>
        assert.strictEqual(blog.hasOwnProperty('id'), true)
      )
    })

    test('get blogs should return two elements', async () => {
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, 2)
    })

    test('post blog should save one one blog', async () => {

      const user = await usersInDb();
      const blog = {...blogsMock[2], userId: user[0].id.toString()}

      await api
        .post('/api/blogs')
        .send(blog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogs = await blogsInDb()
      const titles = blogs.map(blog => blog.title)

      assert.strictEqual(blogs.length, 3)
      assert(titles.includes('Canonical string reduction'))
    })

    test('post blog without title is not added', async () => {

      const user = await usersInDb();

      const badBlog = {
        author: 'bar',
        url: 'example.net',
        likes: 1,
        userId: user[0].id.toString()
      }

      await api
        .post('/api/blogs')
        .send(badBlog)
        .expect (400)

      const blogs = await blogsInDb()

      assert.strictEqual(blogs.length, 2)
    })

    test('validate error response for post blog without url and title', async () => {

      const user = await usersInDb();

      const badBlog = {
        author: 'bar',
        likes: 1,
        userId: user[0].id.toString()
      }

      const response = await api
        .post('/api/blogs')
        .send(badBlog)
        .expect(400)

      const blogs = await blogsInDb()

      assert.strictEqual(response.body.error, 'Blog validation failed: title: Path `title` is required., url: Path `url` is required.')
    })

    test('create post without likes property should default to 0', async () => {

      const user = await usersInDb();

      const noLikesBlog = {
        title: 'Lorem Ipsum',
        author: 'bar',
        url: 'example.net',
        userId: user[0].id.toString()
      }

      const result = await api
        .post('/api/blogs')
        .send(noLikesBlog)
        .expect(201)

      const createdId = result.body.id

      assert.strictEqual((await findBlogById(createdId)).likes, 0)
    })
  })

  describe('/api/blogs/:id', () => {
    test('get one blog by id', async () => {
      const id = '5a422a851b54a676234d17f7'
      const response = await api.get(`/api/blogs/${id}`)

      assert.strictEqual(response.body.title, 'React patterns')
    })

    test('delete post by id', async () => {
      const id = '5a422a851b54a676234d17f7'
      await api
        .delete(`/api/blogs/${id}`)
        .expect(204)

      const blogs = await blogsInDb()

      assert.strictEqual(blogs.length, 1)
    })

    test('update post by id', async() => {
      const id = '5a422aa71b54a676234d17f8'
      const blog = findBlogById(id)
      const title = 'Go To statement not a good practice'

      const update = { ...blog, title }

      const response = await api
        .put(`/api/blogs/${id}`)
        .send(update)

      assert.strictEqual(response.body.title, title)
    })

  })
  after(async () => {
    mongoose.connection.close()
  })
})