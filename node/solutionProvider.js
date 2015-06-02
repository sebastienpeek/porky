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

var membershipSolutionDictionary = { 1: {
                            "weight": Math.floor(Math.random() * 100) + 1,
                            "description": "This is all just a fantasy."
                           }, 
                           2: {
                            "weight": Math.floor(Math.random() * 100) + 1,
                            "description": "When does life become the unknown?"
                           }, 
                           3: {
                            "weight": Math.floor(Math.random() * 100) + 1,
                            "description": "Where do we go after life?"
                           },
                           4: {
                            "weight": Math.floor(Math.random() * 100) + 1,
                            "description": "How does when disappear when one is still a solid?"
                           },
                           5: {
                            "weight": Math.floor(Math.random() * 100) + 1,
                            "description": "Top tier, you sir/ma'am, deserve a medal of recognition."
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

        if (!needPacket.hasSolutions()) {

          if (!needPacket.membership_level) {
            var key = Math.floor(Math.random() * 5) + 1;
            var solution = solutionDictionary[key];
            needPacket.proposeSolution(solution);
            exchange.publish('', needPacket.stringify());
          } else {
            var solution;
            if (needPacket.membership_level == "Tier 1") {
              solution = membershipSolutionDictionary[1];
            } else if (needPacket.membership_level == "Tier 2") {
              solution = membershipSolutionDictionary[2];
            } else if (needPacket.membership_level == "Platinum") {
              solution = membershipSolutionDictionary[3];
            } else if (needPacket.membership_level == "Gold") {
              solution = membershipSolutionDictionary[4];
            } else if (needPacket.membership_level == "VIP") {
              solution = membershipSolutionDictionary[5];
            }
            needPacket.proposeSolution(solution);
            exchange.publish('', needPacket.stringify());
          };
        };
      })
    });
 });
});

connection.on('error', function(e) {
  throw e;
});