'use strict';

const expect = require('chai').expect
const app = require('../../test/server').app
const secret = require('../../test/server').secret
const redis = require('../../test/server').redis
const userPrefix = require('../../test/server').userPrefix
const jwt = require('jsonwebtoken')
const supertest = require('supertest')

describe('jwt passport conf', () => {
  let token
  const user = {
    email: 'tutu@api.gouv.fr',
    other: 'stuff'
  }
  const tokenData = {
    sub: user.email,
    email: user.email
  }
  describe('when adding a user', () => {

    beforeEach((done) => {
      redis.set(userPrefix + '::' + user.email, JSON.stringify(user), done)
    })

    afterEach((done) => {
      redis.del(userPrefix + '::' + user.email, done)
    })

    describe('when signing a valid token', () => {
      beforeEach(() => {
        token = jwt.sign(tokenData, secret);
      })

      it('can access the route and return the user',(done) => {
        supertest(app)
          .get('/jwt')
          .set('Authorization', 'JWT '+ token)
          .expect(200, user, done)
      })
    })

    describe('when signing token with the wrong secret', () => {
      beforeEach(() => {
        token = jwt.sign(tokenData, 'rute');
      })

      it('cannot access the route',(done) => {
        supertest(app)
          .get('/jwt')
          .set('Authorization', 'JWT '+ token)
          .expect(401, done)
      })
    })

    describe('when signing an expired token', () => {
      beforeEach(() => {
        token = jwt.sign(tokenData, secret, { expiresIn: 0 });
      })

      it('cannot access the route',(done) => {
        supertest(app)
          .get('/jwt')
          .set('Authorization', 'JWT '+ token)
          .expect(401, done)
      })
    })
  })

  describe('when signing an valid token', () => {
    beforeEach(() => {
      token = jwt.sign(tokenData, secret);
    })

    it('cannot access the route',(done) => {
      supertest(app)
        .get('/jwt')
        .set('Authorization', 'JWT '+ token)
        .expect(401, done)
    })
  })
})
