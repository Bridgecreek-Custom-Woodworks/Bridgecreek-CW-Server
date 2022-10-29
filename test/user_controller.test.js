const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const sinon = require('sinon');
const server = require('../server');
const User = require('../models/User');
const { user, newUser, activeUser, userKeys } = require('./utils');

describe('USER WORKFLOW TEST ===>', function () {
  this.beforeEach(async () => {
    count = await User.count();
  });

  let adminToken;
  let token;
  let updateDeleteToken;
  let count;
  let activeUserToken;

  it('Set User Token', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .end(function (err, res) {
        token = res.body.token;

        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a('object');
        expect(err).to.be.null;

        done();
      });
  });

  it('Set Admin Token', (done) => {
    chai
      .request(server)
      .post('/api/v1/admin/login')
      .send({
        email: 'ottosjonesjr@gmail.com',
        password: 'admin1234',
      })
      .end(function (err, res) {
        adminToken = res.body.token;

        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a('object');
        expect(err).to.be.null;

        done();
      });
  });

  it('Log out user', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/logout')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        const userId = res.body.msg.split(' ');

        expect(res.status).to.be.equal(200);
        expect(res.body.msg).to.be.a('string');
        expect(userId[5].length).to.be.equal(36);
        expect(userId[5]).to.be.equal(user.userId);
        expect(err).to.be.null;

        done();
      });
  });

  it('Should get all users', (done) => {
    chai
      .request(server)
      .get('/api/v1/users/admin/allusers')
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        count = res.body.data.length;

        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data.length).to.be.gte(5);
        expect(err).to.be.null;

        done();
      });
  });

  it('Should get a single user', (done) => {
    chai
      .request(server)
      .get('/api/v1/users/getme')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data[0].userId).to.be.equal(user.userId);
        expect(res.body.data[0]).to.have.all.keys(userKeys);
        expect(err).to.be.null;

        done();
      });
  });

  it('Create a new user', (done) => {
    chai
      .request(server)
      .post('/api/v1/users')
      .send(newUser)
      .end((err, res) => {
        updateDeleteToken = res.body.token;

        expect(res.status).to.be.equal(201);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.password.length).to.be.equal(60);
        expect(res.body.data.email).to.include('@');
        expect(res.body.data.email).to.include(['.com']);
        expect(err).to.be.null;

        done();
      });
  });

  it('Verify email to activate account', (done) => {
    chai
      .request(server)
      .post('/api/v1/users')
      .send(activeUser)
      .end((err, res) => {
        activeUserToken = res.body.token;
        expect(res.status).to.be.equal(201);
        expect(res.body.data).to.be.a('object');
        expect(res.body.data.activeStatus).to.be.equal('pending');
        expect(res.body.data.resetPasswordToken).to.be.a('string');
        expect(res.body.data.resetPasswordExpire).to.be.a('string');
        expect(err).to.be.null;
        expect(res.error).to.be.false;

        chai
          .request(server)
          .delete('/api/v1/users/deleteme')
          .set({ Authorization: `Bearer ${activeUserToken}` })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.success).to.be.true;
            expect(err).to.be.null;

            done();
          });
      });
  });

  it('Update a user', (done) => {
    chai
      .request(server)
      .put('/api/v1/users/updateme')
      .set({ Authorization: `Bearer ${updateDeleteToken}` })
      .send({ firstName: 'Sam-Updated', city: 'Charlotte-Updated' })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.firstName).to.be.equal('Sam-Updated');
        expect(res.body.data.city).to.be.equal('Charlotte-Updated');
        expect(err).to.be.null;

        done();
      });
  });

  it('Delete a user', (done) => {
    const deletedCount = count - 1;
    chai
      .request(server)
      .delete('/api/v1/users/deleteme')
      .set({ Authorization: `Bearer ${updateDeleteToken}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.msg).to.include(newUser.userId);
        expect(deletedCount).to.be.equal(5);
        expect(err).to.be.null;

        done();
      });
  });

  it('Check if user password is stored salted and hashed ', async () => {
    const savedUser = await User.scope('withPassword').findOne({
      where: { email: user.email },
    });

    expect(savedUser.dataValues.password.length).to.be.equal(60);
  });
});
