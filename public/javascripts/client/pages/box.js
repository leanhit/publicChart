window.onload = function () {
    autoLogin(boxPage);

}
getPositionClick();


socket.on('userLoginResult', (result) => {
    loadPublicHTMLelement();
    loadBoxPageElement();

    let loginStatus = result.loginStatus;

    if (loginStatus === validResult) {
        let username = result.username;
        socket.username = username;
        aTopbarUsername.textContent = username;

        eventOpenPage(aTopbarUsername, '/' + username);
        selectTopbarRight(true);

        getBoxDetail();
    } else {
        if (loginStatus === jwtExpired) {
            alert("Token is exprired");
        }
        selectTopbarRight(false);
        loadBoxPageElement();
        getBoxDetail();
    }
});


//-------------------
let currentOwner;
let currentBox;

let aUsername;
let aBoxname;
let lblBoxStyle;

let divBodyLeft;
let divBodyRight;
let divMainBody;

function loadBoxPageElement() {
    aUsername = document.getElementById("aUsername");
    aBoxname = document.getElementById("aBoxname");
    lblBoxStyle = document.getElementById("lblBoxStyle");

    divBodyLeft = document.getElementById("divBodyLeft");
    divBodyRight = document.getElementById("divBodyRight");
    divMainBody = document.getElementById("divMainBody");



    proPathname();
}

function proPathname() {
    let pathArray = window.location.pathname.split('/');
    currentOwner = pathArray[1];
    currentBox = pathArray[2];

    aUsername.textContent = currentOwner;
    aBoxname.textContent = currentBox;

    eventOpenPage(aUsername, '/' + currentOwner);
    eventOpenPage(aBoxname, '/' + currentOwner + '/' + currentBox);


}


function checkOwnerBox() {
    if (currentBox === socket.username) {
        return true;
    } else {
        return false;
    }
}

function getBoxDetail() {
    console.log({
        owner: currentOwner,
        boxName: currentBox
    });
    socket.emit('getBoxDetail', {
        owner: currentOwner,
        boxName: currentBox
    });
}

let tablesList = '';
socket.on('getBoxDetailResult', (result) => {
    console.log(result)
    if (result.resultType === false) {
        divMainBody.innerHTML = 'No thing here';
        setTimeout(() => {
            alert("Failt to open this box!");
            openPage('/');
        }, 10);

    } else {
        tablesList = result.boxDetail.tablesName;
        lblBoxStyle.textContent = result.boxDetail.boxType;

        if (result.boxDetail.tablesNumber <= 0) {
            divBodyLeft.innerHTML = "No Table";
        } else {
            showTablesList(divBodyLeft, tablesList);
        }
    }


});

function showTablesList(body, tblList) {
    body.innerHTML = '';


    let tableNumber = tblList?.length;

    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.setAttribute('border', '0');

    var tbdy = document.createElement('tbody');


    for (var i = 0; i < tableNumber; i++) {

        var tableName = tableNumber[i];

        //create box name cell      ---------------------------------------  
        var tdTableName = document.createElement('td');
        tdTableName.appendChild(document.createTextNode(tableName));
        tdTableName.style.fontSize = '25px';
        tdTableName.style.color = 'blue';
        let pageTag = currentOwner + '/' + boxName;
        tableDetail(tdTableName);

        //add cell to row
        tr.appendChild(tdTableName);


        tbdy.appendChild(tr);

    }

    tbl.appendChild(tbdy);
    body.appendChild(tbl);


}

function tableDetail(tbName) {
    tbName.addEventListener('click', clickEle);
    function clickEle() {
        alert("pageTag");
    }
}