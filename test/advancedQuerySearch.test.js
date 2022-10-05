const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../server');
const {
  user,
  advancedQuerySearchKeys,
  getFirstLetterOfFirstName,
} = require('./utils');

describe.only('ADVANCED SEARCH QUERY WORKFLOW TEST ==>', function () {
  let token;

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

  it('Check Pagination', (done) => {
    chai
      .request(server)
      .get('/api/v1/users/admin/allusers?page=2&limit=2')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        const { pagination } = res.body;

        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.count).to.be.equal(2);
        expect(res.body.data[0].firstName).to.be.equal('Jordan');
        expect(pagination.next.page).to.be.equal(3);
        expect(pagination.next.limit).to.be.equal(2);
        expect(err).to.be.null;

        done();
      });
  });
  it('Check if Attributes query are selected correctly', (done) => {
    chai
      .request(server)
      .get(
        '/api/v1/users/admin/allusers?attributes[]=firstName,lastName,cellPhone'
      )
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        const paginationObj = res.body.pagination;
        const paginationSize = Object.keys(paginationObj).length;

        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.count).to.be.equal(5);
        expect(res.body.data[0]).to.have.all.keys(advancedQuerySearchKeys);
        expect(paginationSize).to.be.equal(0);
        expect(err).to.be.null;

        done();
      });
  });

  it('Check if Order query is ordered correctly', (done) => {
    chai
      .request(server)
      .get('/api/v1/admin/allusers?order[]=firstName,desc')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        const descOrder = ['S', 'O', 'M', 'J', 'D'];

        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.count).to.be.equal(5);
        expect(
          getFirstLetterOfFirstName(res.body.data)
        ).to.have.ordered.members(descOrder);
        expect(err).to.be.null;

        done();
      });
  });

  it('Check if Inlude query returns model associations', (done) => {
    chai
      .request(server)
      .get('/api/v1/admin/allusers?include=true')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        const { data } = res.body;

        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(data[0]).to.have.any.keys('Products');
        expect(data[0]).to.have.any.keys('Reviews');
        expect(data[0]).to.have.any.keys('Cart');
        expect(data[0]).to.have.any.keys('Wishlist');
        expect(err).to.be.null;

        done();
      });
  });

  it('Check if Field (Key) query returns correct results', (done) => {
    chai
      .request(server)
      .get('/api/v1/admin/allusers?firstName=Mike')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data[0].firstName).to.be.equal('Mike');
        expect(err).to.be.null;

        console.log(res.body);
        done();
      });
  });

  it('Check if Price gte query returns correct data', (done) => {
    chai
      .request(server)
      .get('/api/v1/products?pricegte=40')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data.length).to.be.gte(2);
        expect(Number(res.body.data[0].price)).to.be.gt(40);
        expect(Number(res.body.data[1].price)).to.be.gt(40);
        expect(err).to.be.null;

        done();
      });
  });

  it('Check if Price lte query returns correct data', (done) => {
    chai
      .request(server)
      .get('/api/v1/products?pricelte=40')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data.length).to.be.gte(2);
        expect(Number(res.body.data[0].price)).to.be.lt(40);
        expect(Number(res.body.data[1].price)).to.be.lt(40);
        expect(err).to.be.null;

        done();
      });
  });

  it('Check if Weight gte query returns correct data', (done) => {
    chai
      .request(server)
      .get('/api/v1/products?weightgte=10')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data.length).to.be.gte(2);
        expect(Number(res.body.data[0].weight)).to.be.gte(10);
        expect(Number(res.body.data[1].weight)).to.be.gte(10);
        expect(err).to.be.null;

        done();
      });
  });

  it('Check if Weight lte query returns correct data', (done) => {
    chai
      .request(server)
      .get('/api/v1/products?weightlte=10')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data.length).to.be.gte(2);
        expect(Number(res.body.data[0].weight)).to.be.lte(10);
        expect(Number(res.body.data[1].weight)).to.be.lte(10);
        expect(err).to.be.null;

        console.log(res.body);
        done();
      });
  });

  it.skip('Check if Rating gte query returns correct data', (done) => {
    chai
      .request(server)
      .get()
      .set()
      .end((err, res) => {
        console.log(res.body);
        done();
      });
  });

  it.skip('Check if Rating lte query returns correct data', (done) => {
    chai
      .request(server)
      .get()
      .set()
      .end((err, res) => {
        console.log(res.body);
        done();
      });
  });

  it.skip('Check if Total gte query returns correct data', (done) => {
    chai
      .request(server)
      .get()
      .set()
      .end((err, res) => {
        console.log(res.body);
        done();
      });
  });

  it.skip('Check if Total lte query returns correct data', (done) => {
    chai
      .request(server)
      .get()
      .set()
      .end((err, res) => {
        console.log(res.body);
        done();
      });
  });
});
