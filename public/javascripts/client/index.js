
    let usname = "";
    let psword = "";

window.onload = function(){
    //deleteCookie("jwtoken");
    function loginByCookie(){
        if(!getCookie("gruu-username")){
            document.getElementById("divLogin").style.display = "block";
        }
        else{
            //load cookie
            var usernameCookie = getCookie("gruu-username");
            var passwordCookie = getCookie("gruu-password-" + usernameCookie);

            socket.emit('userLogin', {
                username: usernameCookie,
                password: passwordCookie
            });            
        }
    }
    //get token from cookie
    if(getCookie('jwtoken')){
        socket.emit('userLoginJwt', getCookie('jwtoken'));

        socket.on('userLoginJwtResult', function(data){
            if(data == invalidResult){
                loginByCookie();
            }
        })
    }else{
        loginByCookie();        
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
    
    switch (result){
        case loginInvalidUsername:
            alert("Invalid username");
            deleteCookie("gruu-username");
            break;
        case loginInvalidPassword:
            alert("Invalid password");
            deleteCookie("gruu-username");
            break;
        case jwtExpired:
            alert("Token is expired");
            document.getElementById("divLogin").style.display = "block";
        default:
            //stick my nickname
            socket.username = usname;
            //write cookie
            var usernameCookie = "gruu-username";
            var passwordCookie = "gruu-password-" + psword;

            setCookie(usernameCookie, usname, "3600");
            setCookie(passwordCookie, psword, "3600");

            
            
    }
});

socket.on('jwtResult', function(token){
    setCookie('jwtoken', token, "2000");
    console.log("write jwt token");
});