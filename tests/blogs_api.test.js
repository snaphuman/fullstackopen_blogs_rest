const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert');
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blog = require('../models/blog')

const api = supertest(app);

const blogsMock = require('../mocks/blogsMock');
const Blog = require('../models/blog')

describe('blogs API', () => {
    beforeEach(async () => {
        await blog.deleteMany({});
        let blogObj = new Blog(blogsMock[0]);
        await blogObj.save();
        blogObj = new Blog(blogsMock[1]);
        await blogObj.save();
    })

    test('blogs are returned as JSON', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('response should return two blogs', async () => {
        const response = await api.get('/api/blogs');

        assert.strictEqual(response.body.length, 2);
    })

    after(async () => {
        mongoose.connection.close()
    })
})