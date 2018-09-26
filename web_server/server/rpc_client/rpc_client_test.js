var client = require('./rpc_client');

// invoke 'add'
// 第三个param就是之前定义的callback函数
client.add(1,2, function(result) {
  console.assert(result === 3);
});

// invoke 'getNewsSummariesForUser', 会被newsCard.sendClickLog远程调用。
client.getNewsSummariesForUser('test_user', 1, function(response) {
  console.assert(response != null);
});

// invoke 'logClickForUser'
client.logNewsClickForUser('test_user', 'test_news');