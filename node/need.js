/**
 * Need Pusher
 * Authors:
 * Piotr Rochala: @rochal / http://github.com/rochal
 * Sebastien Peek: @sebastienpeek / http://github.com/the0rkus
 */

var argv = require('minimist')(process.argv.slice(2));
var connection = new require('./connection')(argv);

connection.on('ready', function () {
  connection.exchange("rapids", { type:'fanout', durable: true, autoDelete: false }, function(exchange) {

    var sendMessage = function(exchange, payload) {
      console.log('About to publish: ', payload);
      exchange.publish('', payload, {});
    }

    setInterval( function() {
      var needPacket = new require('./needPacket')();
      sendMessage(exchange, needPacket.stringify());
    }, 2000);
 })

});

connection.on('error', function() {
  console.log(arguments);
});