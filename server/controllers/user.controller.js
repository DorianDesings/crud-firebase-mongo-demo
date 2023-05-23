const UserModel = require('../schemas/user-schema');

const controller = {};

controller.getAllUsers = async (req, res) => {
  const allUsers = await UserModel.find();

  if (allUsers.length === 0) return res.send([]);

  res.send(allUsers);
};

// Obtener un usuario por id
controller.userById = async (req, res) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) return res.status(404).send({ error: 'Usuario no encontrado' });
  res.send(user);
};

// Crear un usuario nuevo
controller.createUser = async (req, res) => {
  let allUsers = await UserModel.find();

  const userExist = allUsers.some(user => user.email === req.body.email);

  if (userExist)
    return res
      .status(409)
      .send({ error: 'Ya existe un usuario con ese email' });

  const newUser = new UserModel({
    _id: req.body._id,
    username: req.body.username,
    email: req.body.email,
    books: []
  });

  const userCreated = await newUser.save();

  console.log(userCreated);

  res.send(userCreated);
};

controller.updateUser = async (req, res) => {
  console.log(req.params.id);
  const userUpdated = await UserModel.updateOne(
    { _id: req.params.id },
    { $set: { ...req.body } }
  );
  console.log(userUpdated);
  res.send(userUpdated);
};

module.exports = controller;
