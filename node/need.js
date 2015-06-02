/**
 * Queue Monitor
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

    var solutions = [];

    setInterval( function() {
      var needPacket = {
        "need": "car_rental_offer",
        "solutions": solutions
      };
      sendMessage(exchange, needPacket);
    }, 5000);
 })

});

connection.on('error', function() {
  console.log(arguments);
});