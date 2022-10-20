const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const Orders = require('../models/Order');
const { user, orderKeys, createOrderKeys, badToken } = require('./utils');

describe('ORDER WORKFLOW TEST ==>', function () {
  this.afterEach(async () => {
    count = await Orders.count();
  });
  let token;
  let createOrderToken;
  let count;
  let newOrderId;

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

  it('Set Create Order Token', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'debrahjohnson@gmail.com', password: 'admin1234' })
      .end((err, res) => {
        createOrderToken = res.body.token;
        expect(res.status).to.be.equal(200);
        expect(err).to.be.null;

        done();
      });
  });

  it('Should get all orders', (done) => {
    chai
      .request(server)
      .get('/api/v1/orders/admin/allorders')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.a('array');
        expect(res.body.success).to.be.true;
        expect(res.body.data.length).to.be.gte(2);
        expect(err).to.be.null;

        done();
      });
  });

  it('Get single users orders', (done) => {
    chai
      .request(server)
      .get('/api/v1/orders/getmyorders')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.a('array');
        expect(res.body.data[0]).to.be.a('object');
        expect(res.body.data[0]).to.have.all.keys(orderKeys);
        expect(res.body.modelAssociations).to.include(
          'Products',
          'OrderItems',
          'CartOrderAccess'
        );
        expect(err).to.be.null;

        done();
      });
  });

  it('Get a single order by id (params)', (done) => {
    chai
      .request(server)
      .get('/api/v1/orders/getorder/76e35ec6-de02-432a-aa01-e58703d407f6')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        const { subTotal, taxTotal, shipping, orderDiscount, total } =
          res.body.data;

        let orderTotal =
          Number(subTotal) +
          Number(taxTotal) +
          Number(shipping) -
          Number(orderDiscount);

        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.a('object');
        expect(res.body.data.orderStatus).to.be.equal('pending');
        expect(res.body.data).to.have.all.keys(createOrderKeys);
        expect(total).to.be.equal(String(orderTotal.toFixed(2))); // <== Move this to create order test
        expect(err).to.be.null;

        done();
      });
  });

  it('Verify order creation fails if users account is not active', (done) => {
    chai
      .request(server)
      .post('/api/v1/orders')
      .set({ Authorization: `Bearer ${createOrderToken}` })
      .send()
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body.success).to.be.false;
        expect(res.body.error).to.be.equal('Please active your account first');

        chai
          .request(server)
          .put('/api/v1/users/updateme')
          .set({ Authorization: `Bearer ${createOrderToken}` })
          .send({ activeStatus: 'active' })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.data.activeStatus).to.be.equal('active');
            expect(err).to.be.null;

            done();
          });
      });
  });

  it('Create an order', (done) => {
    chai
      .request(server)
      .post('/api/v1/orders')
      .set({ Authorization: `Bearer ${createOrderToken}` })
      .send() // <== Order fields are set in the req.body by Cart association to the user
      .end((err, res) => {
        const { subTotal, taxTotal, shipping, orderDiscount, total, orderId } =
          res.body.data;

        let orderTotal =
          Number(subTotal) +
          Number(taxTotal) +
          Number(shipping) -
          Number(orderDiscount);

        newOrderId = orderId;

        const newOrderCountTotal = count + 1;

        expect(res.status).to.be.equal(201);
        expect(res.body.data).to.be.a('object');
        expect(res.body.data.orderStatus).to.be.equal('pending');
        expect(res.body.data).to.have.all.keys(orderKeys);
        expect(total).to.be.equal(String(orderTotal.toFixed(2)));
        expect(newOrderCountTotal).to.be.equal(8);
        expect(err).to.be.null;

        done();
      });
  });

  it('Update order info', (done) => {
    chai
      .request(server)
      .put(`/api/v1/orders/update/${newOrderId}`)
      .set({ Authorization: `Bearer ${createOrderToken}` })
      .send({ firstName: 'Not', lastName: 'Debrah', city: 'Charlotte' })
      .end((err, res) => {
        const { firstName, lastName, city } = res.body.data;

        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.a('object');
        expect(firstName).to.be.equal('Not');
        expect(lastName).to.be.equal('Debrah');
        expect(city).to.be.equal('Charlotte');
        expect(err).to.be.null;

        done();
      });
  });

  it('Delete order', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/orders/delete/${newOrderId}`)
      .set({ Authorization: `Bearer ${createOrderToken}` })
      .end((err, res) => {
        const newOrderCountTotal = count - res.body.data;

        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.equal(1);
        expect(newOrderCountTotal).to.be.equal(7);
        expect(err).to.be.null;

        chai
          .request(server)
          .put('/api/v1/users/updateme')
          .set({ Authorization: `Bearer ${createOrderToken}` })
          .send({ activeStatus: 'pending' })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.data.activeStatus).to.be.equal('pending');
            expect(err).to.be.null;
            done();
          });
      });
  });

  it('Should fail getting all orders if user is not logged in', (done) => {
    chai
      .request(server)
      .get('/api/v1/orders/getmyorders')
      .set({ Authorization: `Bearer ${badToken}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body.success).to.be.false;
        expect(res.body.error).to.be.equal(
          'Not authorized to access this route'
        );

        done();
      });
  });

  it('Check if new cart is located via for loop', (done) => {
    chai
      .request(server)
      .put('/api/v1/carts/mycart/update/e4e71f3b-6523-4c97-980e-2c80be8dc352')
      .set({ Authorization: `Bearer ${token}` })
      .send({ cartStatus: 'new' })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data[1][0].cartStatus).to.be.equal('new');
        expect(err).to.be.null;

        // Checking if else if condition is functioning
        chai
          .request(server)
          .put('/api/v1/orders/update/76e35ec6-de02-432a-aa01-e58703d407f6')
          .set({ Authorization: `Bearer ${token}` })
          .send({ comments: 'I love this product!!' })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.data).to.be.an('object');
            expect(err).to.be.null;

            // Setting cart status back to checkout
            chai
              .request(server)
              .put(
                '/api/v1/carts/mycart/update/e4e71f3b-6523-4c97-980e-2c80be8dc352'
              )
              .set({ Authorization: `Bearer ${token}` })
              .send({ cartStatus: 'checkout' })
              .end((err, res) => {
                expect(res.status).to.be.equal(200);
                expect(res.body.data[1][0].cartStatus).to.be.equal('checkout');
                expect(err).to.be.null;

                done();
              });
          });
      });
  });

  it('Check for error if order is not found', (done) => {
    chai
      .request(server)
      .put('/api/v1/orders/update/6bb6fcb9-a7c1-4f88-bd94-7813a69ca804')
      .set({ Authorization: `Bearer ${token}` })
      .send()
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body.error).to.be.equal('Your order was not found');
        expect(err).to.be.null;

        chai
          .request(server)
          .delete('/api/v1/orders/delete/6bb6fcb9-a7c1-4f88-bd94-7813a69ca804')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            expect(res.status).to.be.equal(404);
            expect(res.body.error).to.be.equal(
              'Order with id 6bb6fcb9-a7c1-4f88-bd94-7813a69ca804 not found'
            );
            expect(err).to.be.null;

            done();
          });
      });
  });
});
