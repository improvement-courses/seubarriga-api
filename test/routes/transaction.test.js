const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/transactions';
let user;
let user2;
let accUser;
let accUser2;

beforeAll(async () => {
  await app.db('transactions').del();
  await app.db('accounts').del();
  await app.db('users').del();
  const users = await app.db('users').insert([
    { name: 'User #1', email: 'user1@gmail.com', password: '$2a$10$pWmfJrjmKsEAxA8XZC5Olu3/TMliWGeTo6z5ETQj6Jx9fDMeGmzbi' },
    { name: 'User #2', email: 'user2@gmail.com', password: '$2a$10$pWmfJrjmKsEAxA8XZC5Olu3/TMliWGeTo6z5ETQj6Jx9fDMeGmzbi' },
  ], '*');
  [user, user2] = users;
  delete user.password;
  user.token = jwt.encode(user, 'Secreto!');
  const accs = await app.db('accounts').insert([
    { name: 'Acc User #1', user_id: user.id },
    { name: 'Acc User #2', user_id: user2.id },
  ], '*');
  [accUser, accUser2] = accs;
});

test('deve listar apenas as transações o usuáio', () => app.db('transactions')
  .insert([
    {
      description: 't1', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id,
    },
    {
      description: 't2', date: new Date(), ammount: 100, type: 'I', acc_id: accUser2.id,
    }])
  .then(() => request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].description).toBe('t1');
    })));
