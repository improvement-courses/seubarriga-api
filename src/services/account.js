module.exports = (app) => {
  const save = account => app.db('accounts').insert(account, '*');
  const findAll = () => app.db('accounts').select();
  const findById = (filter = {}) => app.db('accounts').where(filter).first();
  return { save, findAll, findById };
};
