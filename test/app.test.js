const request = require('supertest');

const app = require('../src/app');

test('Deve responder na raiz', () => request(app).get('/')
  .then((res) => {
    console.log(process.env.NODE_ENV);
    expect(res.status).toBe(200);
  }));
