window.onload = function () {
    autoLogin();
    setTimeout(() => {
        divUserProfile = document.getElementById("divUserProfile");

        divTopbarAddMenu = document.getElementById("divTopbarAddMenu");
        divTopbarMainMenu = document.getElementById("divTopbarMainMenu");
        divEditProfile = document.getElementById("divEditProfile");

        divCoverAll = document.getElementById("divCoverAll");
        currentActiveDiv = divCoverAll;
        drawLine();
    }, 100);
}
let divUserProfile;

//show hide popup menu by click
let divTopbarAddMenu;
let divTopbarMainMenu;
let divEditProfile;

let divCoverAll;
let currentActiveDiv;

let isAddMenuClick = false;
let isMainMenuClick = false;
let isEditProfileClick = false;

socket.on('userLoginResult', (result) => {
    let loginStatus = result.loginStatus;


    if (loginStatus === validResult) {

        socket.username = result.username;



    } else {
        //do nothing
    }
});
/*---------------------code of topbar block ------------------*/
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

function closeAllDiv() {
    setTimeout(() => {
        divTopbarAddMenu.style.display = "none";
        divTopbarMainMenu.style.display = "none";

    }, 6000);
}
//--------close popup div-------
getPositionClick();

function showOneDiv(divShow){
    divTopbarAddMenu.style.display = "none";
    divTopbarMainMenu.style.display = "none";
    divEditProfile.style.display = "none";

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
    }

}

function divClick(xPoint, yPoint) {
    if(isAddMenuClick){
        showOneDiv(divTopbarAddMenu);
        isAddMenuClick = false;
    }else if(isMainMenuClick){
        showOneDiv(divTopbarMainMenu);
        isMainMenuClick = false
    }else if(isEditProfileClick){
        showOneDiv(divEditProfile);
        isEditProfileClick = false
    }else{
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
    //console.log(rect.top +" "+ rect.right +" "+ rect.bottom +" "+ rect.left);
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



/**--------------------------------- */
function changeAvatar() {

}

function editProfile() {
    currentActiveDiv = divEditProfile;
    isEditProfileClick = true;
}

function drawLine() {
    // Lấy đối tượng Canvas
    var canvas = document.getElementById('canvasLine');

    // Chọn đối tượng vẽ 2D
    var context = canvas.getContext('2d');

    // Tiến hành vẽ
    context.beginPath();        // Khai báo vẽ đường thẳng mới
    context.moveTo(0, 20);     // Điểm bắt đầu
    context.lineTo(500, 20);   // Điểm kết thúc
    context.stroke();           // Tiến hành vẽ
}

function openInfo() {
    document.getElementById("aUserInfo").style.color = "red";
    document.getElementById("aUserBoxList").style.color = "black";

    showInfo()
}

function openBoxList() {
    document.getElementById("aUserInfo").style.color = "black";
    document.getElementById("aUserBoxList").style.color = "red";

    showBoxes();
}

function showInfo() {
    var body = document.getElementById('ulShowArena');
    body.innerHTML = "";

    var img = document.createElement('img');

    img.src = "/image/avatar/avatar.png";
    img.width = "120";




    body.appendChild(img);

}

function showBoxes() {
    var body = document.getElementById('ulShowArena');
    body.innerHTML = "";

}