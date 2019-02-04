const bcrypt = require('bcryptjs')
const User = require('../../models/user')

const users = async () => {
  const users = await User.find()

  return users.map(user => {
    return {
      ...user._doc,
      createdAt: new Date(user._doc.createdAt).toISOString(),
      updatedAt: new Date(user._doc.updatedAt).toISOString()
    }
  })
}

const createUser = args => {
  const { userInput } = args

  return User.findOne({ email: userInput.email })
    .then(user => {
      if (user) {
        throw new Error('Email is already taken')
      }

      return bcrypt.hash(userInput.password, 12)
    })
    .then(hashedPassword => {
      const newUser = new User({
        email: userInput.email,
        password: hashedPassword
      })

      return newUser.save()
    })
    .then(newUser => {
      return {
        ...newUser._doc,
        password: null,
        createdAt: new Date(newUser._doc.createdAt).toISOString(),
        updatedAt: new Date(newUser._doc.updatedAt).toISOString()
      }
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports = {
  users,
  createUser
}
