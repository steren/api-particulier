const expect = require('chai').expect;
const request = require('request');
const serverTest = require('./../../test/utils/server');
const UsersService = require('./../users.service');
const Redis = require('ioredis')
const emptylogger = require('bunyan-blackhole');


describe('User API', function () {
  const server = serverTest();
  const api = server.api;

  describe('with Thibaut in DB', () => {
    const redisHost = process.env['REDIS_PORT_HOST'] ||'127.0.0.1'
    const redisDriver = new Redis(redisHost, 6379);
    const usersService = new UsersService({
      redis: {
        driver: redisDriver,
        userPrefix: 'user-test',
        logger: emptylogger()
      }
    });
    const email = 'tge@octo.com'
    const user = {
      email,
      name: 'gery',
      surname: 'Thibaut',
      role: 'user',
      localAuthority: 'Paris',
      keys: ['A', 'B']
    }
    beforeEach((done)  => {
      usersService.setUser(user)
      .then(() => done())
      .catch((err) => done(err))
    })

    describe("When getting the profile", () => {
      it('replies with json and 200', (done) => {
        api()
          .get('/api/users/' + email)
          .expect("content-type", /json/)
          .expect(200,user, done)
      });
    });

    describe("When getting another profile", () => {
      it('replies with json and 404', (done) => {
        const error = {
          "error": "not_found",
          "reason": "L'utilisateur n'a pu être trouvé"
        }
        api()
          .get('/api/users/notIn@gom.der')
          .expect("content-type", /json/)
          .expect(404, error, done)
      });
    });
  })
});
