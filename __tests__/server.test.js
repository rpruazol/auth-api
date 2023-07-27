'use strict'

const {server} = require('../src/server')


const supertest = require('supertest');
const { db } = require('../src/models');

const app = supertest(server);

beforeAll(async (done) => {
  await db.sync({force:true});
  done();
})

afterAll(async (done) => {
  await db.drop();
  done();
})



describe('basic server functionality', () => {
  const user = {
    username: 'ray',
    password: 'HeLLOw0rLd!'
  }
  test('create a new user via the /signup route', async () => {
    const res = await app.post('/signup').send(user);
    expect(res.status).toEqual(201);
  });
  test('login with new user via the /signin route', async () => {
    const res = await app.post('/signin').auth(user.username, user.password);
    expect(res.status).toEqual(200);
  });
})