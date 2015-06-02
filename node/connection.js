
var amqp = require('amqp');

module.exports = function(argv) {
  var BUS_NAME = argv && argv.b || 'porky';
  var HOST_NAME = argv && argv.h || '192.168.0.52';
  return amqp.createConnection({
    host: HOST_NAME,
    login: BUS_NAME,
    password: BUS_NAME,
    vhost: BUS_NAME
  });
};
