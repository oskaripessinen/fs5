
import blogService from '../services/blogs'


const Blog = ({ blog, isVisible, toggleVisibility, handleLike, user, setUpdate }) => {

  const removeBlog = async (blog) => {
    const userConfirmed = window.confirm('remove blog ' + blog.title + " by " + blog.author)

    if(userConfirmed) {
      try {
        const removedBlog = await blogService.removeBlog(blog.id)

        setUpdate(true)
      } catch (error) {
        console.error('Failed to remove:', error)
      }
    }

  }

  return(
    <div style={{ borderWidth: 0.5, borderColor: 'grey', margin: 5, border: 'solid' }}>
      <div data-testid={blog.title}>{blog.title}</div>
      <div> {blog.author}</div>
      {isVisible && (
        <div>
          <div>{blog.url}</div>
          <div>likes: {blog.likes}<button data-testid='likeB' onClick={handleLike}>like</button></div>
          <div>{blog.user.name}</div>

        </div>
      )}
      <button data-testid={blog.author} onClick={toggleVisibility}>{!isVisible ? 'view' : 'hide'}</button>

      <div></div>
      {user && user.name === blog.user.name && (<button data-testid='removeBlog' onClick={() => removeBlog(blog)}>remove</button>)}
    </div>
  )
}





export default Blog