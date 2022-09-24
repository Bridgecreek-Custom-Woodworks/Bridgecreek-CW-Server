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

    oldPasswordToken = getUser.dataValues.resetPasswordToken;

    originalPassword = 'admin1234';
    newPassword = 'admin4321';
  });

  let token;
  let oldPasswordToken;
  let originalPassword;

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

        done();
      });
  });

  it('Should change password', (done) => {
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

        done();
      });
  });
});
