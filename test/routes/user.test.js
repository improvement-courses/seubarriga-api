const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const MAIN_ROUTE = '/v1/users';
const email = `${Date.now()}@gmail.com`;
let user;

beforeAll(async () => {
  const res = await app.services.user.save({ name: 'Viviane', email: `${Date.now()}@gmail.com`, password: '123456' });
  user = { ...res[0] };
  user.token = jwt.encode(user, 'Secreto!');
});

test('Deve listar todos os usuários', () => request(app).get(MAIN_ROUTE)
  .set('authorization', `bearer ${user.token}`)
  .then((res) => {
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  }));

test('Deve inserir usuário com sucesso', () => request(app).post(MAIN_ROUTE)
  .send({ name: 'Williams Gomes', email, password: '123456' })
  .set('authorization', `bearer ${user.token}`)
  .then((res) => {
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Williams Gomes');
    expect(res.body).not.toHaveProperty('password');
  }));

test('Deve armazenar senha criptografada', async () => {
  const res = await request(app).post(MAIN_ROUTE)
    .send({ name: 'Williams Gomes', email: `${Date.now()}@gmail.com`, password: '123456' })
    .set('authorization', `bearer ${user.token}`);
  expect(res.status).toBe(201);

  const { id } = res.body;
  const userDb = await app.services.user.findOne({ id });
  expect(userDb.password).not.toBeUndefined();
  expect(userDb.password).not.toBe('123456');
});

test('Não deve inserir usuário sem nome', () => request(app).post(MAIN_ROUTE)
  .send({ email, password: '123456' })
  .set('authorization', `bearer ${user.token}`)
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Nome é um atributo obrigatório.');
  }));

test('Não deve inserir usuário sem enail', async () => {
  const result = await request(app).post(MAIN_ROUTE)
    .send({ name: 'Williams Silva', password: '123456' })
    .set('authorization', `bearer ${user.token}`);
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Email é um atributo obrigatório.');
});

test('Não deve inserir usuário sem senha', (done) => {
  request(app).post(MAIN_ROUTE)
    .send({ name: 'Williams Silva', email })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Senha é um atributo obrigatório.');
      done();
    });
});

test('Não deve inserir usuário com email existente', () => request(app).post(MAIN_ROUTE)
  .send({ name: 'Williams Gomes', email, password: '123456' })
  .set('authorization', `bearer ${user.token}`)
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Já existe um usuário com esse email.');
  }));
