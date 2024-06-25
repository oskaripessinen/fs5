const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const Blog = require('../models/blog')

const api = supertest(app)

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('static bloglist', () => {
    const blogs = [
        {
          _id: "5a422a851b54a676234d17f7",
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
          likes: 7,
          __v: 0
        },
        {
          _id: "5a422aa71b54a676234d17f8",
          title: "Go To Statement Considered Harmful",
          author: "Edsger W. Dijkstra",
          url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
          likes: 5,
          __v: 0
        },
        {
          _id: "5a422b3a1b54a676234d17f9",
          title: "Canonical string reduction",
          author: "Edsger W. Dijkstra",
          url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
          likes: 12,
          __v: 0
        },
        {
          _id: "5a422b891b54a676234d17fa",
          title: "First class tests",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
          likes: 10,
          __v: 0
        },
        {
          _id: "5a422ba71b54a676234d17fb",
          title: "TDD harms architecture",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
          likes: 0,
          __v: 0
        },
        {
          _id: "5a422bc61b54a676234d17fc",
          title: "Type wars",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
          likes: 2,
          __v: 0
        }  
      ]
  
    test('total likes', () => {
      const result = listHelper.totalLikes(blogs)
      assert.strictEqual(result, 36)
    })

    test('favorite blog', () => {
      const result = listHelper.favoriteBlog(blogs)
      assert.strictEqual(result, blogs[2])
    })
  })




beforeEach(async () => {
  await Blog.deleteMany({});

  const initialBlogs = [
    { title: '1. blog', author: 'Author1', url: 'http://example.com/1', likes: 1 },
    { title: '2. blog', author: 'Author2', url: 'http://example.com/2', likes: 2 },
    
  ];

  await Blog.insertMany(initialBlogs);
});




describe('Blog API tests', () => {

  test('number of blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

      const blogs = response.body

      assert.strictEqual(blogs.length, 2)

      blogs.forEach(blog => {
        assert.strictEqual(typeof blog.id, 'string');
        assert.strictEqual(blog._id, undefined);
      })
  })



  
  
  
 test('add blog', async () => {
    const newBlog = {
      title: 'Third blog',
      author: 'Author3',
      url: 'http://example.com/3',
      likes: 3,
    };
  
    const response = await api
      .post('/api/blogs')
      .send(newBlog);
  
    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.type, 'application/json');
  
    const blogsAfterPost = await Blog.find({});
    assert.strictEqual(blogsAfterPost.length, 3);
  
    const titles = blogsAfterPost.map(blog => blog.title);
    assert.ok(titles.includes('Third blog')); 
  
  });

  test('DELETE a blog', async () => {
    const blogsAtStart = await Blog.find({});
    const blogToDelete = blogsAtStart[0];
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);
  
    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
  
    const titles = blogsAtEnd.map(blog => blog.title);
    assert.ok(!titles.includes(blogToDelete.title));
  });

  

  after(async () => {
    await mongoose.connection.close()
  })

})


