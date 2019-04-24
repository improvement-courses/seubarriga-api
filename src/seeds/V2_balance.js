const moment = require('moment');

exports.seed = knex => knex('users')
  .insert([
    {
      id: 10100,
      name: 'User #3',
      email: 'user3@gmail.com',
      password: '$2a$10$pWmfJrjmKsEAxA8XZC5Olu3/TMliWGeTo6z5ETQj6Jx9fDMeGmzbi',
    },
    {
      id: 10101,
      name: 'User #4',
      email: 'user4@gmail.com',
      password: '$2a$10$pWmfJrjmKsEAxA8XZC5Olu3/TMliWGeTo6z5ETQj6Jx9fDMeGmzbi',
    },
    {
      id: 10102,
      name: 'User #5',
      email: 'user5@gmail.com',
      password: '$2a$10$pWmfJrjmKsEAxA8XZC5Olu3/TMliWGeTo6z5ETQj6Jx9fDMeGmzbi',
    },
  ]).then(() => knex('accounts')
    .insert([
      { id: 10100, name: 'Acc Saldo principal', user_id: 10100 },
      { id: 10101, name: 'Acc Saldo secundário', user_id: 10100 },
      { id: 10102, name: 'Acc Alternativa #1', user_id: 10101 },
      { id: 10103, name: 'Acc Alternativa #2', user_id: 10101 },
      { id: 10104, name: 'Acc Geral Principal', user_id: 10102 },
      { id: 10105, name: 'Acc Geral Secundária', user_id: 10102 },
    ]))
  .then(() => knex('transfers')
    .insert([
      {
        id: 10100,
        description: 'Transfer #1',
        user_id: 10000,
        acc_ori_id: 10105,
        acc_dest_id: 10104,
        date: new Date(),
        ammount: 256,
      },
      {
        id: 10101,
        description: 'Transfer #2',
        user_id: 10101,
        acc_ori_id: 10102,
        acc_dest_id: 10103,
        date: new Date(),
        ammount: 512,
      },
    ]))
  .then(() => knex('transactions')
    .insert([
      // Transação positiva / Saldo = 2
      {
        description: '2',
        date: new Date(),
        ammount: 2,
        type: 'I',
        acc_id: 10104,
        status: true,
      },
      // Transação usuário errado / Saldo = 2
      {
        description: '2',
        date: new Date(),
        ammount: 4,
        type: 'I',
        acc_id: 10102,
        status: true,
      },
      // Transação outra conta / Saldo = 2 / Saldo = 8
      {
        description: '2',
        date: new Date(),
        ammount: 8,
        type: 'I',
        acc_id: 10105,
        status: true,
      },
      // Transação pendente / Saldo = 2 / Saldo = 8
      {
        description: '2',
        date: new Date(),
        ammount: 16,
        type: 'I',
        acc_id: 10104,
        status: false,
      },
      // Transação passada / Saldo = 34 / Saldo = 8
      {
        description: '2',
        date: moment().subtract({ days: 5 }),
        ammount: 32,
        type: 'I',
        acc_id: 10104,
        status: true,
      },
      // Transação futura / Saldo = 34 / Saldo = 8
      {
        description: '2',
        date: moment().add({ days: 5 }),
        ammount: 64,
        type: 'I',
        acc_id: 10104,
        status: true,
      },
      // Transação negativa / Saldo = -94 / Saldo = 8
      {
        description: '2',
        date: moment(),
        ammount: -128,
        type: 'O',
        acc_id: 10104,
        status: true,
      },
      // Trans / Saldo = 162 / Saldo = -248
      {
        description: '2',
        date: moment(),
        ammount: 256,
        type: 'I',
        acc_id: 10104,
        status: true,
      },
      {
        description: '2',
        date: moment(),
        ammount: -256,
        type: 'I',
        acc_id: 10105,
        status: true,
      },
      // Trans / Saldo = 162 / Saldo = -248
      {
        description: '2',
        date: moment(),
        ammount: 512,
        type: 'I',
        acc_id: 10103,
        status: true,
      },
      {
        description: '2',
        date: moment(),
        ammount: -512,
        type: 'I',
        acc_id: 10102,
        status: true,
      },
    ]));
