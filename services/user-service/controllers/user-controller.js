const User = require('../models/user');
const bcrypt = require('bcryptjs');
const saltRound = 10;

module.exports = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.find();
      res.status(200).json({ data: users, message: 'Success' });
    } catch (e) {
      next(e);
    }
  },

  getUserByEmail: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const foundUser = await User.findOne({ email });
      if (foundUser) {
        const compare = await bcrypt.compare(password, foundUser.password);
        if (compare) {
          res.status(200).json({
            data: foundUser,
            message: 'Success, Logged in successfully',
          });
        } else {
          res
            .status(401)
            .json({ data: null, message: 'Forbidden, Authorization failed' });
        }
      } else {
        res.status(401).json({
          data: null,
          message: 'No user found with provided credentials',
        });
      }
    } catch (e) {
      next(e);
    }
  },

  getUser: async (req, res, next) => {
    try {
      const id = req.params['id'];
      if (id) {
        const foundUser = await User.findById(id);
        res.status(200).json({ data: foundUser, message: 'Success' });
      } else {
        res
          .status(400)
          .json({ data: null, message: 'Bad Request, please provide user Id' });
      }
    } catch (e) {
      next(e);
    }
  },

  createUser: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const encryptedPass = await bcrypt.hash(
        password,
        await bcrypt.genSalt(saltRound)
      );
      const newUser = await User.create({
        name,
        email,
        password: encryptedPass,
      });
      res
        .status(201)
        .json({ data: newUser, message: 'User created successfully' });
    } catch (e) {
      next(e);
    }
  },

  udpateUser: async (req, res, next) => {
    try {
      const id = req.params['id'];
      if (id) {
        const udpatedUser = await User.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        if (udpatedUser) {
          res.status(200).json({ data: foundUser, message: 'Success' });
        } else {
          res.status(404).json({
            data: null,
            message: 'Unable to find the record with provided Id',
          });
        }
      } else {
        res
          .status(400)
          .json({ data: null, message: 'Bad Request, please provide user Id' });
      }
    } catch (e) {
      next(e);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const id = req.params['id'];
      const userToDelete = await User.findByIdAndDelete(id);
      if (id) {
        if (userToDelete) {
          res.status(202).json({ data: null, message: 'Deleted successfully' });
        } else {
          res.status(404).json({
            data: null,
            message: 'Unable to find the record with provided Id',
          });
        }
      } else {
        res
          .status(400)
          .json({ data: null, message: 'Bad Request, please provide user Id' });
      }
    } catch (e) {
      next(e);
    }
  },
};
