const Book = require('./book-model')
const { formatBooks } = require('../entity-relations/user-book')
const { addBookToUser, deleteBookFromUser } = require('../user/user')

const books = async (args, { loaders, contextCreationTime }) => {
  try {
    const books = await Book.find().sort({ title: 1 })

    return formatBooks(books, loaders)
  } catch (err) {
    console.log(err)
    throw err
  }
}

const createBook = async (args, { req, loaders }) => {
  if (!req.isAuth) {
    return {
      errors: [{ message: 'You are not authenticated to create a book' }]
    }
  }

  const { bookInput } = args

  const authorUserId = req.userId

  const book = new Book({
    title: bookInput.title || '',
    description: decodeURI(bookInput.description) || '',

    authors: [authorUserId],
    tags: bookInput.tags || []
  })

  try {
    const savedBook = await book.save()

    //  add this book to the appropriate author's "books" list
    await addBookToUser(authorUserId, savedBook)

    const inflatedBook = formatBooks([savedBook], loaders)[0]

    return {
      book: inflatedBook
    }
  } catch (err) {
    console.error(err)
    throw err
  }
}

const deleteBook = async (args, { req }) => {
  if (!req.isAuth) {
    return {
      errors: [{ message: 'You are not authenticated to edit a book' }]
    }
  }

  const { bookInput } = args

  try {
    const bookResult = await getBook(bookInput._id, req.userId)

    if (bookResult.errors) {
      return bookResult
    }

    await Book.deleteOne({
      _id: bookInput._id,
      authors: req.userId
    })

    //  delete this book from the appropriate author's "books" list
    await deleteBookFromUser(req.userId, bookInput._id)

    return {
      book: {
        _id: bookInput._id
      }
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

const getBook = async (bookId, userId) => {
  const book = await Book.findOne({
    _id: bookId,
    authors: userId
  })

  if (!book) {
    return {
      errors: [
        { message: 'You do not have authorization to edit/delete this book' }
      ]
    }
  }

  return {
    book: book
  }
}

const updateBook = async (args, { req, loaders }) => {
  if (!req.isAuth) {
    return {
      errors: [{ message: 'You are not authenticated to edit a book' }]
    }
  }

  const { bookInput } = args

  try {
    const bookResult = await getBook(bookInput._id, req.userId)

    if (bookResult.errors) {
      return bookResult
    }

    const { book } = bookResult
    book.title = bookInput.title || ''
    book.description = decodeURI(bookInput.description) || ''
    book.tags = bookInput.tags || []

    const savedBook = await book.save()

    return {
      book: formatBooks([savedBook], loaders)[0]
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

module.exports = {
  books,
  createBook,
  deleteBook,
  updateBook
}
