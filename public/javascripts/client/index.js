var socket = io.connect("http://localhost:8888");

function login(){
    let usname = document.getElementById("inUsername").value;
    let psword = document.getElementById("inPassword").value;

    socket.emit('userLogin', {
        username: usname,
        password: psword
    });
}

socket.on('userLoginResult', (data) =>{
    alert(data);
})