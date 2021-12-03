let divStartElement;
let divMainElement;

window.onload = function(){
    //get token from cookie
    if(getCookie('jwtoken')){        
        socket.emit('userLoginJwt', getCookie('jwtoken'));      
    }else{        
        //do nothing
    }
    setTimeout(() => {        
        divStartElement = document.getElementById("divStart");
        divMainElement = document.getElementById("divMain");
    }, 1000);
}

function logout(){        
    deleteCookie("jwtoken");
    openPage('/');
}

function openLoginPage(){
    openPage('/login');
  }
  
  function openRegistryPage(){
    openPage('/registry');
  }

socket.on('userLoginResult', (result) =>{
    let loginStatus = result.loginStatus;
    
    divStartElement = document.getElementById("divStart");
    divMainElement = document.getElementById("divMain");

    

    if(loginStatus === validResult){  
        
        socket.username = result.username;
        document.getElementById("divStart").style.display = "none";
        document.getElementById("divMain").style.display = "block";
            
        
    }else{
        //do nothing
    }
});