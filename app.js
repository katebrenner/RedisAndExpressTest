//requiring dependencies
const app = require('express')();
const redis = require('redis');
const PORT = process.env.PORT || 3000;

//creating a new redis client
const client = redis.createClient();
//
client.on('error', function (err) {
    console.log("Error " + err);
});

app.get('/events/:USER_ID/stats', function(req,res) {
  //get USER_ID from params and store for later use
  let user = req.params.USER_ID
  //getting all members of set
  client.smembers(user , function (err, replies) {
    //if there is no error....
    if(!err){
      //the below code will iterate over the response and add up each number
      let num = 0
      replies.forEach(el => {
        num = num + parseInt(el);
      })
      //the below code will obtain the maximum number in the replies
      let max = replies.reduce(function(a, b) {
        return Math.max(a, b);
      });
      //the below code will obtain the minimum number in the replies
      let min = replies.reduce(function(a, b) {
        return Math.min(a, b);
      });
      //obtaining the average by deviding the total number by the length
      average = num/replies.length;
      console.log(replies.length);
      console.log(max);
      //sending all the above information to the client
      res.send({user: {count: replies.length, avg: average, sum: num, high: max, low: min}})
    }
  });
});

app.get('/events/:USER_ID/:VALUE', function(req, res) {
  // get the USER_ID and VALUE from params and store for later use
  let value = req.params.VALUE
  let user = req.params.USER_ID
  //add the value to the user's set
  client.get(user, value, function(error, result) {
    client.sadd(user, value);
    res.send({});
  });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
