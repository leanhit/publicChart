var socket = io.connect("http://localhost:8888");

const invalidResult = 'ko';
const validResult = 'ok';
const jwtExpired = 2;
const loginInvalidUsername = 0;
const loginInvalidPassword = 1;

//------------------login block---------------------

let usname = "";
let psword = "";

function openPage(pageTag){
  let aLogin = document.createElement('a');
  aLogin.setAttribute('href',pageTag);
  setTimeout(() => {
    aLogin.click();
  }, 100);
  
}


socket.on('jwtResult', function(token){
  setCookie('jwtoken', token, "2000");
  console.log("write jwt token");
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

