const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const ShippingAddress = require('../models/ShippingAddress');
const { user } = require('./utils');

describe.only('SHIPPING WORKFLOW TEST ===>', function () {
  this.beforeEach(async () => {
    count = await ShippingAddress.count();
  });
  let token;
  let count;

  it('Set Token', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: user.password })
      .end((err, res) => {
        token = res.body.token;
        expect(res.status).to.be.equal(200);

        done();
      });
  });
  it('Should get all shipping addresses', (done) => {
    chai
      .request(server)
      .get('/api/v1/shippingaddress/admin/allshippingaddresses')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.count).to.be.equal(count);
        expect(err).to.be.null;

        done();
      });
  });

  it('Should get users shipping address', (done) => {
    chai
      .request(server)
      .get('/api/v1/shippingaddress/myshippingaddresses')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data[0].userId).to.be.equal(user.userId);
        expect(err).to.be.null;

        done();
      });
  });

  it('Should get shipping address by id', (done) => {
    chai
      .request(server)
      .get('/api/v1/shippingaddress/a609cb92-9cd6-41ca-865b-954aebd2889c')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.shippingAddressId).to.be.equal(
          'a609cb92-9cd6-41ca-865b-954aebd2889c'
        );
        expect(err).to.be.null;

        done();
      });
  });
});
