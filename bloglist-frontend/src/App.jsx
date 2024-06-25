import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const k = 12;
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")
  const [error, setErrorMessage] = useState(null)
  const [update, setUpdate] = useState(false)
  const [errorColor, setErrorcolor] = useState("")

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
      setErrorcolor("green")
      setErrorMessage(`logged in succesfully`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorcolor("red")
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('loggeduser');

  }

  const AddBlog = async (event) => {
    try {
      event.preventDefault()
      console.log("sda")
      await blogService.addBlog({
        title, author, url
      })
      setErrorcolor("green")
      setErrorMessage(`new blog ${title} by ${author} added`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setAuthor("")
      setTitle("")
      setUrl("")
      setUpdate(true)
      
    }
    catch(error) {
      console.log(error)
      setErrorcolor("red")
      setErrorMessage(`error while adding blog`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    
  }


  const loginForm = () => (
    <div>
      <div style={{ color: errorColor, borderColor: errorColor, borderWidth: 2,}}>
        {error}
      </div>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form> 
    </div>    
  )

  const CreateNew = () => (
    <div>
      <h2>create new</h2>
      <form onSubmit={AddBlog}>
        <div>
          title: <input type="text" value={title} 
          onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author: <input type="text" value={author}
          onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url: <input type="text" value={url}
          onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type='submit'>create</button>
      </form>
      
    </div>
  )

  const Blogs = () => (
    <div>
      
      <h2>blogs</h2>
      <div style={{ color: errorColor, borderColor: errorColor, borderWidth: 2,}}>
        {error}
      </div>
      {user.name} logged in
      <button onClick={handleLogout}>logout</button>
      {CreateNew()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      
    </div>  
  )

  return (
    <div>
      {!user && loginForm()}
      {user && Blogs()}
      
    </div>
  )
}

export default App