window.onload = function () {
    autoLogin();
}


socket.on('userLoginResult', (result) => {
    loadPublicHTMLelement();
  
    let loginStatus = result.loginStatus;
  
    if (loginStatus === validResult) {
      let username = result.username;
      socket.username = username;
      aTopbarUsername.textContent = username;
  
      eventOpenPage(aTopbarUsername, username);  
      selectTopbarRight(true);
    } else {
        if(loginStatus === jwtExpired){
            alert("Token is exprired");
        }
      selectTopbarRight(false);
    }
  });

/*---------------------code of topbar block ------------------*/
getPositionClick();