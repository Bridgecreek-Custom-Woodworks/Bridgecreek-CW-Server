const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const Reviews = require('../models/Reviews');
const Product = require('../models/Product');
const { Op } = require('sequelize');
const {
  user,
  reviewKeys,
  review,
  product,
  singleReviewKeys,
  myReviewKeys,
  addReviewKeys,
  reviewedProduct,
} = require('./utils');

describe('REVIEW WORKFLOW TEST ==>', function () {
  beforeEach(async () => {
    productAvg = await Product.findOne({
      attributes: ['avgRating'],
      where: {
        productId: reviewedProduct.productId,
      },
    });

    count = await Reviews.count();
    productAvg = Number(productAvg.dataValues.avgRating);
  });

  let productAvg;
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
        expect(res.body.token.length).to.be.equal(192);

        done();
      });
  });

  it('Should get all reviews', (done) => {
    chai
      .request(server)
      .get('/api/v1/reviews/admin/allreviews')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        const { count, data } = res.body;

        expect(res.status).to.be.equal(200);
        expect(count).to.be.gte(5);
        expect(data).to.be.a('array');
        expect(data[0]).to.be.a('object');
        expect(data[0]).to.have.all.keys(reviewKeys);
        expect(data[0].Reviews.length).to.be.gte(1);
        expect(err).to.be.null;

        done();
      });
  });

  it('Should get a single review', (done) => {
    chai
      .request(server)
      .get(`/api/v1/reviews/product/review/${product.productId}`)
      .end((err, res) => {
        const { reviewId, Product } = res.body.data;
        const { data, success } = res.body;

        expect(res.status).to.be.equal(200);
        expect(success).to.be.true;
        expect(data).to.be.a('object');
        expect(data).to.have.all.keys(singleReviewKeys);
        expect(reviewId.length).to.be.equal(36);
        expect(Product.productId.length).to.be.equal(36);
        expect(err).to.be.null;

        done();
      });
  });

  it('Should get a single users reviews', (done) => {
    chai
      .request(server)
      .get('/api/v1/reviews/product/myreviews')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        const { success, data } = res.body;
        expect(res.status).to.be.equal(200);
        expect(success).to.be.true;
        expect(data).to.be.a('array');
        expect(data.length).to.be.gte(2);
        expect(data[0]).to.have.all.keys(myReviewKeys);
        expect(err).to.be.null;

        done();
      });
  });

  it('Should add a review to a product', (done) => {
    chai
      .request(server)
      .post(`/api/v1/reviews`)
      .set({ Authorization: `Bearer ${token}` })
      .send(review)
      .end((err, res) => {
        const { success, data } = res.body;
        const updatedCount = count + 1;

        expect(res.status).to.be.equal(200);
        expect(success).to.be.true;
        expect(data).to.be.a('object');
        expect(data).to.have.all.keys(addReviewKeys);
        expect(updatedCount).to.be.equal(6);
        expect(err).to.be.null;

        done();
      });
  });

  it('Should update a review', (done) => {
    chai
      .request(server)
      .put(`/api/v1/reviews/${review.productId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({ comments: 'Terrible Product', rating: 1 })
      .end((err, res) => {
        const { success, data } = res.body;

        expect(res.status).to.be.equal(200);
        expect(success).to.be.true;
        expect(data).to.be.a('array');
        expect(data.flat(Infinity)[1].comments).to.be.equal('Terrible Product');
        expect(data.flat(Infinity)[1].rating).to.be.equal(1);
        expect(productAvg).to.be.equal(3.67); // <== Average after the previous test case
        expect(err).to.be.null;

        done();
      });
  });

  it('Should delete a review', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/reviews/${review.productId}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        const { success, msg } = res.body;

        expect(res.status).to.be.equal(200);
        expect(success).to.be.true;
        expect(res.body).to.be.a('object');
        expect(res.body.count).to.be.equal(2);
        expect(productAvg).to.be.equal(2.33); // <== Average after the previous test case
        expect(msg).to.be.equal('Your review has been deleted');
        expect(err).to.be.null;
        done();
      });
  });
});
