const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const Carts = require('../models/Cart');
const { user } = require('./utils');

describe.only('CART WORKFLOW TEST ==>', function () {
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

  it('Should get all carts', (done) => {
    chai
      .request(server)
      .get('/api/v1/admin/allcarts')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.a('array');
        expect(res.body.success).to.be.true;
        expect(res.body.count).to.be.gte(3);

        done();
      });
  });

  it('Get a single users cart', (done) => {
    chai
      .request(server)
      .get('/api/v1/carts/mycart')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        console.log(res.body);
        done();
      });
  });
});
