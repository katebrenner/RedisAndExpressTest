
Build a webapp that exposes the following API endpoints-

GET /events/USER_ID/VALUE
returns {}
NOTES: create the USER_ID if it doesn't exist yet, records value for use in later stats calls

GET /events/USER_ID/stats
returns {USER_ID: {count: 0, avg: 0, sum: 0, high: 0, low: 0}}

From scratch, this series of requests:
 /events/10/100
 /events/10/50
 /events/99/3
 /events/10/150
 /events/10/stats

should return
{10: {count: 3, avg: 100, sum: 300, high: 150, low: 50}

This is pretty easy so far- the complicated part is that I would like you to use redis as the data store, and write a full unit test suite. Feel free to use either rails or express (or flask or django really). When writing your code, give careful condition to what happens if multiple copies of your app are all trying to update the same key at the same time.

Good luck, and I hope to hear from you soon!


// Get request returns nothing until the last param is stats
GET /events/USER_ID/VALUE
returns {}
  need to store the value -- maybe a hash?
  store the user id and the VALUE

returns {USER_ID: {count: 0, avg: 0, sum: 0, high: 0, low: 0}}

count is how many values are stored for that user
avg is avg value that is stored for that user
sum is sum of all values
high is highest value in list and low is lowest value in list

what is best data type to use?
