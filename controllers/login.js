const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')

router.post('/', async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({username})
    const isPasswordCorrect = user === null 
                            ? false
                            : await bcrypt.compare(password, user.passwordHash)

    if (!(user && isPasswordCorrect)) {
        return res.status(401).json({
            error: 'Invalid user and password'
        })
    }

    const userForToken = {
        user: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    res
    .status(200)
    .send({
        token, username: user.username, name: user.name
    })
})

module.exports = router