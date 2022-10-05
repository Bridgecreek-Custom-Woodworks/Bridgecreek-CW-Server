const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const Wishlist = require('../models/Wishlist');
const { user, wishlistKeys, newWishlistItem } = require('./utils');

describe('WISHLIST WORKFLOW TEST ==>', function () {
  this.beforeEach(async () => {
    count = await Wishlist.count({
      where: {
        userId: user.userId,
      },
    });
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

  it('Should get all wishlist', (done) => {
    chai
      .request(server)
      .get('/api/v1/wishlist/admin/allwishlist')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.count).to.be.gte(5);
        expect(res.body.data[0].userId).to.be.a('string');
        expect(res.body.data[0].productId).to.be.a('string');
        expect(err).to.be.null;

        done();
      });
  });

  it('Should get a single wishlist', (done) => {
    chai
      .request(server)
      .get('/api/v1/wishlist/mywishlist')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        const { Wishlists } = res.body.data[0].Products[0];

        expect(res.status).to.be.equal(200);
        expect(Wishlists).to.be.a('object');
        expect(Wishlists).to.have.all.keys(wishlistKeys);
        expect(err).to.be.null;

        done();
      });
  });

  it('Create a new wishlist item', (done) => {
    chai
      .request(server)
      .post('/api/v1/wishlist/mywishlist')
      .set({ Authorization: `Bearer ${token}` })
      .send(newWishlistItem)
      .end((err, res) => {
        const { userId, productId } = res.body.data;

        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('object');
        expect(userId).to.be.a('string');
        expect(productId).to.be.a('string');
        expect(userId).to.be.equal(user.userId);
        expect(productId).to.be.equal(newWishlistItem.productId);
        expect(err).to.be.null;

        done();
      });
  });

  it('Delete wishlist item', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/wishlist/mywishlist/${newWishlistItem.productId}`)
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        const deletedCount = count - res.body.data;

        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.msg).to.include(newWishlistItem.productId);
        expect(deletedCount).to.be.equal(2);
        expect(err).to.be.null;

        done();
      });
  });
});
