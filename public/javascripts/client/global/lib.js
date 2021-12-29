//------------------login block---------------------
function autoLogin(currentPage) {
  //get token from cookie
  if (getCookie('jwtoken')) {
    socket.emit('userLoginJwt', getCookie('jwtoken'));
  } else {
    loadPublicHTMLelement();
    selectTopbarRight(false);

    if(currentPage === userPage){
      loadUserPageElement();
      setupSidebar();
    }else if(currentPage === newPage){
      loadNewPageElement();
      loginRequest();
    }else if(currentPage === boxPage){
      loadBoxPageElement();
      getBoxDetail();
      unloginHideEle();
    }
  }
}



//-----------public topbar-------------
let currentActiveDiv;
let divCoverAll;
let divTopbarRight;
let divTopbarRightDefault;
let aTopbarUsername;

function selectTopbarRight(isLoginOK) {
  if (isLoginOK) {
    divTopbarRightDefault.style.display = "none";
    divTopbarRight.style.display = "block";
  } else {
    divTopbarRightDefault.style.display = "block";
    divTopbarRight.style.display = "none";
  }
}

function addNewBox() {
  openPage('/new');
}

function logout() {
  deleteCookie("jwtoken");
  openPage('/');
}

function openLoginPage() {
  openPage('/login');
}

function openRegistryPage() {
  openPage('/registry');
}

//show hide popup menu by click
let divTopbarAddMenu;
let divTopbarMainMenu;

let isAddMenuClick = false;
let isMainMenuClick = false;


function loadPublicHTMLelement() {
  aTopbarUsername = document.getElementById("aTopbarUsername");
  divTopbarRight = document.getElementById("divTopbarRight");
  divTopbarRightDefault = document.getElementById("divTopbarRightDefault");

  divTopbarAddMenu = document.getElementById("divTopbarAddMenu");
  divTopbarMainMenu = document.getElementById("divTopbarMainMenu");

  divCoverAll = document.getElementById("divCoverAll");
  currentActiveDiv = divCoverAll;
}

function showOneDiv(divShow) {
  divTopbarAddMenu.style.display = "none";
  divTopbarMainMenu.style.display = "none";

  divShow.style.display = "block";
  
}

function closeDivByOutSideDivClick(xPoint, yPoint) {
  const divCoordinates = getCoordinates(currentActiveDiv);

  const topPoint = divCoordinates.topPoint;
  const leftPoint = divCoordinates.leftPoint;
  const rightPoint = divCoordinates.rightPoint;
  const bottomPoint = divCoordinates.bottomPoint;

  if ((xPoint > leftPoint && xPoint < rightPoint) && yPoint > topPoint && yPoint < bottomPoint) {
    //cursor inside div

  } else {
    currentActiveDiv.style.display = 'none';
    currentActiveDiv = divCoverAll;
    divCoverAll.style.display = 'block';
  }

}

function divClick(xPoint, yPoint) {
  if (isAddMenuClick) {
    showOneDiv(divTopbarAddMenu);
    isAddMenuClick = false;
  } else if (isMainMenuClick) {
    showOneDiv(divTopbarMainMenu);
    isMainMenuClick = false
  } else {
    closeDivByOutSideDivClick(xPoint, yPoint);
  }
}

function getCoordinates(element) {
  var rect = element.getBoundingClientRect();
  return {
    topPoint: rect.top,
    leftPoint: rect.left,
    rightPoint: rect.right,
    bottomPoint: rect.bottom
  }
}

function showit() {
  let xCoordinates = Event.x;
  let yCoordinates = Event.y;

  divClick(xCoordinates, yCoordinates);
}

function showitMOZ(e) {
  let xCoordinates = e.pageX;
  let yCoordinates = e.pageY;

  divClick(xCoordinates, yCoordinates);
}

function getPositionClick() {
  if (!document.all) {
    window.captureEvents(Event.CLICK);
    window.onclick = showitMOZ;
  } else {
    document.onclick = showit;
  }
}

function openTopbarAddMenu() {
  isAddMenuClick = true;
  currentActiveDiv = divTopbarAddMenu;

}

function openTopbarMainMenu() {
  isMainMenuClick = true;
  currentActiveDiv = divTopbarMainMenu;
}

function openTopbarAddMenu1() {
  openTopbarAddMenu();
}

function openTopbarMainMenu1() {
  openTopbarMainMenu();
}


function setPositionCenter(parentEle, childEle) {
  let widthDivPar = parentEle.offsetWidth;
  let widthDivChi = childEle.offsetWidth;

  let temp = (widthDivPar - widthDivChi);
  if (temp > 0)
      childEle.style.marginLeft = (temp - (temp % 2)) / 2 + 'px';

}


//------------------------------------
