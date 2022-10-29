const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const Guests = require('../models/Guests');
const { user, guestKeys } = require('./utils');

describe('GUEST WORKFLOW TEST ===>', function () {
  this.beforeEach(async () => {
    count = await Guests.count();
  });

  let adminToken;
  let token;
  let count;
  let guestToken;
  let guestId;

  it('Set User Token', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: user.password })
      .end((err, res) => {
        token = res.body.token;

        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a('object');
        expect(err).to.be.equal(null);
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

  it('Should get all guest', (done) => {
    chai
      .request(server)
      .get('/api/v1/guests/admin/allguests')
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.count).to.be.equal(5);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(err).to.be.null;

        done();
      });
  });
  it('Create a new guest', (done) => {
    chai
      .request(server)
      .post('/api/v1/guests')
      .send() // Nothing needs to be sent in the body to create a new guest
      .end((err, res) => {
        let {
          activeStatus,
          role,
          cartOrderAccessId,
          guestId: id,
        } = res.body.data;

        guestToken = res.body.token;
        guestId = id;

        const addedGuestCount = count + 1;

        expect(res.status).to.be.equal(201);
        expect(res.body.data).to.be.an('object');
        expect(activeStatus).to.be.equal('active');
        expect(role).to.be.equal('guest');
        expect(cartOrderAccessId).to.be.a('string');
        expect(addedGuestCount).to.be.equal(6);
        expect(res.body.data).to.have.all.keys(guestKeys);
        expect(err).to.be.null;

        done();
      });
  });

  it('Get single guest by token', (done) => {
    chai
      .request(server)
      .get('/api/v1/guests/getme')
      .set({ Authorization: `Bearer ${guestToken}` })
      .end((err, res) => {
        let { cartOrderAccessId, customerId, userName, Guests } = res.body.data;

        customerId = customerId.split('-');
        customerId = customerId[4];

        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('object');
        expect(cartOrderAccessId).to.be.a('string');
        expect(Guests[0]).to.be.an('object');
        expect(Guests[0].activeStatus).to.be.equal('active');
        expect(userName).to.be.equal(`Guest ${customerId}`);
        expect(err).to.be.null;

        done();
      });
  });

  it('Update a guest', (done) => {
    chai
      .request(server)
      .put(`/api/v1/guests/update/${guestId}`)
      .set({ Authorization: `Bearer ${guestToken}` })
      .send({ activeStatus: 'not active' })
      .end((err, res) => {
        const { activeStatus, guestName } = res.body.data[1][0];

        let id = guestId.split('-');
        id = id[4];

        expect(res.status).to.be.equal(200);
        expect(res.body.data[1][0]).to.be.an('object');
        expect(res.body.data[1][0]).to.have.all.keys(guestKeys);
        expect(activeStatus).to.be.equal('not active');
        expect(guestName).to.include(`Guest ${id}`);
        expect(err).to.be.null;

        done();
      });
  });

  it('Verify error if incorrect guestId is passed (Update)', (done) => {
    chai
      .request(server)
      .put(`/api/v1/guests/update/ea4af0f0-5668-45e9-a76f-803439c55e40`)
      .set({ Authorization: `Bearer ${guestToken}` })
      .send()
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body.success).to.be.false;
        expect(res.body.error).to.be.equal(
          'Guest with id ea4af0f0-5668-45e9-a76f-803439c55e40 was not found'
        );
        expect(err).to.be.null;

        done();
      });
  });

  it('Verify error if incorrect guestId is passed (Delete)', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/guests/delete/ea4af0f0-5668-45e9-a76f-803439c55e40`)
      .set({ Authorization: `Bearer ${guestToken}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body.success).to.be.false;
        expect(res.body.error).to.be.equal(
          'Guest with id ea4af0f0-5668-45e9-a76f-803439c55e40 was not found'
        );
        expect(err).to.be.null;

        done();
      });
  });

  it('Delete a single guest', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/guests/delete/${guestId}`)
      .set({ Authorization: `Bearer ${guestToken}` })
      .end((err, res) => {
        const deletedGuestCount = count - res.body.data;
        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(deletedGuestCount).to.be.equal(5);
        expect(res.body.data).to.be.equal(1);
        expect(err).to.be.null;

        done();
      });
  });
});
