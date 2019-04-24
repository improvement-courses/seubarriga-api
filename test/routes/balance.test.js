const request = require('supertest');
const moment = require('moment');

const app = require('../../src/app');

const MAIN_ROUTE = '/v1/balance';
const ROUTE_TRANSACTION = '/v1/transactions';
const ROUTE_TRANSFER = '/v1/transfers';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxMDAsIm5hbWUiOiJVc2VyICMzIiwiZW1haWwiOiJ1c2VyM0BnbWFpbC5jb20ifQ.kV_Uo2HKKnq-rJhAuRy2_vkX3fHmBLHHLMhlN-aUJbw';
const TOKEN_GERAL = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAxMDIsIm5hbWUiOiJVc2VyICM1IiwiZW1haWwiOiJ1c2VyNUBnbWFpbC5jb20ifQ.8SaTFqxukVtQSfCiSj6qgTXvVjheFq7-7xRQ2dYFDEQ';

beforeAll(async () => {
  await app.db.seed.run();
});

describe('Ao calcular o saldo do usuário...', () => {
  test('Deve retornar apenas as contas com alguma transação', () => request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${TOKEN}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    }));

  test('Deve adicionar valores de entrada', () => request(app).post(ROUTE_TRANSACTION)
    .send({
      description: '1',
      date: new Date(),
      ammount: 100,
      type: 'I',
      acc_id: 10100,
      status: true,
    })
    .set('authorization', `bearer ${TOKEN}`)
    .then(() => request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toBe(10100);
        expect(res.body[0].sum).toBe('100.00');
      })));

  test('Deve subtrair valores de saída', () => request(app).post(ROUTE_TRANSACTION)
    .send({
      description: '1',
      date: new Date(),
      ammount: 200,
      type: 'O',
      acc_id: 10100,
      status: true,
    })
    .set('authorization', `bearer ${TOKEN}`)
    .then(() => request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toBe(10100);
        expect(res.body[0].sum).toBe('-100.00');
      })));

  test('Não deve considerar transações pendentes', () => request(app).post(ROUTE_TRANSACTION)
    .send({
      description: '1',
      date: new Date(),
      ammount: 200,
      type: 'O',
      acc_id: 10100,
      status: false,
    })
    .set('authorization', `bearer ${TOKEN}`)
    .then(() => request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toBe(10100);
        expect(res.body[0].sum).toBe('-100.00');
      })));

  test('Não deve considerar saldos de contas distintas', () => request(app).post(ROUTE_TRANSACTION)
    .send({
      description: '1',
      date: new Date(),
      ammount: 50,
      type: 'I',
      acc_id: 10101,
      status: true,
    })
    .set('authorization', `bearer ${TOKEN}`)
    .then(() => request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].id).toBe(10100);
        expect(res.body[0].sum).toBe('-100.00');
        expect(res.body[1].id).toBe(10101);
        expect(res.body[1].sum).toBe('50.00');
      })));

  test('Não deve considerar saldos de contas de outros usuários', () => request(app).post(ROUTE_TRANSACTION)
    .send({
      description: '1',
      date: new Date(),
      ammount: 200,
      type: 'O',
      acc_id: 10102,
      status: true,
    })
    .set('authorization', `bearer ${TOKEN}`)
    .then(() => request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].id).toBe(10100);
        expect(res.body[0].sum).toBe('-100.00');
        expect(res.body[1].id).toBe(10101);
        expect(res.body[1].sum).toBe('50.00');
      })));

  test('Deve considerar transação passada', () => request(app).post(ROUTE_TRANSACTION)
    .send({
      description: '1',
      date: moment().subtract({ days: 5 }),
      ammount: 250,
      type: 'I',
      acc_id: 10100,
      status: true,
    })
    .set('authorization', `bearer ${TOKEN}`)
    .then(() => request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].id).toBe(10100);
        expect(res.body[0].sum).toBe('150.00');
        expect(res.body[1].id).toBe(10101);
        expect(res.body[1].sum).toBe('50.00');
      })));

  test('Não deve considerar transações futuras', () => request(app).post(ROUTE_TRANSACTION)
    .send({
      description: '1',
      date: moment().add({ days: 5 }),
      ammount: 250,
      type: 'I',
      acc_id: 10100,
      status: true,
    })
    .set('authorization', `bearer ${TOKEN}`)
    .then(() => request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].id).toBe(10100);
        expect(res.body[0].sum).toBe('150.00');
        expect(res.body[1].id).toBe(10101);
        expect(res.body[1].sum).toBe('50.00');
      })));

  test('Deve considerar transferências', () => request(app).post(ROUTE_TRANSFER)
    .send({
      description: '1',
      date: new Date(),
      ammount: 250,
      acc_ori_id: 10100,
      acc_dest_id: 10101,
    })
    .set('authorization', `bearer ${TOKEN}`)
    .then(() => request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].id).toBe(10100);
        expect(res.body[0].sum).toBe('-100.00');
        expect(res.body[1].id).toBe(10101);
        expect(res.body[1].sum).toBe('300.00');
      })));
});

test('Deve calcular saldo das contas do usuário', () => request(app).get(MAIN_ROUTE)
  .set('authorization', `bearer ${TOKEN_GERAL}`)
  .then((res) => {
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].id).toBe(10104);
    expect(res.body[0].sum).toBe('162.00');
    expect(res.body[1].id).toBe(10105);
    expect(res.body[1].sum).toBe('-248.00');
  }));
