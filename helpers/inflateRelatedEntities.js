const Author = require('../models/author')
const Book = require('../models/book')

const formatAuthors = authors => {
  return authors.map(author => {
    return {
      ...author._doc,
      books: getBooksByBookIds.bind(this, author.books),
      createdAt: new Date(author._doc.createdAt).toISOString(),
      updatedAt: new Date(author._doc.updatedAt).toISOString()
    }
  })
}

const formatBooks = books => {
  return books.map(book => {
    return {
      ...book._doc,
      authors: getAuthorsByAuthorIds.bind(this, book.authors),
      createdAt: new Date(book._doc.createdAt).toISOString(),
      updatedAt: new Date(book._doc.updatedAt).toISOString()
    }
  })
}

const getAuthorsByAuthorIds = async authorIds => {
  const authors = await Author.find({ _id: { $in: authorIds } })

  return formatAuthors(authors)
}

const getBooksByBookIds = async bookIds => {
  const books = await Book.find({ _id: { $in: bookIds } })

  return formatBooks(books)
}

module.exports = {
  formatAuthors,
  formatBooks,
  getAuthorsByAuthorIds,
  getBooksByBookIds
}
