const app = require("./app.js");
const request = require("supertest")(app);
const expect = require("chai").expect;
const redis = require("redis");
const client = redis.createClient();

describe("API Stats", function() {
  describe("returns successful response defaults", function() {
    let response;
    let length;
    let num;

    before(function(done) {
      // clearning the db prior to testing
      client.flushall();
      //get the response to test
      request.get("/events/10/20").end(function(err, res) {
        response = res;
        //check the length of the list and store it to length variable
        client.llen(10, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            length = result;
          }
        });

        //check the first index and store it to num variable
        client.lrange(10, 0, 0, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            num = result;
          }
        });
        done();
      });
    });

    //check the the response status is 200
    it("status 200", function() {
      expect(response.status).to.equal(200);
    });
    // check that the response is an object
    it("is an object", function() {
      expect(typeof response.body === "object").to.be.true;
    });
    // check that lenght of the list is 1, to make sure one item was added
    it("added to list", function() {
      expect(length).to.equal(1);
    });
    //check the value of the first index to confirm the correct number was added
    it("added correct number to list", function() {
      expect(num[0]).to.equal("20");
    });
  });
});

describe("API", function() {
  describe("returns successful response defaults", function() {
    let response;

    before(function(done) {
      request.get("/events/10/stats").end(function(err, res) {
        response = res;
        done();
      });
    });
    // check that response is 200
    it("status 200", function() {
      expect(response.status).to.equal(200);
    });
    // check that the response is an object
    it("is an object", function() {
      expect(typeof response.body === "object").to.be.true;
    });
    //check that the object has the correct count, sum, avg, high, and low
    it("has a count", function() {
      expect(response.body.user).to.include({ count: 1 });
    });
    it("has a sum", function() {
      expect(response.body.user).to.include({ sum: 20 });
    });

    it("has a avg", function() {
      expect(response.body.user).to.include({ avg: 20 });
    });

    it("has a high", function() {
      expect(response.body.user).to.include({ high: 20 });
    });

    it("has a low", function() {
      expect(response.body.user).to.include({ low: 20 });
    });
  });
});
