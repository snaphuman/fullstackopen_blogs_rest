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
    let token = ''

    beforeEach(async() => {
        await User.deleteMany({})
        
        const passwordHash = await bcrypt.hash('mySecret', 10);
        const user = new User({ username: 'root', passwordHash, _id: '66cbdb41cb3c840100a8a353'})

        await user.save()
    })

    beforeEach(async() => {
        const body = {
          "username": "root",
          "password": "mySecret"
        }

        const login = await api
          .post('/api/login')
          .send(body)

        token = login.body.token
    })

    describe('/api/users', () => {
        test('post request should create new username', async () => {
            const initialUsers = await usersInDb()

            const user = {
                username: 'fhernandez',
                name: 'Fabian H',
                password: '123test',
            }

            const result = await api
                .post('/api/users')
                .set('Authorization', `Bearer ${token}`)
                .send(user)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const finalUsers = await usersInDb()
            assert.strictEqual(initialUsers.length, finalUsers.length - 1)

            const usernames = finalUsers.map(u => u.username)
            assert(usernames.includes(user.username))
       })

       test('post request should validate id user has already taken', async() => {
            const initialUsers = await usersInDb()

            const user = {
                username: 'root',
                name: 'Super User',
                password: '1234test'
            }

            const result = await api
                .post('/api/users')
                .set('Authorization', `Bearer ${token}`)
                .send(user)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            const finalUsers = await usersInDb()

            assert(result.body.error.includes('expected username to be unique'))
            assert.strictEqual(initialUsers.length, finalUsers.length)
       })

       test('post request should validate if user has three characteds', async() => {
            const initialUsers = await usersInDb()

            const user = {
                username: 'fo',
                name: 'Bad User',
                password: '1234test'
            }

            const result = await api
                .post('/api/users')
                .set('Authorization', `Bearer ${token}`)
                .send(user)
                .expect(401)
                .expect('Content-Type', /application\/json/)

            const finalUsers = await usersInDb()

            assert(result.body.error.includes('expected username or password to have more than three chars'))
            assert.strictEqual(initialUsers.length, finalUsers.length)
       })

       test('post request should validate if password has more than three characteds', async() => {
            const initialUsers = await usersInDb()

            const user = {
                username: 'foooo',
                name: 'Bad password',
                password: '12'
            }

            const result = await api
                .post('/api/users')
                .set('Authorization', `Bearer ${token}`)
                .send(user)
                .expect(401)
                .expect('Content-Type', /application\/json/)

            const finalUsers = await usersInDb()

            assert(result.body.error.includes('expected username or password to have more than three chars'))
            assert.strictEqual(initialUsers.length, finalUsers.length)
       })
    })
    after(async () => {
        mongoose.connection.close()
    })
})