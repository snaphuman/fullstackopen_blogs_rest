const bcrypt = require('bcrypt')
const router = require('express').Router();
const User = require('../models/user');
const { validateLength } = require('../utils/user_helper');

router.get('/', async(req, res) => {

    const users = await User.find({})
                            .populate('blogs', {title: 1, author: 1})

    res.status(200).json(users)
})

router.post('/', async (req, res) => {

    const { username, name, password } = req.body

    const validUserLength = validateLength(username, 3)
    const validPasswordLength = validateLength(password, 3)

    const invalidUser = [validUserLength, validPasswordLength].some((item) => !item)

    console.log('invalid user', invalidUser)

    if(invalidUser) {
        return res.status(401).json({
            error: 'expected username or password to have more than three chars'
        })

    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const saved = await user.save()

    res.status(201).json(saved)
})

module.exports = router;