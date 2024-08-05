import React from 'react'
import PropTypes from 'prop-types'


const AddBlogForm = ({ addBlog, setTitle, setAuthor, setUrl, title, author, url }) => {


  
  const handleSubmit = (event) => {
    event.preventDefault()
    addBlog(title, author, url);
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
        title: <input data-testid='title' type="text" value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author: <input data-testid='author' type="text" value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          url: <input data-testid='url' type="text" value={url} onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button data-testid='addBlog' type="submit">create</button>
      </form>
    </div>
  )
}

AddBlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
  setAuthor: PropTypes.func.isRequired,
  setUrl: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};


export default AddBlogForm
