var express = require('express');
var router = express.Router();
var dbManage = require('../../public/javascripts/server/dbManage');


function splitString(pathBase){
  let arrPieces = [];

  const pathlength = pathBase.length;  
  let tempString = '';

  for(var i = 0; i <= pathlength; i++){
    let aChar;
    if(i < pathlength){
      aChar = pathBase[i].slice();
    }      
          
    if((aChar === '/') || i == pathlength){
      if(i > 0){
        arrPieces.push(tempString);
        tempString = '';
      }      
    }else{
      tempString += aChar;
    }
  }    
  
  return arrPieces;
}
/* GET home page. */
router.get('/', function(req, res, next) {
  let pathBase = req.baseUrl;
  
  let arrPieces = splitString(pathBase);
  const username = arrPieces[0].slice();
  let checkExitsUser = dbManage.checkExitsUser(username);
  checkExitsUser.catch((err)=>{
    console.log(err);
  }).then((userExits)=>{
    if(userExits){      //user exits
      if(arrPieces.length == 1){              
        res.render('users/userPage', { title: username });
      }else if(arrPieces.length == 2){
        const boxName = arrPieces[1].slice();
        let checkExitsBox = dbManage.checkExitsBox(username, boxName);
        checkExitsBox.catch((err)=>{
          console.log(err);
        }).then((boxExits) =>{
          if(boxExits){            
            res.render('users/boxPage', { title: boxName });
          }else{
            
            res.send('This box do not exit');
          }
        });
      }else{
        res.send("writing...");
      }
    }else{
      
      res.send('This user do not exit');
    }
  });


  













});

module.exports = router;
