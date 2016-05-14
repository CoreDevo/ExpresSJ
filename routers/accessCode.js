var express = require('express');
var mongo = require('mongodb').MongoClient;
var mongoService = require('../modules/mongo-service');
var router = express.Router();
var proomURL = 'mongodb://localhost:27017/PrivateRooms';

router.post('/generateAccessCode', function (req, res) {
    var accessCode = randomBasic();
    var ifExist = true;

    mongo.connect(proomURL, function(err, db) {
        if(err) {
            console.log(err);
            return;
        }
        while(ifExist) {
            db.listCollections({_id: accessCode}).toArray(function (err, items) {
                if (items.length !== 0) {
                    console.log('Re-generatng access code');
                    accessCode = randomBasic();
                } else {
                    ifExist = false;
                    res.send({accessCode: accessCode});
                    mongoService.createPrivateRoom(accessCode, console.log);
                }
            });
        }
    });
});

function randomBasic() {
    return Math.floor(Math.random() * 6) + 1;
}

module.exports = router;
