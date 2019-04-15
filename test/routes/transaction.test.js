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

test('Deve listar apenas as transações do usuário', () => app.db('transactions')
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

test('Deve inserir transação com sucesso', () => request(app).post(MAIN_ROUTE)
  .set('authorization', `bearer ${user.token}`)
  .send({
    description: 'New T', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id,
  })
  .then((res) => {
    expect(res.status).toBe(201);
    expect(res.body.acc_id).toBe(accUser.id);
  }));

test('Deve retornar uma transação por ID', () => app.db('transactions').insert(
  {
    description: 'T ID', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id,
  }, ['id'],
).then(trans => request(app).get(`${MAIN_ROUTE}/${trans[0].id}`)
  .set('authorization', `bearer ${user.token}`)
  .then((res) => {
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(trans[0].id);
    expect(res.body.description).toBe('T ID');
  })));

test('Deve alterar uma transação por ID', () => app.db('transactions').insert(
  {
    description: 'To Update', date: new Date(), ammount: 100, type: 'I', acc_id: accUser.id,
  }, ['id'],
).then(trans => request(app).put(`${MAIN_ROUTE}/${trans[0].id}`)
  .set('authorization', `bearer ${user.token}`)
  .send({ description: 'Trans Update' })
  .then((res) => {
    expect(res.status).toBe(200);
    expect(res.body.description).toBe('Trans Update');
  })));