
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { info, error } = require('./utils/logger')




mongoose.set('strictQuery', false)
const config = require('./utils/config')


const url = config.MONGODB_URI;


console.log('connecting to', url)
mongoose.connect(url)

  .then(result => {
    info('connected to MongoDB')
  })
  .catch((error) => {
    error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
console.log("Sdaa")
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'test ') {
  console.log("sdad")
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

module.exports = app