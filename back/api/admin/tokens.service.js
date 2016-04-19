'use strict';

class TokenService {

  constructor(options) {
    this.redis = options.redis.driver
    this.key = options.redis.tokensPrefix;
  }

  getTokens() {
    return this.redis.keys(this.key +'::*')
      .map((key) => {
        return this.redis.get(key)
      })
      .map((string) => {
        return JSON.parse(string)
      })
  }

  getToken(token) {
    return this.redis.get(this.key + '::' + token)
      .then((result) => {
        return JSON.parse(result)
      })
  }

  createToken(user) {
    return this.redis.set(this.key + '::' + user.token, JSON.stringify(user))
  }

  deleteToken(token) {
    return this.redis.del(this.key + '::'+ token)
  }
}


module.exports = TokenService
