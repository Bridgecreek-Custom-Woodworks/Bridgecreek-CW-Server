const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const OrderItems = require('../models/OrderItems');
const {
  user,
  orderItemKeys,
  orderItem,
  updatedOrderItemKeys,
} = require('./utils');

describe('ORDER_ITEM WORKFOLW TEST ==>', function () {
  this.afterEach(async () => {
    count = await OrderItems.count();
  });
  let token;
  let count;
  let orderItemId;
  let newOrderItemId;

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

  it('Get all order items', (done) => {
    chai
      .request(server)
      .get('/api/v1/orders/admin/allorderitems')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        orderItemId = res.body.data[0].orderItemId;
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.a('array');
        expect(res.body.success).to.be.true;
        expect(res.body.count).to.be.gte(4);
        expect(err).to.be.null;

        done();
      });
  });

  it('Get a single order item', (done) => {
    chai
      .request(server)
      .get(`/api/v1/orderitems/getorderitem/${orderItemId}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.a('object');
        expect(res.body.data.orderItemId).to.be.equal(orderItemId);
        expect(res.body.data).to.have.all.keys(orderItemKeys);
        expect(err).to.be.null;

        done();
      });
  });

  it('Create a order item', (done) => {
    chai
      .request(server)
      .post('/api/v1/orderitems')
      .set({ Authorization: `Bearer ${token}` })
      .send(orderItem)
      .end((err, res) => {
        newOrderItemId = res.body.data.orderItemId;
        let newOrderItemCount = count + 1;

        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.a('object');
        expect(res.body.data).to.have.all.keys(orderItemKeys);
        expect(newOrderItemCount).to.be.equal(5);
        expect(err).to.be.null;

        done();
      });
  });

  it('Update order item', (done) => {
    chai
      .request(server)
      .put(`/api/v1/orderitems/update/${newOrderItemId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({ quantity: 2 })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.a('object');
        expect(res.body.data).to.have.any.keys(updatedOrderItemKeys);
        expect(res.body.data.quantity).to.be.equal(2);
        expect(err).to.be.null;

        done();
      });
  });

  it('Delete a order item', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/orderitems/delete/${newOrderItemId}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        let afterDeleteOrderItemCount = count - res.body.data;
        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(afterDeleteOrderItemCount).to.be.equal(4);
        expect(err).to.be.null;

        done();
      });
  });

  it('Check for error if no order item is found', (done) => {
    chai
      .request(server)
      .get(
        `/api/v1/orderitems/getorderitem/498b7ab5-1c04-456f-891b-be90d5dd7db2`
      )
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body.error).to.be.equal(
          'Order item 498b7ab5-1c04-456f-891b-be90d5dd7db2 was not found'
        );
        expect(err).to.be.null;

        chai
          .request(server)
          .delete(
            '/api/v1/orderitems/delete/498b7ab5-1c04-456f-891b-be90d5dd7db2'
          )
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            expect(res.status).to.be.equal(404);
            expect(res.body.error).to.be.equal(
              'Order item 498b7ab5-1c04-456f-891b-be90d5dd7db2 was not found'
            );
            expect(err).to.be.null;

            chai
              .request(server)
              .put(
                '/api/v1/orderitems/update/498b7ab5-1c04-456f-891b-be90d5dd7db2'
              )
              .set({ Authorization: `Bearer ${token}` })
              .send({ quantity: 2 })
              .end((err, res) => {
                expect(res.status).to.be.equal(404);
                expect(res.body.error).to.be.equal(
                  'Order item 498b7ab5-1c04-456f-891b-be90d5dd7db2 was not found'
                );
                expect(err).to.be.null;

                done();
              });
          });
      });
  });

  it('Check if order is located via for loop', (done) => {
    // Setting order status to 'new order' to check else if branch in for loop
    chai
      .request(server)
      .put(`/api/v1/orders/update/76e35ec6-de02-432a-aa01-e58703d407f6`)
      .set({ Authorization: `Bearer ${token}` })
      .send({ orderStatus: 'new order' })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(err).to.be.null;

        // Checking if else if condition is functioning
        chai
          .request(server)
          .post('/api/v1/orderitems')
          .set({ Authorization: `Bearer ${token}` })
          .send({
            productId: '33cf392c-087e-4143-858c-9e00c7c6a119',
            quantity: 2,
          })
          .end((err, res) => {
            let testOrderItemId = res.body.data.orderItemId;

            expect(res.status).to.be.equal(200);
            expect(err).to.be.null;

            // Deleting test order item id from above
            chai
              .request(server)
              .delete(`/api/v1/orderitems/delete/${testOrderItemId}`)
              .set({ Authorization: `Bearer ${token}` })
              .end((err, res) => {
                expect(res.status).to.be.equal(200);
                expect(res.body.data).to.be.equal(1);
                expect(err).to.be.null;

                done();
              });
          });
      });
  });
});
