const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('./user-model')

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

const createUser = (args, req) => {
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

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email })
  if (!user) {
    throw new Error('User does not exist!')
  }

  const passwordMatched = await bcrypt.compare(password, user.password)
  if (!passwordMatched) {
    throw new Error('Password was incorrect!')
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, 'some-seecret-keyyyy', {
    expiresIn: '1h'
  })

  return {
    userId: user.id,
    token: token,
    tokenExpiration: 1
  }
}

module.exports = {
  createUser,
  login,
  users
}
