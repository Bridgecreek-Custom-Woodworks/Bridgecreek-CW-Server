const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const Carts = require('../models/Cart');
const { user, userCartKeys, cartKeys } = require('./utils');

describe('CART WORKFLOW TEST ==>', function () {
  this.beforeEach(async () => {
    count = await Carts.count();
  });

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
        const addedCount = count + 1;

        expect(res.status).to.be.equal(201);
        expect(data).to.be.a('object');
        expect(data.cartId).to.be.a('string');
        expect(data).to.have.all.keys(cartKeys);
        expect(addedCount).to.be.equal(4);
        expect(err).to.be.null;

        done();
      });
  });

  it('Check if cart total is being added and subtracted correctly', (done) => {
    chai
      .request(server)
      .post('/api/v1/cartItems/68c70732-98ff-40cc-86ce-04ceef2eb623')
      .set({ Authorization: `Bearer ${token}` })
      .send({ quantity: 2, discount: 0.1 })
      .end((err, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.body.data).to.be.a('object');
        expect(res.body.data.total).to.be.equal(301.98);
        expect(res.body.data.quantity).to.be.equal(2);
        expect(err).to.be.null;
        cartItemId = res.body.data.cartItemId;

        chai
          .request(server)
          .get('/api/v1/carts/mycart')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            const { cartId, total } = res.body.data[0];

            expect(res.status).to.be.equal(200);
            expect(res.body.data).to.be.an('array');
            expect(cartId).to.be.a('string');
            expect(total).to.be.equal('466.98');
            expect(res.body.data[0]).to.have.all.keys(userCartKeys);
            expect(err).to.be.null;

            chai
              .request(server)
              .delete(`/api/v1/cartItems/delete/${cartItemId}`)
              .set({ Authorization: `Bearer ${token}` })
              .end((err, res) => {
                expect(res.status).to.be.equal(200);
                expect(res.body.data).to.be.equal(1);
                expect(err).to.be.null;

                chai
                  .request(server)
                  .get('/api/v1/carts/mycart')
                  .set({ Authorization: `Bearer ${token}` })
                  .end((err, res) => {
                    expect(res.status).to.be.equal(200);
                    expect(res.body.data).to.be.a('array');
                    expect(res.body.data[0].total).to.be.equal('165.00');
                    expect(err).to.be.null;

                    done();
                  });
              });
          });
      });
  });

  it('Update cart', (done) => {
    chai
      .request(server)
      .put(`/api/v1/carts/mycart/update/${createdCartId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({ total: 40, cartStatus: 'Checkout' })
      .end((err, res) => {
        const { cartId, userId, total, cartStatus } = res.body.data[1][0];

        expect(res.status).to.be.equal(200);
        expect(res.body.data[1]).to.be.a('array');
        expect(res.body.data[1][0]).to.have.all.keys(cartKeys);
        expect(cartId).to.be.a('string');
        expect(userId).to.be.a('string');
        expect(total).to.be.equal('40');
        expect(cartStatus).to.be.equal('Checkout');
        expect(err).to.be.null;

        done();
      });
  });

  it('Delete cart', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/admin/deletecart/${createdCartId}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        const afterdeletedCount = count - 1;

        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(afterdeletedCount).to.be.equal(3);
        expect(err).to.be.null;

        done();
      });
  });
});
