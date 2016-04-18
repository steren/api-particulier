const UsersService = require('./users.service')
const StandardError = require('standard-error');

module.exports = UserController;

function UserController(options) {
  options = options || {};
  const usersService = new UsersService(options)


  this.getProfile = function(req, res, next) {
    usersService.getUser(req.params.user_mail).then((user) => {
      if(!user) {
        return next(new StandardError('L\'utilisateur n\'a pu être trouvé', {code: 404}))
      }
      res.json(user);
    }).catch((err) => {
      next(new StandardError(err, {code: 500}));
    })
  }
}
