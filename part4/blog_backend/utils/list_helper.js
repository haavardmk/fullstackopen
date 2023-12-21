const ld = require('lodash')

const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

const totalLikes = (blogs) => {
  let likes = 0
  for (let blog of blogs) {
    likes += blog.likes
  }
  return likes
}

const favoriteBlog = (blogs) => {
  let topLike = 0
  let topBlog = {}
  for (let blog of blogs) {
    if (blog.likes > topLike) {
      topLike = blog.likes
      topBlog = {
        title: blog.title,
        author: blog.author,
        likes: blog.likes,
      }
    }
  }
  return topBlog
}

function mostBlogs(blogs) {
  const countByAuthor = ld.countBy(blogs, 'author')
  const topAuthor = ld.maxBy(
    ld.keys(countByAuthor),
    (author) => countByAuthor[author]
  )

  return {
    author: topAuthor,
    blogs: countByAuthor[topAuthor],
  }
}

function mostLikes(blogs) {
  const likesByAuthor = ld(blogs)
    .groupBy('author')
    .map((posts, author) => ({
      author,
      likes: ld.sumBy(posts, 'likes'),
    }))
    .maxBy('likes')

  return likesByAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
