/**
 * Membership Provider
 * Authors:
 * Piotr Rochala: @rochal / http://github.com/rochal
 * Sebastien Peek: @sebastienpeek
 */

var argv = require('minimist')(process.argv.slice(2));
var connection = new require('./connection')(argv);

var membership_levels = ["Tier 1", "Tier 2", "Platinum", "Gold", "VIP"];

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

        if (payload.user_id && 
          payload.solutions.length < 1 
          && !payload.membership_level) {

          payload.membership_level = membership_levels[payload.user_id - 1];
          var needPacket = new require('./needPacket')(payload);

          exchange.publish('', needPacket.stringify());

        };
      });
    });
 });
});

connection.on('error', function(e) {
  throw e;
});