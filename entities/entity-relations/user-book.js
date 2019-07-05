const DataLoader = require('dataloader')

const Book = require('../book/book-model')
const Tag = require('../tag/tag-model')
const User = require('../user/user-model')

const getBookLoader = () => {
  return new DataLoader(bookIds => {
    return getBooksByBookIds(bookIds)
  })
}

const getTagLoader = () => {
  return new DataLoader(tagIds => {
    return getTagsByTagIds(tagIds)
  })
}

const getUserLoader = () => {
  return new DataLoader(userIds => {
    return getUsersByUserIds(userIds)
  })
}

const formatBooks = (books, loaders) => {
  return books.map(book => {
    return {
      ...book._doc,
      authors: async () => {
        const authorIds = book.authors.map(authorId => authorId.toString())
        const res = await loaders.userLoader.loadMany(authorIds)

        return formatUsers(res, loaders)
      },
      tags: async () => {
        const tagIds = book.tags.map(tagId => tagId.toString())
        const res = await loaders.tagLoader.loadMany(tagIds)

        return res
      }
    }
  })
}

const formatUsers = async (users, loaders) => {
  return users.map(user => {
    return {
      ...user._doc,
      bio: user.bio || '',
      books: async () => {
        const bookIds = user.books.map(bi => bi.toString())
        const res = await loaders.bookLoader.loadMany(bookIds)

        return formatBooks(res, loaders)
      }
    }
  })
}

const getBooksByBookIds = async bookIds => {
  console.log('Book.find({ _id: { $in: bookIds }', bookIds)
  const books = await Book.find({ _id: { $in: bookIds } })

  const orderedBookResults = sortResultsByRequestedIds(bookIds, books)

  return orderedBookResults
}

const getTagsByTagIds = async tagIds => {
  const tags = await Tag.find({ _id: { $in: tagIds } })

  const orderedTagResults = sortResultsByRequestedIds(tagIds, tags)

  return orderedTagResults
}

const getUsersByUserIds = async userIds => {
  const users = await User.find({ _id: { $in: userIds } })

  const orderedUserResults = sortResultsByRequestedIds(userIds, users)

  return orderedUserResults
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
  getBookLoader,
  getTagLoader,
  getUserLoader
}
