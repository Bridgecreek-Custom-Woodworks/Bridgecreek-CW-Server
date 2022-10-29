const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const Admins = require('../models/Admin');
const { user, newAdmin, adminKeys } = require('./utils');

describe('ADMIN WORKFLOW TEST ===>', function () {
  this.beforeEach(async () => {
    count = await Admins.count();
  });

  let token;
  let adminToken;
  let count;
  let newAdminId;

  it('Set Token', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .end((err, res) => {
        token = res.body.token;

        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a('object');
        expect(err).to.be.null;

        done();
      });
  });

  it('Login and Set Admin Token', (done) => {
    chai
      .request(server)
      .post('/api/v1/admin/login')
      .send({
        email: 'ottosjonesjr@gmail.com',
        password: 'admin1234',
      })
      .end((err, res) => {
        adminToken = res.body.token;

        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a('object');
        expect(err).to.be.null;

        done();
      });
  });

  it('Log out admin', (done) => {
    chai
      .request(server)
      .post('/api/v1/admin/logout')
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        const adminId = res.body.msg.split(' ');

        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.msg).to.be.a('string');
        expect(adminId[5].length).to.be.equal(36);
        expect(err).to.be.null;

        done();
      });
  });

  it('Should get all admin', (done) => {
    chai
      .request(server)
      .get('/api/v1/admin/alladmins')
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data.length).to.be.gte(2);
        expect(err).to.be.null;

        done();
      });
  });

  it('Should get a single admin', (done) => {
    chai
      .request(server)
      .get('/api/v1/admin/getme')
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.adminId).to.be.equal(
          'ecc8850b-b490-49c4-8593-828878eaf285'
        );
        expect(err).to.be.null;

        done();
      });
  });

  it('Create a new admin', (done) => {
    chai
      .request(server)
      .post('/api/v1/admin')
      .set({ Authorization: `Bearer ${adminToken}` })
      .send(newAdmin)
      .end((err, res) => {
        newAdminId = res.body.data.adminId;
        let addedAdminCount = count + 1;

        expect(res.status).to.be.equal(201);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.password.length).to.be.equal(60);
        expect(res.body.data.email).to.include('@');
        expect(res.body.data.email).to.include(['.com']);
        expect(addedAdminCount).to.be.equal(3);
        expect(res.body.data).to.have.all.keys(adminKeys);
        expect(err).to.be.null;

        done();
      });
  });

  it('Update admin', (done) => {
    chai
      .request(server)
      .put(`/api/v1/admin/update/${newAdminId}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({ lastName: 'Johnson' })
      .end((err, res) => {
        const { lastName } = res.body.data[1][0];

        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data[1][0]).to.be.an('object');
        expect(lastName).to.be.equal('Johnson');
        expect(err).to.be.null;

        done();
      });
  });

  it('Check if user password is stored salted and hashed ', async () => {
    const savedUser = await Admins.scope('withPassword').findOne({
      where: { adminId: newAdminId },
    });

    expect(savedUser.dataValues.password.length).to.be.equal(60);
  });

  it('Delete a admin', (done) => {
    chai
      .request(server)
      .delete(`/api/v1/admin/delete/${newAdminId}`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        let deletedAdminCount = count - 1;

        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(deletedAdminCount).to.be.equal(2);
        expect(err).to.be.null;

        done();
      });
  });

  it('Get cart by id', (done) => {
    chai
      .request(server)
      .get(`/api/v1/admin/cart/e4e71f3b-6523-4c97-980e-2c80be8dc352`)
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('object');
        expect(err).to.be.null;

        done();
      });
  });

  it('Get guest by id', (done) => {
    chai
      .request(server)
      .get('/api/v1/admin/guest/0cb63ee4-8a2c-4b12-8bf4-9f6766470ca1')
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('object');
        expect(err).to.be.null;

        done();
      });
  });

  it('Get user by id', (done) => {
    chai
      .request(server)
      .get('/api/v1/admin/user/15242016-6385-4ef3-9c9a-0ec1bf595515')
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('object');
        expect(err).to.be.null;

        done();
      });
  });

  it('Verify update password', (done) => {
    chai
      .request(server)
      .put('/api/v1/admin/updatepassword')
      .set({ Authorization: `Bearer ${adminToken}` })
      .send({
        newPassword: 'admin4321',
        newPassword2: 'admin4321',
        currentPassword: 'admin1234',
      })
      .end((err, res) => {
        const oldPassword = 'admin1234';
        const newPassword = res.body.data.password;

        expect(res.status).to.be.equal(200);
        expect(res.body.success).to.be.true;
        expect(res.body).to.not.have.property('error');
        expect(oldPassword).to.not.be.equal(newPassword);

        expect(err).to.be.null;

        // Setting password back to original password
        chai
          .request(server)
          .put('/api/v1/admin/updatepassword')
          .set({ Authorization: `Bearer ${adminToken}` })
          .send({
            newPassword: 'admin1234',
            newPassword2: 'admin1234',
            currentPassword: 'admin4321',
          })
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body.success).to.be.true;
            done();
          });
      });
  });
});
