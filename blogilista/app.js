
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
const notesRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
app.use('/api/blogs', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

module.exports = app