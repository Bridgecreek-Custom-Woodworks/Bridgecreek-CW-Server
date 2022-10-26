const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const CartOrderAccess = require('../models/CartOrderAccess');
const {
  user,
  cartOrderAccessKeys,
  createdCartOrderAccessKeys,
} = require('./utils');

describe('CART_ORDER_ACCESS WORKFLOW TEST ===>', function () {
  this.beforeEach(async () => {
    count = await CartOrderAccess.count();
  });

  let token;
  let count;
  let createdCartOrderAccessId;
  let createdCartOrderAccessToken;

  it('Should log in user', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .end((err, res) => {
        token = res.body.token;

        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a('object');
        expect(err).to.be.equal(null);
        expect(err).to.be.null;

        done();
      });
  });

  it('Should get all cart order access', (done) => {
    chai
      .request(server)
      .get('/api/v1/cartorderaccess/admin/allcartOrderAccess')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data.length).to.be.within(10, 13);
        expect(res.body.data[0]).to.be.an('object');
        expect(err).to.be.null;

        done();
      });
  });

  it('Should get single cart order access', (done) => {
    chai
      .request(server)
      .get('/api/v1/cartorderaccess/getme')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.userName).to.be.equal('Otto');
        expect(res.body.data).to.have.all.keys(cartOrderAccessKeys);
        expect(err).to.be.null;

        done();
      });
  });

  it('Create a cart order access', (done) => {
    chai
      .request(server)
      .post('/api/v1/cartorderaccess')
      .set({ Authorization: `Bearer ${token}` })
      .send() // Nothing needs to be sent in the body
      .end((err, res) => {
        createdCartOrderAccessId = res.body.data.cartOrderAccessId;
        createdCartOrderAccessToken = res.body.token;
        let createdCartOrderAccessCount = count + 1;

        expect(res.status).to.be.equal(201);
        expect(res.body.data.password.length).to.be.equal(60);
        expect(res.body.token.length).to.be.equal(193);
        expect(res.body.data).to.be.an('object');
        expect(createdCartOrderAccessCount).to.be.within(11, 14);
        expect(res.body.data).to.have.all.keys(createdCartOrderAccessKeys);
        expect(err).to.be.null;

        done();
      });
  });

  it('Update cart order access', (done) => {
    chai
      .request(server)
      .put(`/api/v1/cartorderaccess/update/${createdCartOrderAccessId}`)
      .set({ Authorization: `Bearer ${createdCartOrderAccessToken}` })
      .send({ userName: 'Updated' })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.userName).to.be.equal('Updated');
        expect(err).to.be.null;

        done();
      });
  });

  it('Delete a cart order access', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/cartorderaccess/delete/${createdCartOrderAccessId}`)
      .set({ Authorization: `Bearer ${createdCartOrderAccessToken}` })
      .end((err, res) => {
        let deletedCartOrderAccessCount = count - 1;

        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.equal(1);
        expect(deletedCartOrderAccessCount).to.be.within(10, 13);
        expect(err).to.be.null;

        done();
      });
  });
});
