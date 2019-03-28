const request = require('supertest');
const app = require('../../src/app');

const email = `${Date.now()}@gmail.com`;
const user = { name: 'Williams Gomes Silva', email, password: '123456' };

test('Deve receber token ao logar', () => app.services.user.save(user)
  .then(() => request(app).post('/auth/signin')
    .send({ email, password: '123456' }))
  .then((res) => {
    expect(res.status).toBe(200);
    console.log(res.body);
    expect(res.body).toHaveProperty('token');
  }));
