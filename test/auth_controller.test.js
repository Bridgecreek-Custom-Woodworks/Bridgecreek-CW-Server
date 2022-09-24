const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const { post } = require('request');
chai.use(chaiHttp);
const server = require('../server');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { user, product, newProduct, productKeys } = require('./utils');

describe('PASSWORD RESET FLOW ==>', function () {
  this.beforeEach(async () => {
    getUser = await User.findOne({
      attributes: ['resetPasswordToken'],
      where: { userId: user.userId },
    });
    oldPasswordToken = getUser.dataValues.resetPasswordToken;
  });

  let token;
  let oldPasswordToken;
  let password = 'admin1234';

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
      .send({ password: password })
      .end(async (err, res) => {
        const { resetPasswordToken, resetPasswordExpire } = res.body.data;
        // const comparedPasswords = await bcrypt.compare(password, savedPassword);

        expect(res.status).to.be.equal(200);
        expect(resetPasswordToken).to.be.null;
        expect(resetPasswordExpire).to.be.null;
        // expect(comparedPasswords).to.be.true;

        done();
      });
  });
});
