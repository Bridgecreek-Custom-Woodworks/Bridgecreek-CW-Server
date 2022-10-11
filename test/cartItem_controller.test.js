const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const CartItem = require('../models/CartItem');
const { user, cartItemKeys, product } = require('./utils');

describe('CART_ITEM WORKFLOW TEST ==>', function () {
  this.afterEach(async () => {
    count = await CartItem.count();
  });
  let token;
  let count;
  let cartItemId;
  let newCartItemId;
  let newCartId;
  let userToken;

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

  it('Set userToken', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({
        email: 'somebody@gmail.com',
        password: 'admin1234',
      })
      .end(function (err, res) {
        userToken = res.body.token;
        expect(res.status).to.be.equal(200);

        done();
      });
  });

  it('Should get all cartItems', (done) => {
    chai
      .request(server)
      .get('/api/v1/admin/allcartitems')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        cartItemId = res.body.data[0].cartItemId;

        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.a('array');
        expect(res.body.success).to.be.true;
        expect(res.body.count).to.be.gte(5);
        expect(err).to.be.null;

        done();
      });
  });

  it('Get a single users cartItems', (done) => {
    chai
      .request(server)
      .get(`/api/v1/cartitems/${cartItemId}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        const { cartItemId, productId } = res.body.data;

        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.a('object');
        expect(cartItemId).to.be.a('number');
        expect(productId).to.be.a('string');
        expect(res.body.data).to.have.all.keys(cartItemKeys);
        expect(err).to.be.null;

        done();
      });
  });

  it('Create a cart Item', (done) => {
    chai
      .request(server)
      .post(`/api/v1/cartitems/${product.productId}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .send({ quantity: 3, discount: 0.1 })
      .end((err, res) => {
        newCartItemId = res.body.data.cartItemId;
        newCartId = res.body.data.cartId;

        expect(res.status).to.be.equal(201);
        expect(res.body.data).to.be.a('object');
        expect(res.body.data.quantity).to.be.equal(3);
        expect(res.body.data.discount).to.be.equal('0.1');
        expect(res.body.data.total).to.be.equal(135);
        expect(err).to.be.null;

        done();
      });
  });

  it('Should update cartItem and checks if cartItem total is being added correctly', (done) => {
    chai
      .request(server)
      .put(`/api/v1/cartItems/update/${newCartItemId}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .send({ quantity: 5 })
      .end((err, res) => {
        const { total, quantity } = res.body.data[1][0];

        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.a('array');
        expect(quantity).to.be.equal(5);
        expect(total).to.be.equal(225);
        expect(err).to.be.null;

        done();
      });
  });

  it('Delete cart Item', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/cartItems/delete/${newCartItemId}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .end((err, res) => {
        afterDeletedCount = count - res.body.data;

        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(afterDeletedCount).to.be.equal(5);
        expect(err).to.be.null;

        // Deletes cart that was created for the cart item
        chai
          .request(server)
          .delete(`/api/v1/admin/deletecart/${newCartId}`)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.success).to.be.true;
            expect(err).to.be.null;

            done();
          });
      });
  });
});
