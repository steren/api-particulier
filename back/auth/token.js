'use strict';

const StandardError = require('standard-error');
const compose = require('composable-middleware');
const TokenService = require('./../api/admin/tokens.service')

module.exports = Auth

function Auth(options) {
  const tokenService = new TokenService(options)

  this.canAccessApi = function(req, res, next) {
    var token = req.get('X-API-Key') || ""
    req.consumer= {}
    tokenService.getToken(token)
    .then((result) => {
      if(result) {
       req.consumer = result;
       next()
      } else {
       next(new StandardError('You are not authorized to use the api', {code: 401}));
      }
    }, (err) => {
      next(new StandardError(err, {code: 500}));
    })
  }

  var canAccesAdmin = function(req, res, next) {
    if(req.consumer.role && req.consumer.role !== 'admin') {
      next(new StandardError('Vous n\'être pas administrateur', {code: 403}));
    } else {
      next()
    }
  }

  this.canAccessAdminFunction = compose()
      .use(this.canAccessApi)
      .use(canAccesAdmin)
}
