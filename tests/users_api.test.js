const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const { usersInDb } = require('./users_api_helper.test')

describe('users API', () => {

    beforeEach(async() => {
        await User.deleteMany({})
        
        const passwordHash = await bcrypt.hash('mySecret', 10);
        const user = new User({ username: 'root', passwordHash})

        await user.save()
    })

    describe('/api/users', () => {
        test('should create new username', async () => {
            const initialUsers = await usersInDb()

            const user = {
                username: 'fhernandez',
                name: 'Fabian H',
            password: '123test',
            }

            const result = await api
                .post('/api/users')
                .send(user)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const finalUsers = await usersInDb()
            assert.strictEqual(initialUsers.length, finalUsers.length - 1)

            const usernames = finalUsers.map(u => u.username)
            assert(usernames.includes(user.username))
       })
    })
    after(async () => {
        mongoose.connection.close()
    })
})