var argv = require('minimist')(process.argv.slice(2));
var connection = new require('./connection')(argv);

var solutionDictionary = { "Tier 1": {
                            "weight": Math.floor(Math.random() * 100) + 1,
                            "description": "This is all just a fantasy."
                           }, 
                           "Tier 2": {
                            "weight": Math.floor(Math.random() * 100) + 1,
                            "description": "When does life become the unknown?"
                           }, 
                           "Platinum": {
                            "weight": Math.floor(Math.random() * 100) + 1,
                            "description": "Where do we go after life?"
                           },
                           "Gold": {
                            "weight": Math.floor(Math.random() * 100) + 1,
                            "description": "How does when disappear when one is still a solid?"
                           },
                           "VIP": {
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

        if (!needPacket.hasSolutions() && needPacket.membership_level) {
            var solution = membershipSolutionDictionary[needPacket.membership_level];
            needPacket.proposeSolution(solution);
            console.log(needPacket.stringify());
            exchange.publish('', needPacket.stringify());
        };
      })
    });
 });
});

connection.on('error', function(e) {
  throw e;
});