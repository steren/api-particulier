'use strict';

const expect = require('chai').expect;
const UsersService = require('./../users.service')
const Redis = require('ioredis');
const StandardError = require('standard-error')
const emptylogger = require('bunyan-blackhole');


describe('Users Service', () => {
  describe('with redis up & running', () => {
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

    describe('When there is no user in redis', () => {
      it('we can add one user', (done) => {
        usersService.setUser(user)
          .then((result) => {
            expect(result).to.deep.equal(user)
            return usersService.getUser(email)
          })
          .then((result2) => {
            expect(result2).to.deep.equal(user)
            done()
          })
          .catch((err) => {
            done(err)
          })
      });
    })

    describe('When there is on user in redis', () => {
      beforeEach((done) => {
        usersService.setUser(user)
          .then((result) => {
            done()
          })
          .catch((err) => {
            done(err)
          })
      })

      it('we can retreive the user', (done) => {
        usersService.getUser(email)
          .then((result) => {
            expect(result).to.deep.equal(user)
            done()
          })
          .catch((err) => {
            done(err)
          })
      });

      it('we can delete the user', (done) => {
        usersService.deleteUser(email)
          .then(() => {
            return usersService.getUser(email)
          })
          .then((result2) => {
            expect(result2).to.be.null
            done()
          })
          .catch((err) => {
            done(err)
          })
      });

      it('we can update the user', (done) => {
        const newUser = {
          email,
          name: 'Géry',
          surname: 'Thibaut',
          role: 'user',
          localAuthority: 'Paris',
          keys: ['A', 'B', 'C']
        }
        usersService.setUser(newUser)
          .then((result) => {
            return usersService.getUser(email)
          })
          .then((result2) => {
            expect(result2).to.deep.equal(newUser)
            done()
          })
          .catch((err) => {
            done(err)
          })
      });
    });
  })
});
