window.onload = function(){
    autoLogin(document.getElementById("ivLogin"));
}

function login(){
    usname = document.getElementById("inUsername").value;
    psword = document.getElementById("inPassword").value;
  
    socket.emit('userLogin', {
        username: usname,
        password: psword
    });
  }