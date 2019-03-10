const DataLoader = require('dataloader')

const User = require('../user/user-model')
const Book = require('../book/book-model')

const bookLoader = new DataLoader(bookIds => {
  console.log('bookLoader Book.find()', bookIds)
  return Book.find({ _id: { $in: bookIds } })
})

const userLoader = new DataLoader(userIds => {
  console.log('userLoader User.find()', userIds)
  return User.find({ _id: { $in: userIds } })
})

const formatUsers = async users => {
  return users.map(user => {
    return {
      ...user._doc,
      books: getBooksByBookIds.bind(this, user.books)
    }
  })
}

const formatBooks = books => {
  return books.map(book => {
    return {
      ...book._doc,
      authors: getUsersByUserIds.bind(this, book.authors)
    }
  })
}

const getUsersByUserIds = async userIds => {
  console.log('getUsersByUserIds', userIds)

  const users = await userLoader.loadMany(userIds.map(ui => ui.toString()))

  return formatUsers(users)
}

const getBooksByBookIds = async bookIds => {
  console.log('getBooksByBookIds', bookIds)
  const books = await bookLoader.loadMany(bookIds.map(ui => ui.toString()))

  return formatBooks(books)
}

module.exports = {
  formatUsers,
  formatBooks,
  getUsersByUserIds,
  getBooksByBookIds
}
