const request = require('supertest');
const app = require('../../src/app');

test('Deve criar usuário usando signup', () => request(app).post('/auth/signup')
  .send({ name: 'Williams', email: `${Date.now()}@gmail.com`, password: '123456' })
  .then((res) => {
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Williams');
    expect(res.body).toHaveProperty('email');
    expect(res.body).not.toHaveProperty('password');
  }));

test('Deve receber token ao logar', () => {
  const email = `${Date.now()}@gmail.com`;
  const user = { name: 'Williams Gomes Silva', email, password: '123456' };
  return app.services.user.save(user)
    .then(() => request(app).post('/auth/signin')
      .send({ email, password: '123456' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
});

test('Não deve autenticar usuário com senha errada', () => {
  const email = `${Date.now()}@gmail.com`;
  const user = { name: 'Williams Barriquero Gomes Silva', email, password: '123456' };
  return app.services.user.save(user)
    .then(() => request(app).post('/auth/signin')
      .send({ email, password: '123465' }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Usuário ou senha inválidos');
    });
});

test('Não deve autenticar usuário que não existe', () => request(app).post('/auth/signin')
  .send({ email: 'nao.existe@gmail.com', password: '123465' })
  .then((res) => {
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Usuário ou senha inválidos');
  }));

test('Não deve acessar uma rota protegida sem token', () => request(app).get('/v1/users')
  .then((resp) => {
    expect(resp.status).toBe(401);
  }));
