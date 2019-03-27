const request = require('supertest');
const app = require('../../src/app');

const MAIN_ROUTE = '/accounts';
const email = `${Date.now()}@gmail.com`;
let user;

beforeAll(async () => {
  const res = await app.services.user.save({ name: 'User Account', email, password: '123456' });
  user = { ...res[0] };
});

test('Deve inserir conta com sucesso', () => request(app).post(MAIN_ROUTE)
  .send({ name: 'Acc 1', user_id: user.id })
  .then((result) => {
    expect(result.status).toBe(201);
    expect(result.body.name).toBe('Acc 1');
  }));
