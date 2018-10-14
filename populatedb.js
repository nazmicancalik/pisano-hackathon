#! /usr/bin/env node

console.log('This script populates nodes to the database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

var async = require('async')
var Node = require('./models/node')

var mongoose = require('mongoose');
var mongoDB = 'mongodb://exbibyte:exbibyte2018@ds131373.mlab.com:31373/paperwork'
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var nodes = [];

function nodeCreate(name, node_type, description,dependencies, hints, instutition, related_links, conditions, cb) {
  nodeDetail = { 
    name: name,
    nodeType: nodeType,
    description: description,
    dependencies: dependencies,
    hints: hints,
    instutition: instutition,
    related_links: related_links,
    conditions: conditions
  }
  
  var node = new Node(nodeDetail);

  node.save(function (err) {
    if (err) {
      cb(err, null)
      return;
    }
    console.log('New node: ' + node);
    nodes.push(node)
    cb(null, node)
  });
}

function createNodes(cb) {
    async.parallel([
        function(callback) {
          nodeCreate('Pasaport', 'document', '' ,[], [], {}, [], [], callback);
        },
        function(callback) {
          nodeCreate('Teslimat', 'document', 'Pasaportunuz başvuru esnasında belirttiğiniz adrese kurye veya kargo ile gönderiliyor. Devlet randevu gününden sonra 5-7 iş günü içinde elinizde olacağını taahhüt ediyor.' ,[], ['Pasaport kaç günde elinize ulaşır? Bordo pasaportların evinize ulaşması başvurudan sonra 10 gün kadar alabilir. Şimdiye kadar bize her zaman başvurudan sonraki 3. iş gününde teslimatı gerçekleşti ama devletin taahhüt ettiği süre,  5-7 iş günü basım + 3 gün kargo/ kurye olarak 10 gün. Bu süreler yoğunluğa göre değişebiliyor. Özellikle bayram, resmi tatil, yılbaşı, sömestr gibi dönemler en yoğun dönemler. Bu yoğun dönemlerde süreler uzayabilir. ','Hint 2', 'Hint 3'], [], [], [], callback);
        },
        function(callback) {
          nodeCreate('Randevu Al', 'action', 'Randevu  $$1 adresinden alınıyor. Aynı zamanda 09:00- 18:00 saatleri arasında +90 312 462 91 46 ve 47’yi Acil Pasaport hattını arayarak da yapabilirsiniz',[], ['Hint 1','Hint 2', 'Hint 3'], { name: 'İl Nüfus ve İlçe Emniyet Müdürlüğü', description: ''}, [{name: 'Randevu Portalı', href:'https://randevu.nvi.gov.tr/#/nvi/anasayfa'}], [], callback);
        },
        function(callback) {
            nodeCreate('Nüfus Cüzdanı', 'document', '2 adet',[], [], {}, [], [], callback);
        },
        function(callback) {
            nodeCreate('Eski pasaportlar', 'document', '',[], [], {}, [], ["Eski pasaportun varsa"], callback);
        },
        function(callback) {
            nodeCreate('Pasaport Harcı ve Passport Bedeli Dekontları', 'document', '',[], [], {}, [], [], callback);
        },
        function(callback) {
            nodeCreate('Muvafakatname', 'document', '',[], [], {}, [], ['Eğer reşit değilsen'], callback);
        }],
        // optional callback
        cb);
}

async.series([
    createNodes
],

// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Nodes: '+ 'nodes here');
    }

    // All done, disconnect from database
    mongoose.connection.close();
});


