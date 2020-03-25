if (city === "all"){
    client.search({  
      index: 'job',
      type: '_doc',
      body: {
        query: {
          multi_match : {
            query:    planets, 
            fields: [ "namejob", "skills" ] 
          }
        }
      }
    },function (error, response,status) {
        if (error){
          console.log("search error: "+error)
        }
        else {
        const results = response.hits.hits;
        const numlist =response.hits.total.value;
        res.render('vieclamit', {
          title: 'Việc làm IT',
          dsjob: results.slice(start,end) ,
          namejob: planets,
          where: '',
          num: numlist,
          pages: Math.ceil(numlist / perPage),
          current: page
        });
        }
    });
  }else if (city === "Orthers"){
    client.search({  
      index: 'job',
      type: '_doc',
      body: {
        "query": {
          "bool" : {
            "must" : {
               "multi_match" : {
                        "query":    skills, 
                        "fields": [ "namejob", "skills" ] 
                      }
            },
             "must_not" : [{
                  "match" : {  "address" : "Ho Chi Minh" }
              },
              {
                  "match" : {  "address" : "Ha Noi" }
              },{
                  "match" : {  "address" : "Can Tho" }
              }
              ]
          }
        }
      }
    },function (error, response,status) {
        if (error){
          console.log("search error: "+error)
        }
        else {
        const results = response.hits.hits;
        const numlist =response.hits.total.value;
        res.render('vieclamit', {
          title: 'Việc làm IT',
          dsjob: results.slice(start,end) ,
          namejob: skills,
          where: '',
          num: numlist,
          pages: Math.ceil(numlist / perPage),
          current: page
        });
        }
    });
  }else{
      client.search({  
        index: 'job',
        type: '_doc',
        body: {
          query: {
            bool: {
              must: [{
                bool: {
                  must: [{
                      match: {
                        address : city
                      }
                  }]
                }
              },{
                bool: {
                  should: [{
                      match: {
                        skills: planets
                    }
                  }, {
                    match: {
                      namejob: planets
                    }
                  }]
                }
              }]
            }
          }
        }
      },function (error, response,status) {
          if (error){
            console.log("search error: "+error)
          }
          else {
          const results = response.hits.hits;
          const numlist =response.hits.total.value;
          res.render('vieclamit', {
            title: 'Việc làm IT',
            dsjob: results.slice(start,end) ,
            num: numlist,
            namejob: planets,
            where: 'tại '+city,
            pages: Math.ceil(numlist / perPage),
            current: page
          });
          }
      });
  }