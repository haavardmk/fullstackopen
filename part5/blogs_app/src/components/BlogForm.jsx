import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
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
          id='titleInput'
          placeholder='titleInput'
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        Author:
        <input
          type='text'
          value={author}
          name='Author'
          data-testid='authorInput'
          id='authorInput'
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        URL:
        <input
          type='text'
          value={url}
          name='URL'
          placeholder='URLInput'
          id='URLInput'
          onChange={({ target }) => setURL(target.value)}
        />
      </div>
      <button type='submit'>save</button>
    </form>
  )
}

export default BlogForm
