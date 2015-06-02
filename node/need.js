var amqp = require('amqp');
var connection = amqp.createConnection({ url: "amqp://porky:porky@192.168.0.52/porky"});
var count = 1;

connection.on('ready', function () {
  connection.exchange("rapids", { type:'fanout', durable: true, autoDelete: false }, function(exchange) {

    var sendMessage = function(exchange, payload) {
      console.log('about to publish ');
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