const Book = require('./book-model')
const { formatBooks } = require('../entity-relations/user-book')
const { addBookToUser } = require('../user/user')

const books = async () => {
  try {
    const books = await Book.find().sort({ title: 1 })
    return formatBooks(books)
  } catch (err) {
    console.log(err)
    throw err
  }
}

const createBook = async (args, req) => {
  if (!req.isAuth) {
    return {
      errors: [{ message: 'You are not authenticated to create a book' }]
    }
  }

  const { bookInput } = args

  const hardCodedUserId = req.userId

  const book = new Book({
    title: bookInput.title || '',
    description: decodeURI(bookInput.description) || '',

    //  hardcoding an author value
    authors: [hardCodedUserId]
  })

  try {
    const savedBook = await book.save()

    //  add this book to the appropriate author's "books" list
    await addBookToUser(hardCodedUserId, savedBook)

    const inflatedBook = formatBooks([savedBook])[0]

    return {
      book: inflatedBook
    }
  } catch (err) {
    console.error(err)
    throw err
  }
}

const updateBook = async (args, req) => {
  if (!req.isAuth) {
    return {
      errors: [{ message: 'You are not authenticated to edit a book' }]
    }
  }

  const { bookInput } = args

  try {
    const book = await Book.findOne({ _id: bookInput._id })

    if (!book) {
      return {
        errors: [{ message: 'Sorry, that book was not found' }]
      }
    }

    book.title = bookInput.title || ''
    book.description = decodeURI(bookInput.description) || ''

    const savedBook = await book.save()

    return {
      book: formatBooks([savedBook])[0]
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

const deleteBook = async (args, req) => {
  if (!req.isAuth) {
    return {
      errors: [{ message: 'You are not authenticated to edit a book' }]
    }
  }

  const { bookInput } = args

  try {
    const book = await Book.deleteOne({ _id: bookInput._id })

    console.log('book', book)

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

module.exports = {
  books,
  createBook,
  deleteBook,
  updateBook
}
