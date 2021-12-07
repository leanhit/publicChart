let divStartElement;
let divMainElement;

window.onload = function(){
    autoLogin();
    setTimeout(() => {        
        divStartElement = document.getElementById("divStart");
        divMainElement = document.getElementById("divMain");
    }, 1000);
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



function openLoginPage(){
    openPage('/login');
  }
  
  function openRegistryPage(){
    openPage('/registry');
  }

  
function openProfile(){
    openPage(socket.username);
}