module.exports = (app) => {
  const save = account => app.db('accounts').insert(account, '*');
  const findAll = () => app.db('accounts').select();
  const findById = (filter = {}) => app.db('accounts').where(filter).first();
  const update = (id, account) => app.db('accounts')
    .where({ id })
    .update(account, '*');

  return {
    save, findAll, findById, update,
  };
};
