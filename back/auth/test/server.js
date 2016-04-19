'use strict';

const express = require('express')
const auth = require('../');
const Redis = require('ioredis');
const passport = require('passport')

const app = express();

app.get('/jwt', passport.authenticate('jwt', { session: false}),
  function(req, res) {
    res.json(req.user);
  }
);
const secret = 'titi'
const redis = new Redis(6379, 'localhost')
const userPrefix = 'testUser'
const options = {
  redis: {
    userPrefix,
    driver: redis
  },
  secret
}

app.use(auth(options))

module.exports = {
  app,
  secret,
  redis,
  userPrefix
}
