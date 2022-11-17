const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const Products = require('../models/Product');
const fs = require('fs');

const {
  user,
  newAuthProduct,
  newProduct,
  badToken,
  unauthorizedUser,
} = require('./utils');
const { set } = require('../server');

describe.only('AUTH MIDDLEWARE WORKFLOW TEST ==>', function () {
  after(async () => {
    await Products.destroy({
      where: {
        productId: newProduct.productId,
      },
    });
  });

  let imageBuffer = fs.readFileSync(
    'test/test_images/Chopping-board-thickness-1-e1644318713641.jpeg'
  );

  let adminToken;
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
      .set('Cookie', `token=` + JSON.stringify(adminToken))
      .set('Content-Type', 'multipart/form-data')
      .field('productId', '5a4e4574-9455-4b02-ac26-6467f5e5d333')
      .field('productName', 'New Auth Product')
      .field('price', '119.00')
      .field('discount', 0.1)
      .field('weight', 24)
      .field('dementions', '1.5ft X 2ft')
      .field('description', 'Some new auth product description')
      .field('url', 'foo@bar.com')
      .field('createdAt', '2022-09-01T21:43:17.243Z')
      .field('updatedAt', '2022-09-01T21:43:17.243Z')
      .attach(
        'image',
        fs.readFileSync(
          'test/test_images/Chopping-board-thickness-1-e1644318713641.jpeg'
        )
      )
      .end((err, res) => {
        // console.log(err);
        // console.log(res.body);
        expect(res.status).to.be.equal(201);
        expect(res.body.success).to.be.true;

        done();
      });
  });

  // it('Verify if Bearer token isnt present, the token is set to req.cookie.token', (done) => {
  //   chai
  //     .request(server)
  //     .post(`/api/v1/products/admin`)
  //     .set('Cookie', `token=` + JSON.stringify(adminToken))
  //     .send(newAuthProduct)
  //     .end((err, res) => {
  //       expect(res.status).to.be.equal(201);
  //       expect(res.body.success).to.be.true;

  //       done();
  //     });
  // });

  it('Check if there is no token', (done) => {
    chai
      .request(server)
      .post(`/api/v1/products/admin`)
      .send(newAuthProduct)
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
        expect(res.body.error).to.be.equal(
          'Not authorized to access this route'
        );
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
        expect(res.status).to.be.equal(401);
        expect(res).to.have.a.property('error');

        done();
      });
  });
});
