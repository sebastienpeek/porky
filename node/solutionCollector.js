/**
 * Solution Colector
 * Authors:
 * Piotr Rochala: @rochal / http://github.com/rochal
 * Sebastien Peek: @sebastienpeek
 */

var argv = require('minimist')(process.argv.slice(2));
var connection = new require('./connection')(argv);

var _ = require('lodash');

var SOLUTIONS = {};

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

        if (needPacket.hasSolutions()) {
          var packet = needPacket.getMessage();
          //console.log('Packet with solutions:', packet);

          if (!SOLUTIONS[packet.id]) {
            SOLUTIONS[packet.id] = packet;
          } else {
            SOLUTIONS[packet.id].solutions = _.merge(SOLUTIONS[packet.id].solutions, packet.solutions)
          }
        }

      });
    });

    function getBestSolution(packet) {
      var bestSolution = _.max(packet.solutions, function(b){ return b.weight; });
      packet.solutions = [bestSolution];
      return packet;
    }

    setInterval(function(){

      _.each(SOLUTIONS, function(packet) {

        console.log('Finding best solutions out of', packet.solutions.length, 'weights are', _.pluck(packet.solutions, 'weight'));
        var bestOne = getBestSolution(packet);
        bestOne.ultimate_solution = true;
        console.log('Found best one with weight: ', bestOne.solutions[0].weight);

        var sendMessage = function(exchange, payload) {
          //console.log('About to publish: ', payload);
          exchange.publish('', payload, {});
        }

        var needPacket = new require('./needPacket')(bestOne);
        sendMessage(exchange, needPacket.stringify());

      });

    }, 5000);


 });
});

connection.on('error', function(e) {
  throw e;
});
