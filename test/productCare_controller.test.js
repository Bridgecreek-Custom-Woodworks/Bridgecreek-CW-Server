const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const ProductCare = require('../models/ProductCare');
const { user, productCareKeys } = require('./utils');

describe('PRODUCT CARE WORKFLOW TEST ===>', function () {
  this.beforeEach(async () => {
    count = await ProductCare.count();
  });

  let adminToken;
  let token;
  let count;
  let productCareId;

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

  it('Should get all product care items', (done) => {
    chai
      .request(server)
      .get('/api/v1/productcare/allproductcare/admin')
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data.length).to.be.equal(count);
        expect(err).to.be.null;

        done();
      });
  });

  it('Should get a single product care by id', (done) => {
    chai
      .request(server)
      .get('/api/v1/productcare/1')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.productCareId).to.be.equal(1);
        expect(res.body.data.productId).to.be.equal(
          '1ee44e7e-6a3a-4a6d-9626-32d4447ef25f'
        );
        expect(err).to.be.null;

        done();
      });
  });

  it('Create a product care item', (done) => {
    chai
      .request(server)
      .post('/api/v1/productcare/admin')
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({
        productId: '700b2eb1-3de0-4d9d-a0b7-a9d48c67f1ac',
        maintenance: 'Clean you board with water',
      })
      .end((err, res) => {
        productCareId = res.body.data.productCareId;
        let addedCount = count + 1;

        expect(res.status).to.be.equal(201);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data).to.have.all.keys(productCareKeys);
        expect(addedCount).to.be.equal(5);
        expect(err).to.be.null;

        done();
      });
  });

  it('Update product care item', (done) => {
    chai
      .request(server)
      .put(`/api/v1/productcare/update/${productCareId}/admin`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({ specialInstructions: `Don't put this in the dishwasher` })
      .end((err, res) => {
        const { specialInstructions } = res.body.data[1][0];

        expect(res.status).to.be.equal(200);
        expect(res.body.data[0]).to.be.equal(1);
        expect(res.body.data[1][0]).to.be.an('object');
        expect(specialInstructions).to.be.equal(
          `Don't put this in the dishwasher`
        );
        expect(err).to.be.null;

        done();
      });
  });

  it('Delete product care item', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/productcare/delete/${productCareId}/admin`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        let deletedCount = count - 1;

        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(deletedCount).to.be.equal(4);
        expect(err).to.be.null;

        done();
      });
  });
});
