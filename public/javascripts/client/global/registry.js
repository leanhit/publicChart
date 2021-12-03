window.onload = function(){
    //get token from cookie
    if(getCookie('jwtoken')){
        socket.emit('userLoginJwt', getCookie('jwtoken'));      
    }else{
        //do nothing
    }
    
    setTimeout(()=>{    
        usernameElement = document.getElementById("inUsername");
        passwordElement = document.getElementById("inPassword");
        repswordElement = document.getElementById("inRepsword");
        
        imgUsernameElement = document.getElementById("imgValidUsname");
        imgPasswordElement = document.getElementById("imgValidPassword");
        imgRepswordElement = document.getElementById("imgValidRepsword");
    }, 1000);    
}

const validChar = "abcdefghijklmnopqrstuvwxyz123457890_";
const invalidCheckPath = "/image/registry/invalid.png";
const validCheckPath = "/image/registry/valid.png";

let usernameElement ;
let passwordElement ;
let repswordElement ;

let imgUsernameElement ;
let imgPasswordElement ;
let imgRepswordElement ;

let username = '';
let password = '';
let repsword = '';

let isUsnameOk = false;
let isPswordOk = false;
let isRepswdOk = false;

function checkValidUsername(username){
    if(username.length >= 5 && username.length <= 16){
        for(var i =0; i < username.length; i++){      
            let aChar = username[i].slice();        
            if(checkChar(aChar)){
                //do nothing
            }else{
                return isUsnameOk = false;               
            }
        }
        return isUsnameOk = true;        
    }else{
        return isUsnameOk = false;
    }
}

function checkChar(aChar){
    if (validChar.indexOf(aChar) > -1)
        return true;
    else 
        return false;
}

function charPress(){  
    username = usernameElement.value;    
    
    if(checkValidUsername(username)){
        imgUsernameElement.src = validCheckPath;
    }else{
        imgUsernameElement.src = invalidCheckPath;
    }
        //        let aChar = String.fromCharCode(event.keyCode);    
}   

function pswdPress(){  
    password = passwordElement.value;
    
    if(password.length >=8 && password.length <=16){
        isPswordOk = true;
        imgPasswordElement.src = validCheckPath;
    }else{
        isPswordOk = false;
        imgPasswordElement.src = invalidCheckPath;
    }
}   

function rpwdPress(){  
    repsword = repswordElement.value;
    
    if((repsword === password) && isPswordOk){
        isRepswdOk = true;
        imgRepswordElement.src = validCheckPath;
    }else{
        isRepswdOk = false;
        imgRepswordElement.src = invalidCheckPath;
    }
}   

function registry(){
    if(isUsnameOk){
        if(isPswordOk){
            if(isRepswdOk){
                const loginInfo = {
                    username: username,
                    password: password
                }
                socket.emit("registryUser", loginInfo);
            }else {
                alert("Repassword not ok");
            }
        }else {
            alert("Password not ok");
        }
    }else {
        alert("Username not ok");
    }
    
}

socket.on('registryUserResult', (data) =>{
    if(data === validResult){
        alert("Congraduation!");
        openPage('/');
    }else{
        alert("This username is exit");
    }
});


socket.on('userLoginResult', (result) =>{
    let loginStatus = result.loginStatus;

    if(loginStatus === validResult){
        socket.username = result.username;
        openPage('/');
    }else{
        //do nothing
    }
});