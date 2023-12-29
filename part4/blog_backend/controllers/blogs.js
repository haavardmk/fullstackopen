const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const { title, author, url, likes } = request.body

  if (!title || !url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  // console.log('token', request.token)
  // if (request.token === undefined) {
  //   return response.status(401).json({ error: 'Unauthorized' })
  // }

  const user = request.user
  console.log('user.id:', user.id)
  if (!user) {
    return response.status(401).json({ error: 'Unauthorized' })
  }
  // console.log(user)

  const blog = new Blog({
    title: title,
    author: author || '',
    url: url || '',
    likes: likes || 0,
    user: user.id,
  })

  try {
    const savedBlog = await blog.save()
    console.log('Saved blog:', savedBlog)
    user.blogs = user.blogs.concat(savedBlog.id)
    console.log('savedBlog.id: ', savedBlog.id)
    console.log('user.blogs: ', user.blogs)
    response.status(201).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    const user = await request.user

    if (blog.user === undefined || user.id === undefined) {
      return response.status(401).json({
        error: 'Unauthorized',
      })
    }

    if (blog.user.toString() === user.id.toString()) {
      // console.log('blog.user.toString: ', blog.user.toString())
      // console.log('decodedToken.id.toString(): ', user.id.toString())
      await blog.remove()
      response.status(204).end()
    } else {
      return response.status(401).json({
        error: 'User not author of post',
      })
    }
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then((updatedBlog) => {
      response.json(updatedBlog)
    })
    .catch((error) => next(error))
})

module.exports = blogsRouter
