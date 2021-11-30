const MongoClient = require('mongodb').MongoClient;
var jwt = require('jsonwebtoken');
var defineVal = require('./defineValue');

const scretKeyToken = 'thisisscretkeyoftoken1';
const scretKeyFreshToken = 'thisisscritkerofrefreshtoken';
const tokenLife = 24*60*60; // 1 day
const refreshTokenlife = 30*24*60*60;//1 month

function decodeToken(jwtoken){  
  // decode token
  return new Promise(function(resolve, reject){
      jwt.verify(jwtoken, scretKeyToken, function(err, decoded){      
        if (err) {
          reject(err);
        } else {
          resolve(decoded);          
        }
      });  
  });
}

function decodeRefreshToken(jwtoken){
  // decode token
  return new Promise(function(resolve, reject){
    jwt.verify(jwtoken, scretKeyFreshToken, (err, decoded) =>{      
      if (err) {
        console.log(err);
        reject(err);
      } else {
        //console.log(decoded);
        resolve(decoded);       
      }
    });  
});
}

function encodeToken(usname){    
  const payload = {
      username: usname
    };

    var token = jwt.sign(payload, scretKeyToken, {
      expiresIn: tokenLife
    });

    return token;
}

function encodeRefreshToken(usname, psword){    
  const payloadRT = {
      password: psword,
      username: usname
    };

    var token = jwt.sign(payloadRT, scretKeyFreshToken, {
      expiresIn: refreshTokenlife
    });

    return token;
}

function saveRefreshToken(username, refreshToken){
    MongoClient.connect(defineVal.baseUrl, function(err, db){
        if (err) {
            throw (err);
        } else {                 
            const dbName = defineVal.dbUser + username;      
            var dbo = db.db(dbName);                 
            var newToken = {
              refreshToken: refreshToken,
              created: new Date()
            };
            dbo.collection(defineVal.refreshTokenCollection).insertOne(newToken, function(err, res) {
                if (err){
                    throw (err);
                }else{
                    console.log("new refresh token inserted to database of: " + username);     
                }
                db.close();
            });                
        }
    });

} 

function getRefreshToken(usname){
  return new Promise((resolve, reject) => {
    MongoClient.connect(defineVal.baseUrl,  function(err, db){
      if (err) {
          reject(err);
      } 
      else {
        const dbName = defineVal.dbUser + usname;      
        var dbo = db.db(dbName);       
          dbo.collection(defineVal.refreshTokenCollection).findOne({}, function(err, user){
              if (err) {
                  reject(err);
              } 
              else {
                  resolve(user?.refreshToken);
                  //resolve(user);
              }              
              db.close();
          });
        }
        
    });
  });
}

module.exports = {
  scretKeyToken: scretKeyToken,
  scretKeyFreshToken: scretKeyFreshToken,
  tokenLife: tokenLife,
  refreshTokenlife: refreshTokenlife,

  encodeToken: encodeToken,
  decodeToken: decodeToken,
  encodeRefreshToken: encodeRefreshToken,
  decodeRefreshToken:decodeRefreshToken,

  saveRefreshToken: saveRefreshToken,
  getRefreshToken: getRefreshToken



}
