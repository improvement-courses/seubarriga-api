module.exports = (app) => {
  const save = account => app.db('accounts').insert(account, '*');
  const findAll = () => app.db('accounts').select();
  return { save, findAll };
};
