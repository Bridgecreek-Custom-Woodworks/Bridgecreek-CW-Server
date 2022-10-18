const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const {
  user,
  badIdProduct,
  product,
  badValidationProduct,
} = require('./utils');

describe('ERROR MIDDLEWARE WORKFLOW TEST ==>', function () {
  let token;

  it('Set Token', (done) => {
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

        done();
      });
  });

  it('Check for bad primary key format error', (done) => {
    chai
      .request(server)
      .post(`/api/v1/products/admin`)
      .set({ Authorization: `Bearer ${token}` })
      .send(badIdProduct)
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        expect(res).to.have.any.key('error');
        expect(res.body.success).to.be.false;
        expect(res.body.error).to.be.a('string');

        done();
      });
  });

  it('Check for unique field constraints error', (done) => {
    chai
      .request(server)
      .post(`/api/v1/products/admin`)
      .set({ Authorization: `Bearer ${token}` })
      .send(product)
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res).to.have.any.key('error');
        expect(res.body.success).to.be.false;
        expect(res.body.error).to.be.a('string');

        done();
      });
  });

  it('Check for validation error', (done) => {
    chai
      .request(server)
      .post(`/api/v1/products/admin`)
      .set({ Authorization: `Bearer ${token}` })
      .send(badValidationProduct)
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res).to.have.any.key('error');
        expect(res.body.success).to.be.false;
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.be.equal('Validation isUrl on url failed');

        done();
      });
  });
});
