'use strict';

const express = require('express')
const auth = require('../');
const Redis = require('ioredis');
const passport = require('passport')
const bodyParser = require('body-parser');
const formatError = require('../../api/lib/middlewares/formatError');

const app = express();

app.get('/jwt', passport.authenticate('jwt', { session: false}),
  function(req, res) {
    res.json(req.user);
  }
);
const secret = 'titi'
const redis = new Redis(6379, process.env['REDIS_PORT_HOST'] || 'localhost')
const userPrefix = 'testUser'
const options = {
  redis: {
    userPrefix,
    driver: redis
  },
  secret
}
app.use(bodyParser.json());

app.use(auth(options))

app.use(formatError)

module.exports = {
  app,
  secret,
  redis,
  userPrefix
}
