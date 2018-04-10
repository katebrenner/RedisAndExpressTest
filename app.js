//requiring dependencies
const app = require("express")();
const redis = require("redis");
const PORT = process.env.PORT || 3000;

// const { PORT=3000, NODE_ENV='development', DB_PATH='./db/database.db' } = process.env;

//creating a new redis client
const client = redis.createClient();
//
client.on("error", function(err) {
  console.log("Error " + err);
});

app.get("/events/:USER_ID/stats", function(req, res) {
  //get USER_ID from params and store for later use
  let user = req.params.USER_ID;
  //getting all elements of list
  client.lrange(user, 0, -1, function(err, replies) {
    //if there is no error....
    if (!err) {
      //the below code will iterate over the response and add up each number
      if (replies) {
        let num = 0;
        replies.forEach(el => {
          num = num + parseInt(el);
        });
        //the below code will obtain the maximum number in the replies
        let max = replies.reduce(function(a, b) {
          return Math.max(a, b);
        });
        //the below code will obtain the minimum number in the replies
        let min = replies.reduce(function(a, b) {
          return Math.min(a, b);
        });
        //obtaining the average by deviding the total number by the length
        average = num / replies.length;
        console.log(replies.length);
        console.log(max);
        //sending all the above information to the client
        res.send({ user: { count: replies.length, avg: average, sum: num, high: max, low: min } });
      } else {
        res.send({});
      }
    } else {
      res.send("error");
    }
  });
});

app.get("/events/:USER_ID/:VALUE", function(req, res) {
  // get the USER_ID and VALUE from params and store for later use
  let value = req.params.VALUE;
  let user = req.params.USER_ID;
  //add the value to the user's set
  client.get(user, value, function(error, result) {
    // console.log(!isNaN(user));
    console.log(user);
    if (!isNaN(value) && !isNaN(user)) {
      // client.watch(user, value);
      // console.log(client.multi);
      client.lpush(user, value);
      // client.exec;
      res.send({});
    } else {
      res.send({});
    }
  });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

module.exports = app;
