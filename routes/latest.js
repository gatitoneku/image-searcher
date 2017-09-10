var express = require('express');
var router = express.Router();
var ImgSearch = require('../db');

//Mongoose stuff
var mongoose = require('mongoose');
mongoose.connect(process.env.DBURL, {useMongoClient: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

router.get('/', function(req, res, next){

    ImgSearch.find({})
        .sort({"time": -1})
        .limit(10)
        .select({"_id": 0,
                "query": 1,
                 "time": 1        
        })
        .exec(function(err, imgsrc) {
        if (err) console.log(err);
        res.send(imgsrc);
        console.log(imgsrc);
    })
    
});

module.exports = router;