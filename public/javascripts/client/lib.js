var socket = io.connect("http://localhost:8888");

const invalidResult = 'ko';
const validResult = 'ok';
const jwtExpired = 2;
const loginInvalidUsername = 0;
const loginInvalidPassword = 1;

//------------------login block---------------------

let usname = "";
let psword = "";

function openLoginPage(){
  let aLogin = document.createElement('a');
  aLogin.setAttribute('href','/login');
  aLogin.click();
}

function openRegistryPage(){
  let aRegistry = document.createElement('a');
  aRegistry.setAttribute('href','/registry');
  aRegistry.click();
}

function openUserPage(username){
  let aLogin = document.createElement('a');
  aLogin.setAttribute('href',username);
  aLogin.click();
}

function loginByCookie(htmlElement){
  if(!getCookie("gruu-username")){
    if(htmlElement)
      htmlElement.style.display = "block";
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

function autoLogin(htmlElement){
 // deleteCookie("jwtoken");

  //get token from cookie
  if(getCookie('jwtoken')){
      socket.emit('userLoginJwt', getCookie('jwtoken'));      
  }else{
      loginByCookie(htmlElement);        
  }
}




socket.on('userLoginResult', (result) =>{
  let loginForm = document.getElementById("divLogin");  
  if(loginForm){
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

          openUserPage('haopv');
    }
  }else{
    if(result === validResult){
      openUserPage('haopv');
    }
  }
  
});

socket.on('jwtResult', function(token){
  setCookie('jwtoken', token, "2000");
  console.log("write jwt token");
});

socket.on('userLoginJwtResult', function(data){
  if(data === invalidResult){
      loginByCookie();
  }
  
});













//------------------------------------

function drawChart(chartElement, type ,Data, Option){
    new Chart(chartElement, {
        type: type,
        data: {
          labels: Data.labels,
          datasets: Data.datasets
        },
        options: {
          title: {
            display: Option.title.display,
            text: Option.title.text
          }
        }
    });
}

function createChart(){
  let myChart = document.getElementById("myChart").getContext('2d');

  new Chart(myChart, {
      type: 'pie',
      data: {
          labels: ["Châu Phi", "Châu Á", "Châu Âu", "Châu Mỹ Latin", "Bắc Mỹ"],
          datasets: [{
              label: "đơn vị (triệu người)",
              backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
              data: [2478,5267,734,784,433]
          }]
      },
      options: {
          title: {
              display: true,
              text: 'Biểu đồ tỷ lệ dân số thế giới'
          }
      }
  });
}

