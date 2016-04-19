'use strict';

const express = require('express');
const passport = require('passport');
const jwtStrategy = require('./jwt/passport');//(options);

module.exports = function(options) {
  const router = express.Router();

  passport.use(jwtStrategy(options))

  //router.use('/jwt', require('./jwt'));

  return router;
}
