'use strict'

const {server} = require('../src/server')
require('dotenv').config();

const supertest = require('supertest');
const { db } = require('../src/models/index.js');

const app = supertest(server);

beforeAll(async (done) => {
  await db.sync({force:true});
  done();
})

afterAll(async (done) => {
  await db.drop({});
  db.close();
  done();
})



describe('basic server functionality', () => {
  const user = {
    username: 'ray',
    password: 'HeLLOw0rLd!'
  }
  const admin = {
    username: 'millie',
    password: 'catzRul3!',
    role: 'admin'
  }

  test('create a new user via the /signup route', async () => {
    const res = await app.post('/signup').send(user);
    
    expect(res.status).toEqual(201);
  });
  test('login with new user via the /signin route', async () => {
    const res = await app.post('/signin').auth(user.username, user.password);
    expect(res.status).toEqual(200);
  });

  test('the /secret route works only with a bearer token', async () => {
    const signin = await app.post('/signin').auth(user.username, user.password);
    const res = await app.get('/secret').set('Authorization', `Bearer ${signin.body.token}`);
    expect(res.status).toEqual(200);
  })
  test('the /users route works only with a bearer token', async () => {
    await app.post('/signup').send(admin);
    const signin = await app.post('/signin').auth(admin.username, admin.password);
    const res = await app.get('/users').set('Authorization', `Bearer ${signin.body.token}`);
    expect(res.status).toEqual(200);
  })
})