var session = require('express-session');

module.exports = {
  port: 3000,
  session: {
    secret: 'hotelM',
    key: 'hotelM',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/hotelM'
}