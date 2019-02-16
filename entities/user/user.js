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

const createUser = async (args, req) => {
  const { userInput } = args

  try {
    const user = await User.findOne({ email: userInput.email })

    if (user) {
      return {
        errors: [
          { message: 'Sorry, email is already taken' }
        ]
      }
    }

    const hashedPassword = await bcrypt.hash(userInput.password, 12)

    const newUser = new User({
      email: userInput.email,
      firstName: userInput.firstName,
      lastName: userInput.lastName,
      password: hashedPassword
    })

    const savedNewUser = await newUser.save()

    return {
      ...savedNewUser._doc,
      password: null,
      createdAt: new Date(newUser._doc.createdAt).toISOString(),
      updatedAt: new Date(newUser._doc.updatedAt).toISOString()
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

const login = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email: email })

    const friendlyFailedLoginMessage = 'Sorry, that login failed'

    if (!user) {
      return {
        errors: [
          { message: friendlyFailedLoginMessage }
        ]
      }
    }

    const passwordMatched = await bcrypt.compare(password, user.password)
    if (!passwordMatched) {
      return {
        errors: [
          { message: friendlyFailedLoginMessage }
        ]
      }
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, 'some-seecret-keyyyy', {
      expiresIn: '1h'
    })

    return {
      userId: user.id,
      token: token,
      tokenExpiration: 1
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

module.exports = {
  createUser,
  login,
  users
}
