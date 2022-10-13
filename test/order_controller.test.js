const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const Orders = require('../models/Order');
const { user, orderKeys, badToken } = require('./utils');

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

  it('Get single user orders', (done) => {
    chai
      .request(server)
      .get('/api/v1/orders/getmyorders')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.a('array'); // <== This may change after refactor
        expect(res.body.data[0]).to.be.a('object'); // <== This may change after refactor
        expect(res.body.data[0]).to.have.all.keys(orderKeys);
        expect(res.body.modelAssociations).to.include('User');
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
        expect(res.body.data).to.have.all.keys(orderKeys);
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
        expect(newOrderCountTotal).to.be.equal(3);
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
        const { firstName, lastName, city } = res.body.data[1][0];

        expect(res.status).to.be.equal(200);
        expect(res.body.data[1][0]).to.be.a('object');
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
        expect(newOrderCountTotal).to.be.equal(2);
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
});
