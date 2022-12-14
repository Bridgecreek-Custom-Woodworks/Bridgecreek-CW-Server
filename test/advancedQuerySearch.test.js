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

describe('ADVANCED SEARCH QUERY WORKFLOW TEST ==>', function () {
  let token;
  let adminToken;

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

  it('Should log in admin', (done) => {
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

  it('Check Pagination', (done) => {
    chai
      .request(server)
      .get('/api/v1/users/admin/allusers?page=2&limit=2')
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        const { pagination } = res.body;

        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.count).to.be.equal(2);
        expect(pagination.next.page).to.be.equal(3);
        expect(pagination.prev.page).to.be.equal(1);
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
      .set({ Authorization: `Bearer ${adminToken}` })
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
      .get('/api/v1/users/admin/allusers?order[]=firstName,desc')
      .set({ Authorization: `Bearer ${adminToken}` })
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

  it('Check if include query returns all model associations', (done) => {
    chai
      .request(server)
      .get('/api/v1/users/admin/allusers?include=true')
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        const { data } = res.body;

        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(data[0]).to.have.any.keys('Products');
        expect(data[0]).to.have.any.keys('Reviews');
        expect(data[0]).to.have.any.keys('CartOrderAccess');
        expect(data[0]).to.have.any.keys('Wishlist');
        expect(err).to.be.null;

        done();
      });
  });

  it('Check if field (Key) query returns correct results', (done) => {
    chai
      .request(server)
      .get('/api/v1/users/admin/allusers?firstName=Mike')
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data[0].firstName).to.be.equal('Mike');
        expect(err).to.be.null;

        done();
      });
  });

  it('Check if price gte query returns correct data', (done) => {
    chai
      .request(server)
      .get('/api/v1/products/allproducts?pricegte=40')
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

  it('Check if price lte query returns correct data', (done) => {
    chai
      .request(server)
      .get('/api/v1/products/allproducts?pricelte=40')
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

  it('Check if weight gte query returns correct data', (done) => {
    chai
      .request(server)
      .get('/api/v1/products/allproducts?weightgte=10')
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

  it('Check if weight lte query returns correct data', (done) => {
    chai
      .request(server)
      .get('/api/v1/products/allproducts?weightlte=10')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data.length).to.be.gte(2);
        expect(Number(res.body.data[0].weight)).to.be.lte(10);
        expect(Number(res.body.data[1].weight)).to.be.lte(10);
        expect(err).to.be.null;

        done();
      });
  });

  it('Check if avg rating gte query returns correct data', (done) => {
    chai
      .request(server)
      .get('/api/v1/products/allproducts?avgRatinggte=4')
      .set({ Autorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data.length).to.be.gte(2);
        expect(Number(res.body.data[0].avgRating)).to.be.gte(4);
        expect(Number(res.body.data[1].avgRating)).to.be.gte(4);
        expect(err).to.be.null;

        done();
      });
  });

  it('Check if avg rating lte query returns correct data', (done) => {
    chai
      .request(server)
      .get('/api/v1/products/allproducts?avgRatinglte=2')
      .set({ Autorization: `Bearer ${token}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data.length).to.be.gte(2);
        expect(Number(res.body.data[0].avgRating)).to.be.lte(2);
        expect(Number(res.body.data[1].avgRating)).to.be.lte(2);
        expect(err).to.be.null;

        done();
      });
  });

  it('Check if rating gte query returns correct data', (done) => {
    chai
      .request(server)
      .get('/api/v1/reviews/admin/allreviews?ratinggte=5')
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data.length).to.be.gte(2);
        expect(Number(res.body.data[0].rating)).to.be.gte(5);
        expect(Number(res.body.data[1].rating)).to.be.gte(5);
        expect(err).to.be.null;

        done();
      });
  });

  it('Check if rating lte query returns correct data', (done) => {
    chai
      .request(server)
      .get('/api/v1/reviews/admin/allreviews?ratinglte=4')
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data.length).to.be.gte(3);
        expect(Number(res.body.data[0].rating)).to.be.lte(4);
        expect(Number(res.body.data[1].rating)).to.be.lte(4);
        expect(err).to.be.null;

        done();
      });
  });

  it('Check if total gte query returns correct data', (done) => {
    chai
      .request(server)
      .get('/api/v1/carts/admin/allcarts?totalgte=280')
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data.length).to.be.gte(1);
        expect(Number(res.body.data[0].total)).to.be.gte(285.29);
        expect(err).to.be.null;

        done();
      });
  });

  it('Check if total lte query returns correct data', (done) => {
    chai
      .request(server)
      .get('/api/v1/carts/admin/allcarts?totallte=300')
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data.length).to.be.gte(2);
        expect(Number(res.body.data[0].total)).to.be.lte(300);
        expect(err).to.be.null;

        done();
      });
  });

  it('Check if all selected model associations are returned with query', (done) => {
    chai
      .request(server)
      .get(
        '/api/v1/users/admin/allusers?include=model,products,reviews,wishlist,cartorderaccess'
      )
      .set({ Authorization: `Bearer ${adminToken}` })
      .end((err, res) => {
        const { data } = res.body;

        expect(res.status).to.be.equal(200);
        expect(res.body.data).to.be.a('array');
        expect(data[0]).to.have.any.keys('Products');
        expect(data[0].Products[0]).to.have.any.keys('Wishlists');
        expect(data[0]).to.have.any.keys('CartOrderAccess');
        expect(data[0]).to.have.any.keys('Reviews');
        expect(err).to.be.null;

        done();
      });
  });
});
