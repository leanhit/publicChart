window.onload = function(){
    //get token from cookie
    if(getCookie('jwtoken')){
        socket.emit('userLoginJwt', getCookie('jwtoken'));      
        
    }else{
    }
}

function login(){
    usname = document.getElementById("inUsername").value;
    psword = document.getElementById("inPassword").value;
    
    socket.emit('userLogin', {
        username: usname,
        password: psword
    });
}

socket.on('userLoginResult', (result) =>{
    let loginStatus = result.loginStatus;
    let username = result.username;

    switch (loginStatus){
        case loginInvalidUsername:
            alert("Invalid username");
            break;
        case loginInvalidPassword:
            alert("Invalid password");
            break;
        case jwtExpired:
            alert("Token is expired");
            document.getElementById("divLogin").style.display = "block";
        default: 
            socket.username = username;           
            openPage('/');
      }
});

