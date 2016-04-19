'use strict';

const expect = require('chai').expect
const app = require('../../test/server').app
const secret = require('../../test/server').secret
const redis = require('../../test/server').redis
const userPrefix = require('../../test/server').userPrefix
const jwt = require('jsonwebtoken')
const supertest = require('supertest')

describe('jwt route', () => {
  let token
  const user = {
    email: 'tutu@api.gouv.fr',
    password: 'password'
  }
  describe('when adding a user', () => {

    beforeEach((done) => {
      redis.set(userPrefix + '::' + user.email, JSON.stringify(user), done)
    })

    afterEach((done) => {
      redis.del(userPrefix + '::' + user.email, done)
    })

    describe('when signing IN with a valid password', () => {
      it('return the token',(done) => {
        supertest(app)
          .post('/jwt/login')
          .send(user)
          .expect(200, (err, res) => {
            if(err) return done(err)
            const payload = jwt.verify(res.body.token, secret)
            expect(payload.sub).to.equal(user.email)
            done()
          })
      })
    })

    describe('when signing token with the wrong passport', () => {
      it('returns access denied',(done) => {
        const errorMessage = {
          reason: 'Le mot de passe est incorrect'
        };
        supertest(app)
          .post('/jwt/login')
          .send({email: 'tutu@api.gouv.fr', password: 'badOne'})
          .expect(401, errorMessage, done)
      })
    })

    describe('when signing token with the wrong mail', () => {
      it('returns access denied',(done) => {
        const errorMessage = {
          reason: 'L\'utilisateur n\'apparait pas dans le système'
        };
        supertest(app)
          .post('/jwt/login')
          .send({email: 'sdsd@api.gouv.fr', password: 'password'})
          .expect(401, errorMessage, done)
      })
    })
  })
})
