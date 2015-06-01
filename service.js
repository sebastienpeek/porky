
var amqp = require('amqplib');
var _ = require('lodash');

var queue_size = 100;

amqp.connect('amqp://porky:porky@192.168.0.52:15672/porky').then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {

    var ok = ch.assertQueue('');

    ok = ok.then(function(myqueue) {
      return ch.consume('', function(msg) {
        console.log(" [x] Received '%s'", msg.content.toString());

        var parsed = JSON.parse(msg.content.toString());

        // push to local queue
        if (queue.length < queue_size) {
          queue.push(parsed);
        } else {
          // push whats currently there into ES
          pushToES(queue);
          // reset queue
          queue = [];
        }


      }, {noAck: true});
    });

    return ok.then(function(_consumeOk) {
      console.log(' [*] Waiting for messages. To exit press CTRL+C');
    });
  });
}).then(null, console.warn);
