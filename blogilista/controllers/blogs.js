const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { json } = require('express')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) {
    
    response.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  try {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    const result = await blog.save();
    response.status(201).json(result);
  } catch (error) {
    
    response.status(500).json({ error: 'Failed to create blog' });
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id;
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return response.status(404).json({ error: 'Blog not found' });
    }
    response.status(204).end();
  } catch (error) {
    
    response.status(500).json({ error: 'Failed to delete blog' });
  }
});

blogsRouter.put('/:id', async (request, response) => {
  const { id } = request.params;  // Poimi id reitin parametreistä

  try {
    const likedBlog = await Blog.findById(id);  // Käytä id:tä suoraan
    if (!likedBlog) {
      return response.status(404).json({ error: 'Blog not found' });
    }

    likedBlog.likes += 1;  // Lisää tykkäykset

    const updatedBlog = await likedBlog.save();  // Tallenna muutokset
    response.json(updatedBlog);  // Palauta päivitetty blogi
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Failed to update likes' });
  }
});


  module.exports = blogsRouter;