const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const Products = require('../models/Product');
const { user, newProduct, badToken, unauthorizedUser } = require('./utils');

describe('AUTH MIDDLEWARE WORKFLOW TEST ==>', function () {
  after(async () => {
    await Products.destroy({
      where: {
        productId: newProduct.productId,
      },
    });
  });

  let token;
  let unauthorizedUserToken;

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

  it('Set unauthorized user token', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({
        email: unauthorizedUser.email,
        password: unauthorizedUser.password,
      })
      .end(function (err, res) {
        unauthorizedUserToken = res.body.token;
        expect(res.status).to.be.equal(200);

        done();
      });
  });

  it('Verify if Bearer token isnt present, the token is set to req.cookie.token', (done) => {
    chai
      .request(server)
      .post(`/api/v1/products/admin`)
      .set('Cookie', `token=` + JSON.stringify(token))
      .send(newProduct)
      .end((err, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.body.success).to.be.true;

        done();
      });
  });

  it('Check if there is no token', (done) => {
    chai
      .request(server)
      .post(`/api/v1/products/admin`)
      .send(newProduct)
      .end((err, res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body.success).to.be.false;

        done();
      });
  });

  it('Check for bad token', (done) => {
    chai
      .request(server)
      .get('/api/v1/users/getme')
      .set({ Authorization: `Bearer ${badToken}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body.success).to.be.false;
        done();
      });
  });

  it('Update a product', (done) => {
    chai
      .request(server)
      .post(`/api/v1/products/admin`)
      .set({ Authorization: `Bearer ${unauthorizedUserToken}` })
      .send(newProduct)
      .end((err, res) => {
        expect(res.status).to.be.equal(403);
        expect(res).to.have.a.property('error');

        done();
      });
  });
});
