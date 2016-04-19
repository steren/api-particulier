'use strict';

const jwt = require('jsonwebtoken')

class UserService {

  constructor(options) {
    this.redis = options.redis.driver
    this.key = options.redis.userPrefix;
    this.secret = options.secret
  }

  getUser(email) {
    return this.redis.get(this.key + '::' + email)
      .then((user) => {
        return JSON.parse(user)
      })
  }

  setUser(user) {
    return this.redis.set(this.key +'::'+ user.email, JSON.stringify(user))
      .then(() => {
        return user
      })
  }

  deleteUser(email) {
    return this.redis.del(this.key + '::'+ email)
  }

  checkPassword(user, password) {
    return user.password === password
  }

  signToken(user) {
    return jwt.sign({ sub: user.email }, this.secret, { expiresIn: '10m'});
  }
}


module.exports = UserService
