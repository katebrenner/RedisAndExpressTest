//requiring dependencies
const app = require("express")();
const redis = require("redis");
const PORT = process.env.PORT || 3000;
//creating a new redis client
const client = redis.createClient();

client.on("error", function(err) {
  console.log("Error " + err);
});

app.get("/events/:USER_ID/stats", function(req, res) {
  //get USER_ID from params and store for later use
  let user = req.params.USER_ID;
  //getting all elements of list
  client.lrange(user, 0, -1, function(err, replies) {
//if there is an error
    if (err) {
      res.send(err)
    }
    //if there is no error....
    else {
      //the below code will iterate over the response and add up each number
      if (replies.length) {
        console.log(replies);
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
        //sending all the above information to the client
        res.send({ user: { count: replies.length, avg: average, sum: num, high: parseInt(max), low: parseInt(min) } });
      } else {
        res.send({});
      }
    }
  });
});

app.get("/events/:USER_ID/:VALUE", function(req, res) {
  // get the USER_ID and VALUE from params and store for later use
  let value = req.params.VALUE;
  let user = req.params.USER_ID;
  //add the value to the user's list
  client.get(user, value, function(error, result) {
    // console.log(user);
    //make sure that value and user are numbers, so that a string , ie "hello" wont get added if it is entered in the URL
    if (!isNaN(value) && !isNaN(user)) {
      //watch to make sure that "a request issued by another client is served in the middle of the execution of a Redis transaction" https://redis.io/topics/transactions
      client.watch(user, value);
      client.MULTI();
      client.lpush(user, value);
      client.exec();
      res.send({});
    } else {
      res.send({});
    }
  });
});

app.get("/*", function(req,res) {
res.status(404).send("try again");
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

module.exports = app;
