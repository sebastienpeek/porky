/**
 * Solution Provider
 * Authors:
 * Piotr Rochala: @rochal / http://github.com/rochal
 * Sebastien Peek: @sebastienpeek
 */

var argv = require('minimist')(process.argv.slice(2));
var connection = new require('./connection')(argv);

connection.on('ready', function () {
  console.log('Connected to queue...')
  connection.exchange("rapids", { type:'fanout', durable: true, autoDelete: false }, function(exchange) {

    // Recieve messages
    connection.queue("", function(queue){

      //console.log('Created queue');
      queue.bind(exchange, '');

      queue.subscribe(function (message) {

        //console.log('subscribed to queue');
        var encoded_payload = unescape(message.data);
        var payload = JSON.parse(encoded_payload);

        var needPacket = new require('./needPacket')(payload);

        if (!needPacket.hasSolutions()) {

          var solution = {
            "weight" : Math.floor(Math.random() * 100) + 1,
            "description" :  "Porky is life"
          };

          needPacket.proposeSolution(solution);
          exchange.publish('', needPacket.stringify());

        };
      })
    });
 });
});

connection.on('error', function(e) {
  throw e;
});