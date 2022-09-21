const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp);
const { sendTokenResponse } = require('../utils/tokenResponse');
const User = require('../models/User');

const userCredentials = {
  email: 'ottojones@gmail.com',
  password: 'admin1234',
};
describe('====> USER WORKFLOW TEST', function () {
  before(async () => {
    const user = await User.scope('withPassword').findOne({
      where: { email: 'ottojones@gmail.com' },
    });
    console.log(user);
  });
  it('Should log in user', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send(userCredentials)
      .end(function (err, response) {
        // console.log('Response ==>', response.body.data);

        let token = response.body.token;

        chai
          .request(server)
          .get('/api/v1/users/admin/allusers')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, response) => {
            // console.log('All Users ==>', response.body);
            done();
          });
      });
  });
});
