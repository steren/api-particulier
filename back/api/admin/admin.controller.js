module.exports = AdminController;

const TokenService = require('./tokens.service')
const StandardError = require('standard-error')


function AdminController(options) {
  options = options || {};
  const tokenService = new TokenService(options)

  this.getTokens = function(req, res, next) {
    tokenService.getTokens()
      .then((results) => {
        res.json(results)
      }, (err) => {
        next(new StandardError(err, {code: 500}));
      })
  }

  this.createToken = function(req, res, next) {
    tokenService.createToken(req.body)
      .then((result) => {
        res.status(201).json(result)
      }, (err) => {
        next(new StandardError(err, {code: 500}));
      })
  }

  this.deleteToken = function(req, res, next) {
    tokenService.deleteToken(req.params.name)
      .then((result) => {
        res.status(204).json(result)
      }, (err) => {
        next(new StandardError(err, {code: 500}));
      })
  }
}
