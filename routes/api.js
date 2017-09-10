var express = require('express');
var router = express.Router();
var https = require('https');
require('dotenv').config();
var ImgSearch = require('../db');

//Mongoose stuff
var mongoose = require('mongoose');
mongoose.connect(process.env.DBURL, {useMongoClient: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

router.get('/:query', function(req, res, next){
    var offset = req.query.offst ? req.query.offst : 0;
    var resultCount = 10;
    
    //Prepare query
    var doc = {
        query: req.params.query
    };
    var newQuery = new ImgSearch(doc);
    
    var options = {
    hostname: 'api.cognitive.microsoft.com',
    path: '/bing/v5.0/images/search?q='+req.params.query+'&mkt=en-us'+'&count='+resultCount+'&offset='+offset,
    method: 'GET',
    headers: {
        'Ocp-Apim-Subscription-Key': process.env.APIKEY
        }
    }
    
    var requ = https.request(options, function(resp){
        console.log("status", res.statusCode);
        let rawData = '';
        
        resp.on('data', function(data){
            rawData += data;
        });
        
        resp.on('end', function(){
            var jsonData = JSON.parse(rawData);
            var resultObjects = [];
           
            for(var i = 0; i < jsonData.value.length; i++){
                /*objects are referenced when pushed to an array, so create a new one
                for each iteration */
            let resultObject = {}; 
            console.log(jsonData.value[i]);
            console.log("\nREPETISI KE"+i+"\n");
            resultObject['snippet'] = jsonData.value[i].name;
            resultObject['url'] = jsonData.value[i].contentUrl;
            resultObject['context'] = jsonData.value[i].hostPageUrl;
            resultObject['thumbnail'] = jsonData.value[i].thumbnailUrl;
                
            resultObjects.push(resultObject);   
            }
            //Save query
            newQuery.save(function (err, doc){
                if (err) console.log(err);

                console.log(doc);
            });
            res.write(JSON.stringify(resultObjects));  
            res.end();
        });
        
    });
    
    requ.end();
})

module.exports = router;

