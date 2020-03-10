var client = require('./connection.js');
client.update({  
    index: 'company',
    type: '_doc',
    id: 'DVlskXAB33L1uuCJIu9F',
    body: {
        "script" : {
            "source": "ctx._source.member = params.member",
            "lang": "painless",
            "params" : {
                "member" : 1000
            }
        }
    }
  },function (error, response,status) {
      if (error){
        console.log("search error: "+error)
      }
      else {
        console.log(response);
      }
  });
POST /company/_update/DVlskXAB33L1uuCJIu9F
