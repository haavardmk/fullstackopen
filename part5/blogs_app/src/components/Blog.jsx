import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, addLike, removeBlog }) => {
  const [view, setView] = useState('')

  const toggleView = () => {
    setView(!view)
  }

  const userIsAuthor = () => {
    try {
      return blog.user.username && user.username
    } catch (err) {
      console.log('user unavailable', err)
      return false
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      <li className='blog'>
        <h2>
          {blog.title}
          <button onClick={toggleView}>{view ? 'Hide' : 'View'}</button>
        </h2>
        {view && (
          <>
            <h3>{blog.author}</h3>
            <p>{blog.url}</p>
            <div>Likes: {blog.likes}</div>
            <button onClick={addLike}>Like</button>
            {userIsAuthor() && (
              <>
                <button onClick={removeBlog}>Delete</button>
              </>
            )}
          </>
        )}
      </li>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
}

export default Blog
