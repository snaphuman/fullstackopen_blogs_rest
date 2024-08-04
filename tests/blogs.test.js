const { test, describe } = require('node:test')
const assert = require('node:assert')
const blogsMock = require('../mocks/blogsMock')

const listHelper = require('../utils/list_helper')

test('blogsMock returns 1', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('total likes should equals 5', () => {
    const result = listHelper.totalLikes(listWithOneBlog)

    assert.strictEqual(result, 5)
  })
})

describe('favorite blog', () => {
  test('should find favorite blog', () => {
    const result = listHelper.favoriteBlog(blogsMock)
    const expect = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }

    assert.deepStrictEqual(result, expect)
  })
})

describe('most blogs', () => {
  test('should return the author with most blogs', () => {
    const result = listHelper.mostBlogs(blogsMock)
    const expect = {
      author: 'Robert C. Martin',
      blogs: 3
    }

    assert.deepStrictEqual(result, expect)
  })
})

describe('most likes', () => {

  test('should return the author with most likes', () => {
    const result = listHelper.mostLikes(blogsMock)
    const expect = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }

    assert.deepStrictEqual(result, expect)
  })
})