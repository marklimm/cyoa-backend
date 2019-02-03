const bcrypt = require('bcryptjs')

const Author = require('../../models/author')
const Book = require('../../models/book')
const User = require('../../models/user')

module.exports = {
  authors: async () => {
    const authors = await Author.find().populate('books')

    return authors.map(author => {
      return {
        ...author._doc,
        createdDate: new Date(author._doc.createdDate).toISOString()
      }
    })
  },
  books: async () => {
    try {
      const books = await Book.find().populate('authors')
      return books.map(book => {
        return {
          ...book._doc,
          createdDate: new Date(book._doc.createdDate).toISOString()
        }
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  },
  users: async () => {
    const users = await User.find()

    console.log('users', users)

    return users.map(user => {
      return {
        ...user._doc,
        createdDate: new Date(user._doc.createdDate).toISOString()
      }
    })
  },

  createAuthor: async args => {
    const { authorInput } = args

    const author = new Author({
      firstName: authorInput.firstName,
      lastName: authorInput.lastName,
      description: authorInput.description,
      createdDate: new Date(),
      books: []
    })

    const savedAuthor = await author.save()
    return savedAuthor
  },
  createBook: async args => {
    const { bookInput } = args

    const book = new Book({
      title: bookInput.title,
      description: bookInput.description,
      createdDate: new Date(),

      //  hardcoding an author value
      authors: ['5c57304490026e2358a5a2a6']
    })

    try {
      const savedBook = await book.save()

      //  add this book to the appropriate author's "books" list
      const author = await Author.findById('5c57304490026e2358a5a2a6')

      if (!author) {
        throw new Error('Author was not found')
      }

      author.books.push(book)
      await author.save()

      console.log('saved book', savedBook)
      return savedBook

      //  uncomment if we want to include the Author information in the return value
      // const retBook = await Book.findById(savedBook._id).populate('authors')

      // console.log('retbook', retBook)
      // return retBook
    } catch (err) {
      console.error(err)
    }
  },
  createUser: args => {
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
          password: hashedPassword,
          createdDate: new Date()
        })

        return newUser.save()
      })
      .then(newUser => {
        console.log('newUser', newUser)

        return {
          ...newUser._doc,
          password: null,
          createdDate: new Date(newUser._doc.createdDate).toISOString()
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
