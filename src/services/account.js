module.exports = (app) => {
  const save = account => app.db('accounts').insert(account, '*');
  return { save };
};
