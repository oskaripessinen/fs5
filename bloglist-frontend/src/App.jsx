import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import AddBlogForm from './components/addBlogForm'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [error, setErrorMessage] = useState(null)
  const [update, setUpdate] = useState(false)
  const [errorColor, setErrorcolor] = useState('')
  const [createVis, setCreateVis] = useState(false)
  const [visibleBlogInfo, setVisibleBlogInfo] = useState({})

  const toggleVisibility = (id) => {
    setVisibleBlogInfo({
      ...visibleBlogInfo,
      [id]: !visibleBlogInfo[id]
    })
  }

  const addLike = async (id) => {
    console.log('dsad')
    try {
      const updatedBlog = await blogService.likeBlog(id)

      console.log('Blog updated:', updatedBlog)
      setUpdate(true)
    } catch (error) {
      console.error('Failed to add like:', error)
    }

  }

  const addBlog = async (title, author, url
  ) => {
    try {
      await blogService.addBlog({
        title, author, url
      })
      setErrorcolor('green')
      setErrorMessage(`new blog ${title} by ${author} added`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setAuthor('')
      setTitle('')
      setUrl('')
      setUpdate(true)
    } catch (error) {
      console.log(error)
      setErrorcolor('red')
      setErrorMessage('error while adding blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )

    )
    setUpdate(false)
  }, [update])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggeduser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)


    }

  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      window.localStorage.setItem('loggeduser', JSON.stringify(user))
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)
      setErrorcolor('green')
      setErrorMessage('logged in succesfully')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      console.log(exception)
      setErrorcolor('red')
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggeduser')

  }




  const loginForm = () => (
    <div data-testid='login-form'>
      <div style={{ color: errorColor, borderColor: errorColor, borderWidth: 2, }}>
        {error}
      </div>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            data-testid='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            data-testid='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button data-testid='loginB' type="submit">login</button>
      </form>
    </div>
  )


  const Blogs = () => {

    const sortedBlogs = blogs.slice().sort((a, b) => b.likes - a.likes)

    return(
      <div data-testid='blogs'>

        <h2>blogs</h2>
        <div role='errorMes' style={{ color: errorColor, borderColor: errorColor, borderWidth: 2, }}>
          {error}
        </div>
        {user.name} logged in
        <button data-testid='logoutB' onClick={handleLogout}>logout</button>
        <div/>
        {!createVis && <button data-testid='newBlog' onClick={() => setCreateVis(!createVis) }>new blog</button>}
        {createVis && <AddBlogForm addBlog={addBlog} setTitle={setTitle} setAuthor={setAuthor} setUrl={setUrl} title={title} author={author} url={url}/>}
        {createVis && <button onClick={() => setCreateVis(!createVis) }>cancel</button>}
        <div>
        {sortedBlogs.map((blog) =>
        <div>
          <Blog key={blog.id} blog={blog} isVisible={visibleBlogInfo[blog.id]}  toggleVisibility={() => toggleVisibility(blog.id)} handleLike={() => addLike(blog.id)} user={user} setUpdate={setUpdate}/>
        </div>
        )}
        </div>

      </div>
    )
  }

  return (
    <div>
      {!user && loginForm()}
      {user && Blogs()}

    </div>
  )
}

export default App