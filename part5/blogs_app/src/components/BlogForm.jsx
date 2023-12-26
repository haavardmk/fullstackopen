import React, { useState } from 'react'

const BlogForm = ({ createBlog, setMessage, user, blogFormRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
    })
    setTitle('')
    setAuthor('')
    setURL('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        Title:
        <input
          type='text'
          value={title}
          name='Title'
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        Author:
        <input
          type='text'
          value={author}
          name='Author'
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        URL:
        <input
          type='text'
          value={url}
          name='URL'
          onChange={({ target }) => setURL(target.value)}
        />
      </div>
      <button type='submit'>save</button>
    </form>
  )
}

export default BlogForm
