const MongoClient = require('mongodb').MongoClient;
var defineVal = require('./defineValue');

function checkExitsUser(username){
    return new Promise((resolve, reject) => {
        MongoClient.connect(defineVal.baseUrl, function(err, db){
            if (err) {
                reject(err);
            } else {                    
                var dbo = db.db(defineVal.dbAllUser);
                dbo.collection(defineVal.userColection).findOne({username: username}, function(err, user){                  
                    if (err) {
                        reject(err);
                    } else {
                        if (user == null) {                      
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                        db.close();
                    }
                });  
            } 
        });
    });
}

function checkExitsBox(username, boxName){
    return new Promise( function(resolve, reject){
        MongoClient.connect(defineVal.baseUrl, function(err, db){
            if (err) {
                reject( err);
            } else {                 
                const dbName = defineVal.dbUser + username;      
                var dbo = db.db(dbName);
                dbo.collection(defineVal.boxListsColection).findOne({pandoraBox:boxName} ,function(err, pBox) {
                    if (err) reject(err);
                    else {
                        if (pBox == null) {  //can't find myName in chat list of userName           
                          resolve(false);
                        } else {//find out
                          resolve(true);
                        }
                    }       

                    db.close();
                }); 
                
            }
        });
    });
}

function insertBoxToLists(username, boxName){
    MongoClient.connect(defineVal.baseUrl, function(err, db){
        if (err) {
            throw (err);
        } else {                 
            const dbName = dbUser + username;      
            var dbo = db.db(dbName);                 
            var newBox = {
                pandoraBox: boxName,
                created: new Date()
            };
            dbo.collection(defineVal.boxListsColection).insertOne(newBox, function(err, res) {
                if (err){
                    throw (err);
                }else{
                    console.log("1 boxName inserted to " + username + " boxLists");
                    
                    db.close();
                    //resolve(newAlert._id);
                }
            });                
        }
    });
}

function insertBox(){

}

module.exports = {
    checkExitsUser: checkExitsUser,
    checkExitsBox: checkExitsBox,
    insertBox: insertBox,
    insertBoxToLists: insertBoxToLists
}