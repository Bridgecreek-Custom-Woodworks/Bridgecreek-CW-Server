const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const ShippingAddress = require('../models/ShippingAddress');
const {
  user,
  createdShippingAddress,
  shippingAddressKeys,
} = require('./utils');

describe('SHIPPING WORKFLOW TEST ===>', function () {
  this.beforeEach(async () => {
    count = await ShippingAddress.count();
  });

  let adminToken;
  let token;
  let count;
  let newShippingAddressToken;
  let shippingAddressId;

  it('Set Token', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: user.password })
      .end((err, res) => {
        token = res.body.token;
        expect(res.status).to.be.equal(200);
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

  it('Set Token for creating new shipping address', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'somebody@gmail.com', password: 'admin1234' })
      .end((err, res) => {
        newShippingAddressToken = res.body.token;
        expect(res.status).to.be.equal(200);
        expect(err).to.be.null;

        done();
      });
  });

  it('Should get all shipping addresses', (done) => {
    chai
      .request(server)
      .get('/api/v1/shippingaddress/admin/allshippingaddresses')
      .set({ Authorization: `Bearer ${adminToken}` })
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

  it('Create a shipping address', (done) => {
    chai
      .request(server)
      .post('/api/v1/shippingaddress')
      .set({ Authorization: `Bearer ${newShippingAddressToken}` })
      .send(createdShippingAddress)
      .end((err, res) => {
        shippingAddressId = res.body.data.shippingAddressId;
        let createdShippingAddressCount = count + 1;

        expect(res.status).to.be.equal(201);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('object');
        expect(res.body.data).to.have.all.keys(shippingAddressKeys);
        expect(createdShippingAddressCount).to.be.equal(4);
        expect(err).to.be.null;

        done();
      });
  });

  it('Update shipping address', (done) => {
    chai
      .request(server)
      .put(`/api/v1/shippingaddress/update/${shippingAddressId}`)
      .set({ Authorization: `Bearer ${newShippingAddressToken}` })
      .send({ street: '112 Heaven St' })
      .end((err, res) => {
        const { street } = res.body.data[1][0];

        expect(res.status).to.be.equal(200);
        expect(res.body.data[0]).to.be.equal(1);
        expect(res.body.data[1][0]).to.be.an('object');
        expect(street).to.be.equal('112 Heaven St');
        expect(err).to.be.null;

        done();
      });
  });

  it('Delete shipping address', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/shippingaddress/delete/${shippingAddressId}`)
      .set({ Authorization: `Bearer ${newShippingAddressToken}` })
      .end((err, res) => {
        let deletedCount = count - 1;

        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(deletedCount).to.be.equal(3);
        expect(err).to.be.null;

        done();
      });
  });
});
