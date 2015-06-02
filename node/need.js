/**
 * Need Pusher
 * Authors:
 * Piotr Rochala: @rochal / http://github.com/rochal
 * Sebastien Peek: @sebastienpeek
 */

var argv = require('minimist')(process.argv.slice(2));
var connection = new require('./connection')(argv);

connection.on('ready', function () {
  connection.exchange("rapids", { type:'fanout', durable: true, autoDelete: false }, function(exchange) {

    var sendMessage = function(exchange, payload) {
      //console.log('about to publish ');
      var encoded_payload = JSON.stringify(payload);
      exchange.publish('', encoded_payload, {});
    }

    setInterval( function() {
      var needPacket = new needPacket('./needPacket');
      sendMessage(exchange, needPacket.toJSON());
    }, 5000);
 })

});

connection.on('error', function() {
  console.log(arguments);
});