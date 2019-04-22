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
  ]).then(() => knex('accounts')
    .insert([
      { id: 10100, name: 'Acc Saldo principal', user_id: 10100 },
      { id: 10101, name: 'Acc Saldo secundário', user_id: 10100 },
      { id: 10102, name: 'Acc Alternativa #1', user_id: 10101 },
      { id: 10103, name: 'Acc Alternativa #2', user_id: 10101 },
    ]));
