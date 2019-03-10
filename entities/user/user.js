const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('./user-model')
const { formatUsers } = require('../entity-relations/user-book')

const addBookToUser = async (userId, book) => {
  try {
    const user = await User.findById(userId)

    if (!user) {
      return {
        errors: [
          {
            message: `Attempt to add a book to an author failed because the author wasn't found`
          }
        ]
      }
    }

    user.books.push(book)

    const savedUser = await user.save()
    return savedUser
  } catch (err) {
    console.log(err)
    throw err
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
      password: hashedPassword,
      firstName: userInput.firstName,
      lastName: userInput.lastName,
      bio: userInput.bio || '',
      books: []
    })

    const savedNewUser = await newUser.save()

    //  will not have books when they are a brand new user
    // const inflatedUser = formatUsers([savedNewUser])[0]

    return getUserAuthCredentials(savedNewUser)
  } catch (err) {
    console.log(err)
    throw err
  }
}

const deleteBookFromUser = async (userId, bookId) => {
  try {
    const user = await User.findById(userId)

    if (!user) {
      return {
        errors: [
          {
            message: `Attempt to delete a book from author failed because the author wasn't found`
          }
        ]
      }
    }

    user.books = user.books.filter(id => id.toString() !== bookId.toString())

    const savedUser = await user.save()
    return savedUser
  } catch (err) {
    console.log(err)
    throw err
  }
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
    user,
    auth: {
      token: token,
      tokenExpiration: 2
    }
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

const users = async () => {
  try {
    console.log('User.find()')
    const users = await User.find().sort({ firstName: 1, lastName: 1 })

    return formatUsers(users)
  } catch (err) {
    console.log(err)
    throw err
  }
}

module.exports = {
  addBookToUser,
  createUser,
  deleteBookFromUser,
  login,
  users
}
