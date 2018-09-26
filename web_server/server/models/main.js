const mongoose = require('mongoose');

// 原来是写在app.js里面的，现在抽出来放在外面。
module.exports.connect = (uri) => {
    mongoose.connect(uri);


  mongoose.connection.on('error', (err) => {
    // console.error(`Mongoose connection error: $(err)`);
    console.error('Mongoose connection error: ', err);
    process.exit(1);
  });

  // load models
  require('./user');
}