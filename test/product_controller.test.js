const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const User = require('../models/User');
const Products = require('../models/Product');
const { user, product, newProduct, productKeys } = require('./utils');

describe('PRODUCT WORKFLOW TEST ===>', function () {
  this.beforeEach(async () => {
    count = await Products.count();
  });

  let token;
  let count;

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

  it('Should get all products', (done) => {
    chai
      .request(server)
      .get('/api/v1/products')
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.count).to.be.gte(5);
        expect(res.body.data[0]).to.have.all.keys(productKeys);

        done();
      });
  });

  it('Should get single product', (done) => {
    chai
      .request(server)
      .get(`/api/v1/products/${product.productId}`)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.productId).to.be.equal(product.productId);
        expect(res.body.data).to.have.all.keys(productKeys);

        done();
      });
  });

  it('Create a new product', (done) => {
    chai
      .request(server)
      .post(`/api/v1/products/admin`)
      .set({ Authorization: `Bearer ${token}` })
      .send(newProduct)
      .end((err, res) => {
        updateDeleteToken = res.body.token;
        expect(res.status).to.be.equal(201);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('object');
        expect(res.body.data).to.have.all.keys(productKeys);
        expect(res.body.data.productId.length).to.be.equal(36);

        done();
      });
  });

  it('Update a product', (done) => {
    chai
      .request(server)
      .put(`/api/v1/products/${newProduct.productId}/admin`)
      .set({ Authorization: `Bearer ${token}` })
      .send({ productName: 'Updated Product', price: 20.2 })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.productName).to.be.equal('Updated Product');
        expect(res.body.data.price).to.be.equal('20.2');

        done();
      });
  });

  it('Delete product', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/products/${newProduct.productId}/admin`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        const deletedCount = count - res.body.data;
        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.msg).to.include(newProduct.productId);
        expect(deletedCount).to.be.equal(5);

        done();
      });
  });
});
