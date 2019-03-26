module.exports = () => {
  const findAll = (req, res) => {
    const users = [
      { name: 'John Doe', email: 'john.doe@gmail.com' },
    ];
    res.status(200).send(users);
  };
  const create = (req, res) => {
    res.status(201).json(req.body);
  };

  return { findAll, create };
};
