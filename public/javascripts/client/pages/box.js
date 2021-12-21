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

let btnCreateTable;

let divNewTable;
let divTabInfo;

let cvUnderLine01;
let cvUnderLine02;
let cvUnderLine03;

function loadBoxPageElement() {
    aUsername = document.getElementById("aUsername");
    aBoxname = document.getElementById("aBoxname");
    lblBoxStyle = document.getElementById("lblBoxStyle");

    divBodyLeft = document.getElementById("divBodyLeft");
    divBodyRight = document.getElementById("divBodyRight");
    divMainBody = document.getElementById("divMainBody");

    divNewTable = document.getElementById("divNewTable");
    divTabInfo = document.getElementById("divTabInfo");

    btnCreateTable = document.getElementById("btnCreateTable");

    cvUnderLine01 = document.getElementById("cvUnderLine01");
    cvUnderLine02 = document.getElementById("cvUnderLine02");
    cvUnderLine03 = document.getElementById("cvUnderLine03");

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
    socket.emit('getBoxDetail', {
        owner: currentOwner,
        boxName: currentBox
    });
}

let tablesList = [];
socket.on('getBoxDetailResult', (result) => {
    tablesList = [];

    if (result.resultType === false) {
        divMainBody.innerHTML = 'No thing here';
        setTimeout(() => {
            alert("Failt to open this box!");
            openPage('/');
        }, 10);

    } else {
        tablesList = result.boxDetail.tablesList;
        lblBoxStyle.textContent = result.boxDetail.boxType;

        if (tablesList.length <= 0) {
            divBodyLeft.innerHTML = "No Table";
        } else {
            showTablesList(divBodyLeft, tablesList);
        }
    }


});

let arrayTd = [];
function clearArrayTd() {
    arrayTd = [];
}

function showTablesList(body, tblList) {
    body.innerHTML = '';
    clearArrayTd();

    let tableNumber = tblList?.length;
    var tbl = document.createElement('table');
    var tbdy = document.createElement('tbody');

    for (var i = 0; i < tableNumber; i++) {
        var tableName = tblList[i].tableName;
        var tr = document.createElement('tr');

        //create box name cell      ---------------------------------------  
        var tdTableName = document.createElement('td');
        arrayTd.push(tdTableName);

        tdTableName.appendChild(document.createTextNode(tableName));
        tdTableName.style.fontSize = '20px';
        tdTableName.style.color = 'blue';
        tdTableName.style.border = '0px solid red';
        tdTableName.style.overflow = 'hidden';

        getTableDetail(tdTableName, tblList[i].tableID);

        //add cell to row
        tr.appendChild(tdTableName);
        tbdy.appendChild(tr);

    }

    tbl.appendChild(tbdy);
    body.appendChild(tbl);
}

function getTableDetail(tbName, tableID) {
    tbName.addEventListener('click', clickEle);
    function clickEle() {
        arrayTd.forEach(td => {
            td.style.color = 'blue';
        });

        tbName.style.color = 'red';
        let tableInfo = {
            boxOwner: currentOwner,
            boxName: currentBox,
            tableID: tableID
        }

        showTab(cvUnderLine02, divNewTable);

        socket.emit('getTableDetail', tableInfo);
    }
}


socket.on('getTableDetailResult', result => {
    if (result === false) {
        console.error("err");
    } else {
        showTab(cvUnderLine02, divNewTable);
        showTableDetail(result.resultInfo);
    }
});
//------------------------------------


function readExcelFile() {
    var input = document.getElementById('inReadExcelFile');
    let tableName = cutFileName(input.files[0].name);

    btnCreateTable.style.display = 'block';
    readXlsxFile(input.files[0]).then(function (rows) {
        // `rows` is an array of rows
        // each row being an array of cells.
        excelData = rows;
        rangeData(tableName, rows);
    });
}

function cutFileName(fullName) {
    let dotPosition = fullName.lastIndexOf('.');
    return fullName.slice(0, dotPosition);
}

let excelData = '';
function rangeData(tableName, datas) {
    let inNewTableName = document.getElementById("inNewTableName");
    let tblNewTable = document.getElementById("tblNewTable");
    let divNewTableHead = document.getElementById("divNewTableHead");


    tblNewTable.innerHTML = '';
    divNewTable.style.display = 'block';
    datas.forEach(row => {
        var tbdy = document.createElement('tbody');
        //create row
        var tr = document.createElement('tr');
        for (var i = 0; i < row.length; i++) {
            //Index colum
            var tdIndex = document.createElement('td');
            tdIndex.appendChild(document.createTextNode(row[i]));
            //add cell to row
            tr.appendChild(tdIndex);
            tbdy.appendChild(tr);

        }

        tblNewTable.appendChild(tbdy);

    });

    inNewTableName.defaultValue = tableName;
    setPositionCenter(divNewTable, divNewTableHead);
    setPositionCenter(divNewTable, tblNewTable);
    setPositionCenter(divNewTable, btnCreateTable);
}

function setPositionCenter(parentEle, childEle) {
    let widthDivPar = parentEle.offsetWidth;
    let widthDivChi = childEle.offsetWidth;

    let temp = (widthDivPar - widthDivChi);
    if (temp > 0)
        childEle.style.marginLeft = (temp - (temp % 2)) / 2 + 'px';

}

function createNewTable() {
    let inNewTableName = document.getElementById("inNewTableName");
    if (inNewTableName.value !== '' && excelData.length > 0) {
        let tableInfo = {
            head: {
                boxOwner: currentOwner,
                boxName: currentBox,
                tableName: inNewTableName.value
            },
            tableContent: excelData
        };

        socket.emit('createNewTable', tableInfo);
    }
}

socket.on('createNewTableResult', result => {
    if (result === true) {
        getBoxDetail();
        alert("New table added to box " + currentBox);
        btnCreateTable.style.display = 'none';
        showTab(cvUnderLine02, divNewTable);

        let lastTableIndex = tablesList.length;
        setTimeout(() => {
            
        arrayTd[lastTableIndex].style.color= 'red';
        
        }, 500);

    } else {
        alert("Add new table err");
    }
});

//--------------------show table load from database----------------------
function showTab(cvLine, divTab) {

    cvUnderLine01.style.display = 'none';
    cvUnderLine02.style.display = 'none';
    cvUnderLine03.style.display = 'none';

    divTabInfo.style.display = 'none';
    divNewTable.style.display = 'none';

    cvLine.style.display = 'block';
    divTab.style.display = 'block';
}

function openInfoTab() {
    showTab(cvUnderLine01, divTabInfo);

}


function openTableTab() {
    showTab(cvUnderLine02, divNewTable);
    btnCreateTable.style.display = 'none';

}

function showTableDetail(tableInfo) {
    let tableName = tableInfo.tableName;
    let tableData = tableInfo.tableData;

    rangeData(tableName, tableData);



}
