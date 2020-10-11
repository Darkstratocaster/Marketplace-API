const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const server = require('../api');

const expect = chai.expect;
const apiAddress = 'http://localhost:3000';



describe('Item and user operations', function() {

    before(function() {
      server.start();
    });
  
    after(function() {
      server.stop();
    })
  
    describe('Read items', function() {
  
      it('Should respond with an array of items', async function() {
        await chai.request(apiAddress)
          .get('/items')
          .then(response => {
            expect(response.status).to.equal(200);
            expect(response.body).to.be.a('object');
            expect(response.body).to.have.a.property('items');
            expect(response.body.items).to.be.a('array');
            expect(response.body.items[0]).to.be.a('object');
            expect(response.body.items[0]).to.have.a.property('id');
            expect(response.body.items[0]).to.have.a.property('title');
            expect(response.body.items[0]).to.have.a.property('description');
            expect(response.body.items[0]).to.have.a.property('category');
            expect(response.body.items[0]).to.have.a.property('price');
            expect(response.body.items[0]).to.have.a.property('location');
            expect(response.body.items[0].location).to.be.a('object');
            expect(response.body.items[0]).location.to.have.a.property('city');
            expect(response.body.items[0]).location.to.have.a.property('country');
            expect(response.body.items[0]).to.have.a.property('deliveryType');
            expect(response.body.items[0].deliveryType).to.be.a('object');
            expect(response.body.items[0].deliveryType).to.have.a.property('shipping');
            expect(response.body.items[0].deliveryType).to.have.a.property('pickup');
            expect(response.body.items[0]).to.have.a.property('images');
            expect(response.body.items[0].images).to.have.a.property('image0');
            expect(response.body.items[0].images).to.have.a.property('image1');
            expect(response.body.items[0].images).to.have.a.property('image2');
            expect(response.body.items[0].images).to.have.a.property('image3');
            expect(response.body.items[0]).to.have.a.property('sellerInfo');
            expect(response.body.items[0].sellerInfo).to.be.a('object');
            expect(response.body.items[0].sellerInfo).to.have.a.property('name');
            expect(response.body.items[0].sellerInfo).to.have.a.property('email');

          })
          .catch(error => {
            expect.fail(error)
          })
      })
    });
  
  
    describe('Add a new item', function() {
      it('Should add a new item', async function() {
        await chai.request(apiAddress)
          .post('/items')
          .send({
            title: "Example title",
            description: "Example description",
            category: "Example category",
            price: "Example price",
            postingDate: "Example postingDate",
            location: {
              city: "Example city",
              country: "Example country"
            },
            deliveryType: {
              shipping: true,
              pickup: false
            },
            images: {
                image0: "Example image0",
                image1: "Example image1",
                image2: "Example image2",
                image3: "Example image3"
            },
            sellerInfo: {
                name: "Example name",
                email: "Example email"
            }
          })
          .then(response => {
            expect(response.status).to.equal(200);
            return chai.request(apiAddress).get('/items');
          })
          .then(readResponse => {
            expect(readResponse.body.items[readResponse.body.items.length - 1].title).to.equal("Example deviceType");
            expect(readResponse.body.items[readResponse.body.items.length - 1].description).to.equal("Example description");
            expect(readResponse.body.items[readResponse.body.items.length - 1].category).to.equal("Example category");
            expect(readResponse.body.items[readResponse.body.items.length - 1].price).to.equal("Example price");
            expect(readResponse.body.items[readResponse.body.items.length - 1].location.city).to.equal("Example city");
            expect(readResponse.body.items[readResponse.body.items.length - 1].location.country).to.equal("Example country");
            expect(readResponse.body.items[readResponse.body.items.length - 1].deliveryType.shipping).to.equal(true);
            expect(readResponse.body.items[readResponse.body.items.length - 1].deliveryType.pickup).to.equal(false);
            expect(readResponse.body.items[readResponse.body.items.length - 1].images.image0).to.equal("Example image0");
            expect(readResponse.body.items[readResponse.body.items.length - 1].images.image1).to.equal("Example image1");
            expect(readResponse.body.items[readResponse.body.items.length - 1].images.image2).to.equal("Example image2");
            expect(readResponse.body.items[readResponse.body.items.length - 1].images.image3).to.equal("Example image3");
            expect(readResponse.body.items[readResponse.body.items.length - 1].images.image3).to.equal("Example image3");
            expect(readResponse.body.items[readResponse.body.items.length - 1].sellerInfo.name).to.equal("Example name");
            expect(readResponse.body.items[readResponse.body.items.length - 1].sellerInfo.email).to.equal("Example email");
          })
          .catch(error => {
            expect.fail(error)
          })
      })
    })
  
  
  });