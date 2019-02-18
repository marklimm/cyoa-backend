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

const getUserAuthCredentials = user => {
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    'some-seecret-keyyyy',
    {
      expiresIn: '2h'
    }
  )

  return {
    userId: user.id,
    firstName: user.firstName,
    token: token,
    tokenExpiration: 1
  }
}

const createUser = async (args, req) => {
  const { userInput } = args

  try {
    const user = await User.findOne({ email: userInput.email })

    if (user) {
      return {
        errors: [{ message: 'Sorry, email is already taken' }]
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

    return getUserAuthCredentials(savedNewUser)
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
        errors: [{ message: friendlyFailedLoginMessage }]
      }
    }

    const passwordMatched = await bcrypt.compare(password, user.password)
    if (!passwordMatched) {
      return {
        errors: [{ message: friendlyFailedLoginMessage }]
      }
    }

    return getUserAuthCredentials(user)
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
