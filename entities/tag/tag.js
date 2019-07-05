const Tag = require('./tag-model')

const createTag = async (args, { req, loaders }) => {
  if (!req.isAuth) {
    return {
      errors: [{ message: 'You are not authenticated to create a tag' }]
    }
  }

  const { tagInput } = args

  const tag = new Tag({
    label: tagInput.label || ''
  })

  try {
    const savedTag = await tag.save()

    return {
      tag: savedTag
    }
  } catch (err) {
    console.error(err)
    throw err
  }
}

const tags = async (args, { loaders, contextCreationTime }) => {
  try {
    const tags = await Tag.find().sort({ label: 1 })

    return tags
  } catch (err) {
    console.log(err)
    throw err
  }
}

module.exports = {
  createTag,
  tags
}
