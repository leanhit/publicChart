window.onload = function () {
    autoLogin(userPage);
}

socket.on('userLoginResult', (result) => {
    loadPublicHTMLelement();
    loadUserPageElement();

    let loginStatus = result.loginStatus;

    if (loginStatus === validResult) {
        let username = result.username;
        socket.username = username;
        aTopbarUsername.textContent = username;

        eventOpenPage(aTopbarUsername, username);
        selectTopbarRight(true);

        //users page function
        setupSidebar();
    } else {
        if (loginStatus === jwtExpired) {
            alert("Token is exprired");
        }

        selectTopbarRight(false);
        loadUserPageElement();
        setupSidebar();
    }
});

function setupSidebar(){
    let pathArray = window.location.pathname.split('/');
    currentOwner = pathArray[1];

    aSidebarUsername.textContent = currentOwner;
    if(currentOwner === socket.username){
        btnSidebarEditProfile.style.display = 'block';
    }else{
        btnSidebarEditProfile.style.display = 'none';
    }

    getBoxesList(currentOwner); 
}
//--------close popup div-------
getPositionClick();
//--------------------------------
let aSidebarUsername;
let divUserProfileSidebar;
let divUserProfileMain;
let cvUnderLine01;
let cvUnderLine02;
let divUserInfo;
let divBoxesInfo;
let btnSidebarEditProfile;

let boxesList;

function loadUserPageElement() {
    aSidebarUsername = document.getElementById("aSidebarUsername");
    divUserProfileMain = document.getElementById("divUserProfileMain");
    divUserProfileSidebar = document.getElementById("divUserProfileSidebar");

    cvUnderLine01 = document.getElementById("cvUnderLine01");
    cvUnderLine02 = document.getElementById("cvUnderLine02");

    divUserInfo = document.getElementById("divUserInfo");
    divBoxesInfo = document.getElementById("divBoxesInfo");
    btnSidebarEditProfile = document.getElementById("btnSidebarEditProfile");
}


/**--------------------------------- */
function changeAvatar() {

}

function getBoxesList(currentOwner) {

    socket.emit('getBoxesList', currentOwner);
}

socket.on('getBoxesListResult', (result) => {

    let resultType = result.resultType;

    if (resultType === false) {
        boxesList = '';
    }
    else {
        boxesList = result.boxesList;
    }

});

function openInfo() {
    cvUnderLine01.style.display = "block";
    cvUnderLine02.style.display = "none";

    divUserInfo.style.display = "block";
    divBoxesInfo.style.display = "none";

    btnSidebarEditProfile.style.display = "block";
}

function openBoxList() {
    cvUnderLine01.style.display = "none";
    cvUnderLine02.style.display = "block";

    divUserInfo.style.display = "none";
    divBoxesInfo.style.display = "block";

    btnSidebarEditProfile.style.display = "none";

    if (boxesList === null)
        divBoxesInfo.innerHTML = 'No box to show';
    else if (boxesList.length <= 0)
        divBoxesInfo.innerHTML = 'No box to show';
    else
        showBoxes(divBoxesInfo, boxesList);
}

function createTblHeader(tbody) {
    //create row
    var tr = document.createElement('tr');

    //Index colum
    var tdIndex = document.createElement('td');
    tdIndex.appendChild(document.createTextNode("Box type"));
    tdIndex.width = '100px';
    //add cell to row
    tr.appendChild(tdIndex);

    //create box name cell      ---------------------------------------  
    var tdBoxexName = document.createElement('td');
    tdBoxexName.appendChild(document.createTextNode("Box name"));
    tdBoxexName.width = '150px';
    //add cell to row
    tr.appendChild(tdBoxexName);

    //create box description cell -------------------------------------------------
    var tdBoxDescription = document.createElement('td');

    tdBoxDescription.appendChild(document.createTextNode("Box description"));
    //add cell to row
    tr.appendChild(tdBoxDescription);
    tbody.appendChild(tr);


}

function showBoxes(body, boxesList) {

    body.innerHTML = "";
    let boxesNumber = boxesList.length;

    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.setAttribute('border', '0');

    var tbdy = document.createElement('tbody');
    createTblHeader(tbdy);


    for (var i = 0; i < boxesNumber; i++) {

        var boxName = boxesList[i].boxName;
        var boxDescription = boxesList[i].boxDescription;
        var boxType = boxesList[i].boxType;

        //create row
        var tr = document.createElement('tr');

        //Index colum
        var tdIndex = document.createElement('td');
        tdIndex.appendChild(document.createTextNode(boxType));
        //add cell to row
        tr.appendChild(tdIndex);

        //create box name cell      ---------------------------------------  
        var tdBoxesName = document.createElement('td');
        tdBoxesName.appendChild(document.createTextNode(boxName));
        tdBoxesName.style.fontSize = '25px';
        tdBoxesName.style.color = 'blue';
        let pageTag = currentOwner + '/' + boxName;
        eventOpenPage(tdBoxesName, pageTag);

        //add cell to row
        tr.appendChild(tdBoxesName);

        //create box description cell -------------------------------------------------
        var tdBoxDescription = document.createElement('td');
        tdBoxDescription.appendChild(document.createTextNode(boxDescription));
        //add cell to row
        tr.appendChild(tdBoxDescription);

        tbdy.appendChild(tr);

    }

    tbl.appendChild(tbdy);
    body.appendChild(tbl);

}


function editProfile() {
    console.log("edit profile");
}