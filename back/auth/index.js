'use strict';

const express = require('express');
const passport = require('passport');
const jwtStrategy = require('./jwt/passport');

module.exports = function(options) {
  const router = express.Router();

  passport.use(jwtStrategy(options))

  router.use('/jwt', require('./jwt')(options));

  return router;
}
