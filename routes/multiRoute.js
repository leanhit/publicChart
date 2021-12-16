var express = require('express');
var router = express.Router();
var dbManage = require('../public/javascripts/server/dbManage');


/* GET home page. */
router.get('/', function (req, res, next) {
  let arrPieces = req.baseUrl.split('/');
  const username = arrPieces[1].slice();
  console.log(req.baseUrl);
  let checkExitsUser = dbManage.checkExitsUser(username);
  checkExitsUser.catch((err) => {
    console.log(err);
  }).then((userExits) => {
    if (userExits) {      //user exits
      if (arrPieces.length === 2) {
        res.render('pages/users', { title: username });
      } else if (arrPieces.length === 3) {
        const boxName = arrPieces[2].slice();
        let checkExitsBox = dbManage.checkExitsBox(username, boxName);
        checkExitsBox.catch((err) => {
          console.log(err);
        }).then((boxExits) => {
          if (boxExits) {
            res.render('pages/box', { title: boxName });
          } else {

            res.send('This box do not exit');
          }
        });
      } else {
        res.send("writing...");
      }
    } else {

      res.send('This user do not exit');
    }
  });
});

module.exports = router;
