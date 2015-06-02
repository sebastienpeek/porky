/**
 * Solution Provider
 * Authors:
 * Piotr Rochala: @rochal / http://github.com/rochal
 * Sebastien Peek: @sebastienpeek
 */

var argv = require('minimist')(process.argv.slice(2));
var connection = new require('./connection')(argv);

var solutionDictionary = { 1: {
                            "weight": Math.floor(Math.random() * 100) + 1,
                            "description": "Is this real life?"
                           }, 
                           2: {
                            "weight": Math.floor(Math.random() * 100) + 1,
                            "description": "Where do I belong?"
                           }, 
                           3: {
                            "weight": Math.floor(Math.random() * 100) + 1,
                            "description": "Are feet just shoes?"
                           },
                           4: {
                            "weight": Math.floor(Math.random() * 100) + 1,
                            "description": "Life is life."
                           },
                           5: {
                            "weight": Math.floor(Math.random() * 100) + 1,
                            "description": "Node.js is love."
                           },
                           6: {
                            "weight": Math.floor(Math.random() * 100) + 1,
                            "description": "iOS is life."
                           }  
                         };

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
        
        if (!needPacket.hasSolutions() && !needPacket.membership_level) {
          var key = Math.floor(Math.random() * 5) + 1;
          var solution = solutionDictionary[key];
          
          needPacket.tickHop();
          needPacket.touch('node.js Solution Provider');
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