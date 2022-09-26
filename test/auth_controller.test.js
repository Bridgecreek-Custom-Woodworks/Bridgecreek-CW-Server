const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const User = require('../models/User');
const { user } = require('./utils');

describe('PASSWORD RESET FLOW ==>', function () {
  this.beforeEach(async () => {
    getUser = await User.findOne({
      attributes: ['resetPasswordToken', 'password', 'userId'],
      where: { userId: user.userId },
    });

    originalPassword = 'admin1234';
    newPassword = 'admin4321';
  });

  let token;
  let originalPassword;

  it('Verify error if user is not found', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({
        email: 'otto@gmail.com',
        password: user.password,
      })
      .end(function (err, res) {
        expect(res.status).to.be.equal(400);
        expect(res.body.success).to.be.false;

        done();
      });
  });

  it('Verify error if password doesnt match', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({
        email: user.email,
        password: 'admin5050',
      })
      .end(function (err, res) {
        expect(res.status).to.be.equal(401);
        expect(res.body.success).to.be.false;

        done();
      });
  });

  it('Verify error if both email and/or password not being sent', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({
        email: '',
        password: '',
      })
      .end(function (err, res) {
        expect(res.status).to.be.equal(400);
        expect(res.body.success).to.be.false;

        done();
      });
  });

  it('Send reset password link to users email', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/forgotpassword')
      .send({ email: user.email })
      .end((err, res) => {
        const {
          resetPasswordToken: passwordToken,
          resetPasswordExpire: passwordExpire,
          email: usersEmail,
        } = res.body.data;

        expect(res.status).to.be.equal(200);
        expect(passwordToken).to.be.a('string');
        expect(passwordExpire).to.be.a('string');
        expect(usersEmail).to.include('@');
        expect(usersEmail).to.include('.com');
        expect(err).to.be.null;

        done();
      });
  });

  it('Verify error if no user is found', (done) => {
    chai
      .request(server)
      .put(`/api/v1/auth/resetpassword/BAD-RESET-TOKEN`)
      .send({ password: newPassword })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body.success).to.be.false;
        done();
      });
  });

  it('Reset users password', (done) => {
    chai
      .request(server)
      .put(`/api/v1/auth/resetpassword/${process.env.RESET_PASSWORD}`)
      .send({ password: newPassword })
      .end((err, res) => {
        const { resetPasswordToken, resetPasswordExpire } = res.body.data;
        const oldPassword = getUser.dataValues.password;
        const newPassword = res.body.data.password;
        token = res.body.token;

        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.equal(true);
        expect(res.body.data.userId).to.be.equal(getUser.dataValues.userId);
        expect(oldPassword).to.not.be.equal(newPassword);
        expect(resetPasswordToken).to.be.null;
        expect(resetPasswordExpire).to.be.null;
        expect(err).to.be.null;

        done();
      });
  });

  it('Verify error if newPassword and newPassword2 dont match', (done) => {
    chai
      .request(server)
      .put('/api/v1/auth/updatepassword')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        currentPassword: newPassword,
        newPassword: 'passwordOne',
        newPassword2: 'passwordTwo',
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body.success).to.be.false;

        done();
      });
  });

  it('Verify error if doesnt match', (done) => {
    chai
      .request(server)
      .put('/api/v1/auth/updatepassword')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        currentPassword: '',
        newPassword: originalPassword,
        newPassword2: originalPassword,
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body.success).to.be.false;
        done();
      });
  });

  it('Should update password', (done) => {
    chai
      .request(server)
      .put('/api/v1/auth/updatepassword')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        currentPassword: newPassword,
        newPassword: originalPassword,
        newPassword2: originalPassword,
      })
      .end((err, res) => {
        const oldPassword = getUser.dataValues.password;
        const newPassword = res.body.data.password;

        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body).to.not.have.property('error');
        expect(oldPassword).to.not.be.equal(newPassword);
        expect(res.body.token.length).to.be.equal(192);
        expect(err).to.be.null;

        done();
      });
  });
});
