const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const User = require('../models/User');
const { user, newUser } = require('./utils');

describe('====> USER WORKFLOW TEST', function () {
  let token;

  it('Should log in user', (done) => {
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
        expect(err).to.be.equal(null);
        done();
      });
  });

  it.skip('Check if user password is stored salted and hashed ', async () => {
    const savedUser = await User.scope('withPassword').findOne({
      where: { email: user.email },
    });

    expect(savedUser.dataValues.password.length).to.be.equal(60);
    expect(savedUser.dataValues.password).to.be.equal(user.hashedPassword);
  });

  it.skip('Log out user', (done) => {
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

        done();
      });
  });

  it.skip('Should get all users', (done) => {
    chai
      .request(server)
      .get('/api/v1/users/admin/allusers')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data.length).to.be.gte(5);

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
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.userId).to.be.equal(user.userId);
        done();
      });
  });
});
