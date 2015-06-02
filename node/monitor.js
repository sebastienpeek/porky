/**
 * Authors:
 * Piotr Rochala: @rochal / http://github.com/rochal
 * Sebastien Peek: @sebastienpeek
 */

var argv = require('minimist')(process.argv.slice(2));

var amqp = require('amqp');

var BUS_NAME = argv.b;
var HOST_NAME = argv.h;

var connection = amqp.createConnection({
  host: HOST_NAME,
  login: BUS_NAME,
  password: BUS_NAME,
  vhost: BUS_NAME
});

connection.on('ready', function () {
  connection.exchange("rapids", { type:'fanout', durable: true, autoDelete: false }, function(exchange) {

    // Recieve messages
    connection.queue("", function(queue){

      //console.log('Created queue');
      queue.bind(exchange, '');

      queue.subscribe(function (message) {

        //console.log('subscribed to queue');
        var encoded_payload = unescape(message.data);
        var payload = JSON.parse(encoded_payload);

        //console.log('Recieved a message:');
        console.log(payload);
      })
    });
 });
});

connection.on('error', function(e) {
  throw e;
});