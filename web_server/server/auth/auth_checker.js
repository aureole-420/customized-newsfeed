const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const config = require('../config/config.json');

module.exports = (req, res, next) => {
  console.log('auth_checker: req: ' + req.headers);

  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];

  console.log('auth_checker: token: ' + token);

  // decode the token using a secret key-phrase
  return jwt.verify(token, config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { 
        console.error('unauthorized get request ', 'red');
        return res.status(401).end(); 
    }

    // 解码出来的就是mongodb的_id!!!
    const id = decoded.sub;

    // check if a user exists
    return User.findById(id, (userErr, user) => {
      if (userErr || !user) {
        console.error(`[server.auth.auth_checker] user $(id) doesn't exist!`);
        return res.status(401).end();
      }

      return next();
    });
  });
};