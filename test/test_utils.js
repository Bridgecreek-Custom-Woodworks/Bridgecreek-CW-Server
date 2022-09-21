const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp);

const loginUser = async () => {
  const userPayload = {
    email: 'ottojones@gmail.com',
    password: 'admin1234',
  };
  return chai
    .request(server)
    .post('/api/v1/auth/login')
    .send(userPayload)
    .end(function (err, response) {
      // console.log('Response ==>', response.body.data);

      let user = response.body.token;
    });
};

module.exports = {
  loginUser,
};
