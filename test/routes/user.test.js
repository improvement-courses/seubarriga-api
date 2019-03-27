const request = require('supertest');
const app = require('../../src/app');

const email = `${Date.now()}@gmail.com`;

test('Deve listar todos os usuários', () => request(app).get('/users')
  .then((res) => {
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  }));

test('Deve inserir usuário com sucesso', () => request(app).post('/users')
  .send({ name: 'Williams Gomes', email, password: '123456' })
  .then((res) => {
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Williams Gomes');
  }));

test('Não deve inserir usuário sem nome', () => request(app).post('/users')
  .send({ email, password: '123456' })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Nome é um atributo obrigatório.');
  }));

test('Não deve inserir usuário sem enail', async () => {
  const result = await request(app).post('/users')
    .send({ name: 'Williams Silva', password: '123456' });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Email é um atributo obrigatório.');
});

test('Não deve inserir usuário sem senha', (done) => {
  request(app).post('/users')
    .send({ name: 'Williams Silva', email })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Senha é um atributo obrigatório.');
      done();
    });
});
