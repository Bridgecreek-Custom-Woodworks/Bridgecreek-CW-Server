const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const { user } = require('./utils');

describe(' STRIPE PAYMENT WORKFLOW TEST ===>', function () {
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

  it('Should return stripe url', (done) => {
    chai
      .request(server)
      .post('/api/v1/stripe/checkout')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        items: [{ id: 'price_1LzQVOEUecojPOrFWCGby9KH', quantity: 1 }],
        orderId: '76e35ec6-de02-432a-aa01-e58703d407f6',
        cartId: 'e4e71f3b-6523-4c97-980e-2c80be8dc352',
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.text).to.be.a('string');
        expect(err).to.be.null;

        done();
      });
  });
});
