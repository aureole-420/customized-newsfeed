// https://www.npmjs.com/package/jayson

var jayson = require('jayson');

// create a client
var client = jayson.client.http({
  port: 4040, // 只有server才会运行在一个端口，rpcclient是连结到该。。。
  hostname: 'localhost'
});

// invoke "add"
// 把rpc的调用给wrap起来了
function add(a, b, callback) {

  // ‘add’ should match the name that exposed by server
  // [a, b] has order
  client.request('add', [a, b], function(err, response) {
    // error is the error from RPC server
    // e.g., a or b is invlaid number to add
    if(err) throw err;
    console.log(response.result); // 2

    callback(response.result);//做更多的事
  });
}

// Get news summaries for a user.
function getNewsSummariesForUser(user_id, page_num, callback) {
  client.request('getNewsSummariesForUser', [user_id, page_num], function(err, response) {
    if(err) throw err;
    console.log(response.result);
    callback(response.result);
  });
}

//log a news click event for a user
function logNewsClickForUser(user_id, news_id) {
  client.request('logNewsClickForUser', [user_id, news_id],
    function(err, response) {
      if (err) throw err;
      // do not need to handle the response
      console.log(response);
    });
}

// client.request('add', [1, 1], function(err, response) {
//   if(err) throw err;
//   console.log(response.result); // 2
// });

module.exports = {
  add : add,
  getNewsSummariesForUser : getNewsSummariesForUser,
  logNewsClickForUser : logNewsClickForUser
}
