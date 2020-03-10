var elasticsearch=require('elasticsearch');

var client = new elasticsearch.Client( {  
  hosts: [
    'root:@localhost:9200/',
    'root:@localhost:9200/',
  ]
});

module.exports = client;  
