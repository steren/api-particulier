'use strict';

const express = require('express');
const UsersService = require('../../api/users/users.service');

module.exports = function(options) {
  const router = express.Router();
  const userService = new UsersService(options)

  router.post('/login', function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    userService.getUser(email)
      .then((user) => {
        if (!user) {
          return res
              .status(401)
              .json({reason : 'L\'utilisateur n\'apparait pas dans le système' })
        }
        if(!userService.checkPassword(user, password)) {
          return res
              .status(401)
              .json({reason : 'Le mot de passe est incorrect' })
        }
        const token = userService.signToken(user)
        return res.json({ token: token })
      }, (err) => {
        next(err)
      })
  });

  return router;
}
