module.exports = {
  test: {
    client: 'pg',
    version: '11.2',
    connection: {
      host: 'localhost',
      user: 'williamsgomes',
      password: '9655',
      database: 'barriga',
    },
    migrations: {
      directory: 'src/migrations',
    },
  },
};
