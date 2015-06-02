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
          console.log('Packet with solutions:', needPacket.getMessage());

          if (!SOLUTIONS[needPacket._id]) {
            SOLUTIONS[needPacket._id] = [];
          } else {
            SOLUTIONS[needPacket._id].push(needPacket);
          }
        }

        console.log('Recieved a message:', needPacket);
      });
    });
 });
});

connection.on('error', function(e) {
  throw e;
});

function getBestSolution(solutions) {
  return _.max(solutions, function(s){
    return s.weight;
  });
}


setInterval(function(){
  console.log('Checking best solutions...');

  _.each(SOLUTIONS, function(solutionsPerNeed) {

    var bestOne = getBestSolution(solutionsPerNeed);

    console.log('Found best one which is #', bestOne.weight, 'out of', _.pluck(solutionsPerNeed, 'weight'));

  });

}, 5000);