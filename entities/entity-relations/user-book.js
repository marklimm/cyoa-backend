const User = require('../user/user-model')
const Book = require('../book/book-model')

const formatUsers = users => {
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
      authors: getUsersByUserIds.bind(this, book.authors),
      description: decodeURI(book.description)
    }
  })
}

const getUsersByUserIds = async userIds => {
  const users = await User.find({ _id: { $in: userIds } })

  return formatUsers(users)
}

const getBooksByBookIds = async bookIds => {
  const books = await Book.find({ _id: { $in: bookIds } })

  return formatBooks(books)
}

module.exports = {
  formatUsers,
  formatBooks,
  getUsersByUserIds,
  getBooksByBookIds
}
