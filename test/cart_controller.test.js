const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const Carts = require('../models/Cart');
const { user, userCartKeys, cartKeys } = require('./utils');

describe('CART WORKFLOW TEST ==>', function () {
  let token;
  let count;
  let createdCartId; // <== From Create cart test case below

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
        expect(err).to.be.null;

        done();
      });
  });

  it('Get a single users cart', (done) => {
    chai
      .request(server)
      .get('/api/v1/carts/mycart')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        const { cartId } = res.body.data[0];

        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(cartId).to.be.a('string');
        expect(res.body.data[0]).to.have.all.keys(userCartKeys);
        expect(err).to.be.null;

        done();
      });
  });

  it('Create a cart', (done) => {
    chai
      .request(server)
      .post('/api/v1/carts')
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .end((err, res) => {
        const { data } = res.body;
        createdCartId = data.cartId;

        expect(res.status).to.be.equal(201);
        expect(data).to.be.a('object');
        expect(data.cartId).to.be.a('string');
        expect(data).to.have.all.keys(cartKeys);
        expect(err).to.be.null;

        done();
      });
  });

  it('Update cart', (done) => {
    chai
      .request(server)
      .put(`/api/v1/carts/mycart/update/${createdCartId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({ total: 40, cartStatus: 'Checkout' })
      .end((err, res) => {
        const { cartId, userId, total } = res.body.data[1][0];

        expect(res.status).to.be.equal(200);
        expect(res.body.data[1]).to.be.a('array');
        expect(res.body.data[1][0]).to.have.all.keys(cartKeys);
        expect(cartId).to.be.a('string');
        expect(total).to.be.a('number');
        expect(err).to.be.null;

        done();
      });
  });
});
