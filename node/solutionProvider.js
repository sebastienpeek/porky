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

        var solution = {
          "weight" : Math.floor(Math.random() * 10) + 1
        };

        needPacket.proposeSolution(solution);

        console.log(needPacket.stringify());

        // var sendMessage = function(exchange, payload) {
        //   console.log('About to publish: ', payload);
        //   exchange.publish('', payload, {});
        // }

        // setInterval( function() {
        //   console.log('Provider providing: ', needPacket.stringify());
        //   sendMessage(exchange, needPacket.stringify());
        // }, 2000);

      })
    });
 });
});

connection.on('error', function(e) {
  throw e;
});