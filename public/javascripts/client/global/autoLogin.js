var socket = io.connect("http://localhost:8888");

const invalidResult = 'ko';
const validResult = 'ok';
const jwtExpired = 2;
const loginInvalidUsername = 0;
const loginInvalidPassword = 1;

const boxPage = 1;
const userPage = 2;
const newPage = 3;

const private = "private";
const public = "public";

function openPage(pageTag) {
    let aLogin = document.createElement('a');
    aLogin.setAttribute('href', pageTag);
    setTimeout(() => {
        aLogin.click();
    }, 10);
}


function eventOpenPage(element, pageTag) {
    element.addEventListener('click', clickEle);
    function clickEle() {        
        openPage(pageTag);
    }
}

socket.on('jwtResult', function (token) {
    setCookie('jwtoken', token, "2000");
    console.log("write jwt token");
});
