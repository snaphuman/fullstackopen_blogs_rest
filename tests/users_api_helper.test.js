const User = require('../models/user')

const usersInDb = async () => {
    const users = await User.find({})

    return users.map(user => user.toJSON())
}

const findUserByUsername = async (username) => {
    const user = await User.findOne({username})

    return user.toJSON()
}

module.exports = {
    usersInDb,
    findUserByUsername
}