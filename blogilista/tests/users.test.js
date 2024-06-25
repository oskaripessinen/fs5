const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const User = require('../models/user');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', passwordHash });

  await user.save();
});

test('creation succeeds with a fresh username', async () => {
  const usersAtStart = await User.find({});

  const newUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen',
  };

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const usersAtEnd = await User.find({});
  expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

  const usernames = usersAtEnd.map(u => u.username);
  expect(usernames).toContain(newUser.username);
});

test('creation fails if username is already taken', async () => {
  const usersAtStart = await User.find({});

  const newUser = {
    username: 'username',
    name: 'username',
    password: '1234',
  };

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  expect(result.body.error).toContain('expected `username` to be unique');

  const usersAtEnd = await User.find({});
  expect(usersAtEnd.length).toBe(usersAtStart.length);
});

test('creation fails if username is too short', async () => {
  const newUser = {
    username: '12',
    name: 'user12',
    password: 'salasana',
  };

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  expect(result.body.error).toContain('username must be at least 3 characters long');
});

test('creation fails if password is too short', async () => {
  const newUser = {
    username: 'user',
    name: 'username',
    password: '12',
  };

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  expect(result.body.error).toContain('password must be at least 3 characters long');
});

afterAll(() => {
  mongoose.connection.close();
});
