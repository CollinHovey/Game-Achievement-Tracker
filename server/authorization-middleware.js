const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');

function authorizationMiddleware(req, res, next) {

  const token = JSON.parse(req.get('x-access-token'));

  // console.log('token', token);
  // console.log('secret', process.env.TOKEN_SECRET);
  if (!token) {
    throw new ClientError(401, 'authentication required');
  }
  const payload = jwt.verify(token, process.env.TOKEN_SECRET);
  // console.log('auth payload', payload);
  req.user = payload;
  next();
}

module.exports = authorizationMiddleware;
