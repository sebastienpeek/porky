
var amqp = require('amqplib');
var elasticsearch = require('elasticsearch');
var _ = require('lodash');

var client = new elasticsearch.Client({
  host: 'idctjpocapp001.tj.svc.sb.int:9200',
  log: 'trace'
});

var queue = [];
var queue_size = 100;

amqp.connect('amqp://piotrr:sports99@idctjpocapp001.tj.svc.sb.int:5672/myvhost').then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {

    var ok = ch.assertQueue('myqueue');

    ok = ok.then(function(myqueue) {
      return ch.consume('myqueue', function(msg) {
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

// pushToES([

// { ev_oc_id: 167022400,
//   status: 'S',
//   displayed: 'Y',
//   result: 'L',
//   result_conf: 'Y',
//   lp_num: 40000,
//   lp_den: 1000,
//   settled: 'Y',
//   desc: '|Half Time Score| |Cd Suchitepequez| 2-0 - |Full Time Score| |Cd Suchitepequez| 2-0' },
// { ev_oc_id: 167022401,
//   status: 'S',
//   displayed: 'Y',
//   result: 'L',
//   result_conf: 'Y',
//   lp_num: 500000,
//   lp_den: 1000,
//   settled: 'Y',
//   desc: '|Half Time Score| |CSD Municipal| 2-0 - |Full Time Score| |CSD Municipal| 5-1' }

// ]);

function pushToES(data) {

  console.log('pushing to ES', data);

  var request = [];
  _.map(data, function(item){
    request.push({ update: { _index: 'all_outcomes', _type: 'all_outcomes', _id: item.ev_oc_id } });
    request.push({ doc: item, "doc_as_upsert" : true });
  });

  client.bulk({
    body: request
  }, function (err, resp) {
    if (!err) {
      console.log('Updated 100 rows...');
    } else {
      console.warn(err);
    }
  });
}
