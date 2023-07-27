'use strict'

const {server} = require('../src/server')
require('dotenv').config();

const supertest = require('supertest');
const { db } = require('../src/models/index.js');
const { extractExpectedAssertionsErrors } = require('expect');
const { expect } = require('@jest/globals');

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


describe('v1 unauthenticated API routes', () => {
  const fruit = {
    name: 'kiwi',
    calories: 80,
    type: 'fruit'
  }
  test('/:model POST route', async () => {
    const res = await app.post('/food').send(fruit);
    expect(res.status).toEqual(201)
  });

  test('/:model GET all route', async () => {
    const res = await app.get('/food');
    expect(res.status).toEqual(200)
  });

  test('/:model/:id GET one route', async () => {
    const res = await app.get('/food/1');
    expect(res.status).toEqual(200)
  });

  test('/:model/:id PUT route', async () => {
    const res = await app.put('/food/1').send({calories: 120});
    expect(JSON.parse(res.text).calories).toEqual(120);
  });

  test('/:model/:id DELETE route', async () => {
    const res = await app.delete('/food/1').send(fruit);
    expect(res.status).toEqual(200);
  });

})