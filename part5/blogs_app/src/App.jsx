import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [sortLikes, setSortlikes] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((initialBlogs) => {
      setBlogs(initialBlogs)
    })
  }, [message])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogData) => {
    blogService
      .create(blogData)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog))
      })
      .then(() => {
        blogFormRef.current.toggleVisibility()
        setMessage(`A new blog: '${blogData.title}' is added by: '${user.name}'`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const addLike = (id) => {
    const blog = blogs.find((n) => n.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    blogService
      .update(id, changedBlog)
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)))
      })
      .catch((error) => {
        setError(`Blog '${blog.title}' was already removed from server`)
        setTimeout(() => {
          setError(null)
        }, 5000)
      })
  }

  const removeBlog = (id) => {
    const blog = blogs.find((n) => n.id === id)
    window.confirm(`Are you sure you want to remove '${blog.title}'?`)

    blogService
      .remove(id)
      .then(() => {
        setBlogs(blogs.filter((blog) => blog.id !== id))
      })
      .catch((error) => {
        setError(`Blog '${blog.title}' was removed from server`)
        setTimeout(() => {
          setError(null)
        }, 5000)
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setError('Wrong username or password')
      console.log('Wrong credentials')
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>Log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const blogForm = () => (
    <Togglable buttonLabel='New Blog' ref={blogFormRef}>
      <BlogForm
        createBlog={addBlog}
        setMessage={setMessage}
        user={user}
        blogFormRef={blogFormRef}
      />
    </Togglable>
  )

  const blogsToShow = sortLikes
    ? [...blogs].sort((a, b) => b.likes - a.likes)
    : blogs

  return (
    <div>
      <h1>Blogs</h1>

      <Notification message={message} error={error} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button
            id='Logout'
            onClick={() => {
              setUser(null)
              window.localStorage.removeItem('loggedBlogappUser')
            }}
          >
            Log out
          </button>
          {blogForm()}
        </div>
      )}
      <div>
        <button onClick={() => setSortlikes(!sortLikes)}>
          {!sortLikes ? 'Sort by likes' : 'Sort by when added'}
        </button>
      </div>
      <ul>
        {blogsToShow.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            addLike={() => addLike(blog.id)}
            removeBlog={() => removeBlog(blog.id)}
          />
        ))}
      </ul>
    </div>
  )
}

export default App
