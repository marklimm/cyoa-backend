const DataLoader = require('dataloader')

const User = require('../user/user-model')
const Book = require('../book/book-model')

const bookLoader = new DataLoader(bookIds => {
  return getBooksByBookIds(bookIds)
})
console.log('bookLoader new DataLoader()')

const userLoader = new DataLoader(userIds => {
  return getUsersByUserIds(userIds)
})
console.log('userLoader new DataLoader()')

const formatBooks = books => {
  return books.map(book => {
    return {
      ...book._doc,
      // authors: () => getUsersByUserIds(book.authors)
      authors: async () => {
        const authorIds = book.authors.map(ui => ui.toString())
        const res = await userLoader.loadMany(authorIds)

        return res
      }
    }
  })
}

const formatUsers = async users => {
  return users.map(user => {
    return {
      ...user._doc,
      bio: user.bio || '',
      // books: () => getBooksByBookIds(user.books)
      books: async () => {
        const bookIds = user.books.map(bi => bi.toString())
        const res = await bookLoader.loadMany(bookIds)

        return res
      }
    }
  })
}

const getBooksByBookIds = async bookIds => {
  console.log('Book.find({ _id: { $in: bookIds }', bookIds)
  const books = await Book.find({ _id: { $in: bookIds } })

  const orderedBookResults = sortResultsByRequestedIds(bookIds, books)
  return formatBooks(orderedBookResults)
}

const getUsersByUserIds = async userIds => {
  console.log('User.find({ _id: { $in: userIds }', userIds)
  const users = await User.find({ _id: { $in: userIds } })

  const orderedUserResults = sortResultsByRequestedIds(userIds, users)
  return formatUsers(orderedUserResults)
}

const sortResultsByRequestedIds = (ids, results) => {
  let orderedResults = []
  ids.forEach(id => {
    const foundEntity = results.find(entity => entity._id.toString() === id)
    orderedResults.push(foundEntity)
  })

  return orderedResults
}

module.exports = {
  formatUsers,
  formatBooks,
  getUsersByUserIds,
  getBooksByBookIds
}
