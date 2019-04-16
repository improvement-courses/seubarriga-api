module.exports = {
  test: {
    client: 'pg',
    version: '10',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: '9655',
      database: 'barriga',
    },
    migrations: {
      directory: 'src/migrations',
    },
    seeds: {
      directory: 'src/seeds',
    },
  },
};
