module.exports = (app) => {
  const save = async (account) => {
    if (!account.name) return { error: 'Nome é um atributo obrigatório.' };
    return app.db('accounts').insert(account, '*');
  };
  const findAll = () => app.db('accounts').select();
  const findById = (filter = {}) => app.db('accounts').where(filter).first();
  const update = (id, account) => app.db('accounts')
    .where({ id })
    .update(account, '*');
  const remove = id => app.db('accounts')
    .where({ id })
    .del();

  return {
    save, findAll, findById, update, remove,
  };
};
