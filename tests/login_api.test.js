const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const { usersInDb, findUserByUsername } = require('./users_api_helper.test')


describe('login API', () => {

    beforeEach(async() => {
        await User.deleteMany({})
        
        const passwordHash = await bcrypt.hash('mySecret', 10);
        const user = new User({ username: 'root', passwordHash})

        await user.save()
    })

    describe('api/login', async () => {
        test('post login should response valid token', async () => {
            const {username, id} = await findUserByUsername('root')

            const result = await api
                .post('/api/login')
                .send({
                    username,
                    password: 'mySecret'
                })
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const decoded = jwt.decode(result.body.token)

            assert.deepStrictEqual({username, id}, {username: decoded.user, id: decoded.id})
        })
    })
    after(async () => {
        mongoose.connection.close()
    })
})
