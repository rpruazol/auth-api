'use strict'

const {server} = require('../src/server')
require('dotenv').config();

const supertest = require('supertest');
const { db } = require('../src/models/index.js');

const app = supertest(server);

const admin = {
  username: 'millie',
  password: 'catzRul3!',
  role: 'admin'
}

let token = null;

beforeAll(async (done) => {
  await db.sync({force:true});
  await app.post('/signup').send(admin);
  const response = await app.post('/signin').auth(admin.username,admin.password);
  token = response.body.token
  console.log('token @ start', token)

  done();
})

afterAll(async (done) => {
  await db.drop({});
  db.close();
  done();
})





describe('v2 AUTHENTICATED API routes', () => {

  const clothes = {
    name: 'pants',
    color: 'macaroni and cheese',
    size: '34'
  }
  
  
  test('/:model POST route', async () => {
    // const signin = await app.post('/signin').auth(admin.username,admin.password);
    const res = await app.post('/api/v2/clothes')
    .set('Authorization', `Bearer ${token}`)
    .send(clothes)
    expect(res.status).toEqual(201)
  });

  // test('/:model GET all route', async () => {
  //   const res = await app.get('/api/v2/clothes');
  //   expect(res.status).toEqual(200)
  //   expect(res.text).toEqual
  // });

  // test('/:model/:id GET one route', async () => {
  //   const res = await app.get('/food/1');
  //   expect(res.status).toEqual(200)
  // });

  // test('/:model/:id PUT route', async () => {
  //   const res = await app.put('/food/1').send({calories: 120});
  //   expect(JSON.parse(res.text).calories).toEqual(120);
  // });

  // test('/:model/:id DELETE route', async () => {
  //   const res = await app.delete('/food/1').send(fruit);
  //   expect(res.status).toEqual(200);
  // });

})