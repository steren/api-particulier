'use strict';

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UsersService = require('../../api/users/users.service');

module.exports = function(options) {
  const userService = new UsersService(options);
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: options.secret
  };

  return new JwtStrategy(opts, function(jwt_payload, done) {
    userService.getUser(jwt_payload.sub)
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'utilisateur incorrect' });
        }
        return done(null, user);
      }, (err) => {
        return done(err)
      })
  });
};
