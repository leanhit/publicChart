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
        unloginHideEle();
        getBoxDetail();
    }
});


//-------------------
let currentOwner;
let currentBox;
let currentTableID;

let aUsername;
let aBoxname;
let lblBoxStyle;

let divBodyLeft;
let divBodyRight;
let divMainBody;


var inReadExcelFile;
let btnCreateTable;

let divNewTable;
let divTabInfo;
let divNewChart;

let cvUnderLine01;
let cvUnderLine02;
let cvUnderLine03;

function unloginHideEle() {
    //hide all active item of owner
    document.getElementById("btnEditBoxDescription").style.display = 'none';
    document.getElementById("divInfoOpenFile").style.display = 'none';
}

function loadBoxPageElement() {

    inReadExcelFile = document.getElementById('inReadExcelFile');
    aUsername = document.getElementById("aUsername");
    aBoxname = document.getElementById("aBoxname");
    lblBoxStyle = document.getElementById("lblBoxStyle");

    divBodyLeft = document.getElementById("divBodyLeft");
    divBodyRight = document.getElementById("divBodyRight");
    divMainBody = document.getElementById("divMainBody");

    divNewTable = document.getElementById("divNewTable");
    divTabInfo = document.getElementById("divTabInfo");
    divNewChart = document.getElementById("divNewChart");

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
function showTablesList(body, tblList) {
    body.innerHTML = '';
    arrayTd = [];

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
        currentTableID = tableID;
        let tableInfo = {
            boxOwner: currentOwner,
            boxName: currentBox,
            tableID: currentTableID
        }

        showTab(cvUnderLine02, divNewTable);

        socket.emit('getTableDetail', tableInfo);

        resetDivChart();

    }
}

//This vriable store current table data
let tableData = '';
socket.on('getTableDetailResult', result => {
    if (result === false) {
        console.error("err");
    } else {
        let tableName = result.resultInfo.tableName;
        tableData = result.resultInfo.tableData;
        //show tab new table
        showTab(cvUnderLine02, divNewTable);
        //show this table data
        rangeData(tableName, tableData);
        //active button tocreate new chart
        loadNewChartElement();
        if (socket.username === currentOwner)
            btnShowCreateNewChart.style.display = 'block';

    }
});
//------------------------------------


function readExcelFile() {
    let tableName = cutFileName(inReadExcelFile.files[0].name);

    btnCreateTable.style.display = 'block';
    readXlsxFile(inReadExcelFile.files[0]).then(function (rows) {
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
//get max of row number of the table
let maxRowNumber = 0;
function rangeData(tableName, datum) {
    maxRowNumber = 0;
    let inNewTableName = document.getElementById("inNewTableName");
    let tblNewTable = document.getElementById("tblNewTable");


    tblNewTable.innerHTML = '';
    divNewTable.style.display = 'block';
    datum.forEach(row => {
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

            //reset max row number
            if (i > maxRowNumber)
                maxRowNumber = i;
        }

        tblNewTable.appendChild(tbdy);

    });

    inNewTableName.defaultValue = tableName;
    //setPositionCenter(divNewTable, divNewTableHead);
    //setPositionCenter(divNewTable, tblNewTable);
    //setPositionCenter(divNewTable, btnCreateTable);
    inReadExcelFile.value = '';
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

            arrayTd[lastTableIndex].style.color = 'red';

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
    divNewChart.style.display = 'none';

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

function openChartTab() {
    showTab(cvUnderLine03, divNewChart);
}


//-----------create new chart---------
let divChartsList;
let divChartOffer;
let divFirstStep;
let divSecondStep;
let divThirdStep;
let divFourthStep;
let btnShowCreateNewChart;
let divChartName;
let inChartName;
let slChartType;
let inNoteDataset;
let tblChoiceLabels;
let tblChoiceDataset;
let slDataFrom;

function loadNewChartElement() {
    divChartsList = document.getElementById("divChartsList");
    divChartOffer = document.getElementById("divChartOffer");
    divFirstStep = document.getElementById("divFirstStep");
    divSecondStep = document.getElementById("divSecondStep");
    divThirdStep = document.getElementById("divThirdStep");
    divFourthStep = document.getElementById("divFourthStep");
    btnShowCreateNewChart = document.getElementById("btnShowCreateNewChart");
    divChartName = document.getElementById("divChartName");
    inChartName = document.getElementById("inChartName");
    inNoteDataset = document.getElementById("inNoteDataset");
    slChartType = document.getElementById("slChartType");
    tblChoiceLabels = document.getElementById("tblChoiceLabels");
    tblChoiceDataset = document.getElementById("tblChoiceDataset");
    slDataFrom = document.getElementById("slDataFrom");

    inChartName.defaultValue = 'new Chart';
}

function showCreateNewChar() {
    divChartsList.style.width = '0%';
    divChartsList.style.display = 'none';

    divChartOffer.style.width = '100%';

    divFirstStep.style.display = 'block';
}

let chartName = '';
let isChartType = false;
let labelsList;
let notesList;
let datasetsSelected = '';
let labelPoint = 0;
let arrCbData = [];
let notePoint = 0;
let rbNoteList = [];
let rbLabelList = [];
let datasets;
let tableDatumSelected = [];

const cbData = 'cbData';

function firstNext() {
    chartName = inChartName.value;
    if ((slChartType.value === "bar") || (slChartType.value === "line"))
        isChartType = true;
    else
        isChartType = false;

    divFirstStep.style.display = 'none';
    divSecondStep.style.display = 'block';
    divSecondStep.style.width = '100%';
    divSecondStep.style.height = '100%';
    divSecondStep.style.overflow = 'scroll';

    selectDataFrom();
}

function addEmptyCell(tr) {
    var td = document.createElement('td');

    td.appendChild(document.createTextNode(''));
    td.style.border = '0px';
    td.style.width = '5px';

    tr.appendChild(td);
}

function addRb(rbName, rbValue) {
    var radiobutton = document.createElement('input');
    radiobutton.setAttribute('type', 'radio');
    radiobutton.setAttribute('name', rbName);
    radiobutton.setAttribute('value', rbValue);

    return radiobutton;
}

function addCb(cbName, cbValue) {
    var checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('name', cbName);
    checkbox.setAttribute('value', cbValue);

    return checkbox;
}

function addBtn() {
    var button = document.createElement('input');
    button.setAttribute('type', 'button');
    button.style.backgroundColor = 'aquablue';
    return button;
}

function createResetBtn(tr) {
    var btnReset = addBtn();
    btnReset.addEventListener('click', resetAllCb);

    function isChecked(arrCb) {
        let temp = false;
        arrCb.forEach(cb => {

            if (cb.checked === true) {
                return temp = true;
            }
        });
        return temp;
    }

    function resetAllCb() {
        let arrCb = document.getElementsByName(cbData);
        let index = 0;
        if (isChecked(arrCb)) {
            arrCb.forEach(cb => {
                cb.checked = false;
            });
        } else {
            arrCb.forEach(cb => {
                if (index !== notePoint)
                    cb.checked = true;
                else
                    cb.checked = false;

                index++;
            });
        }
    }


    var td = document.createElement('td');
    td.appendChild(btnReset);
    td.style.border = '0px';
    td.style.width = '5px';

    tr.appendChild(td);
}

function selectDFR(datum) {
    tblChoiceLabels.innerHTML = '';
    var tbdy = document.createElement('tbody');
    tblChoiceLabels.appendChild(tbdy);


    if (isChartType) {
        //insert row radiobutton to choice node list
        createRowRb_SDFR(tbdy, "rbNote");
    }


    //insert colum check box
    createRowCb_SDFR(tbdy, cbData);
    let index = 1;
    rbLabelList = [];
    datum.forEach(row => {
        var tbdy = document.createElement('tbody');

        //create row
        var tr = document.createElement('tr');

        addRbCell(tr, 'rbLabel', index);
        index++;

        for (var i = 0; i < row.length; i++) {
            //Index colum
            var tdIndex = document.createElement('td');
            tdIndex.appendChild(document.createTextNode(row[i]));
            //add cell to row
            tr.appendChild(tdIndex);
            tbdy.appendChild(tr);

        }

        tblChoiceLabels.appendChild(tbdy);
    });
}

function addRbCellNote(tr, rbName, rbValue) {
    var tdRadio = document.createElement('td');
    var radiobutton = addRb(rbName, rbValue);
    rbNoteList.push(radiobutton);

    radiobutton.addEventListener('change', radioClick)
    function radioClick() {
        rbNoteList.forEach(rb => {
            if (rb.checked === true) {
                notePoint = rb.value;
                disableSelectedNote(rb.value);

            }
        })
    }

    if (slDataFrom.value == "row") {
        if (rbValue == 1) {
            radiobutton.click();
            notePoint = 1;
        }
    } else {
        if (rbValue == 0) {
            radiobutton.click();
            notePoint = 0;
        }
    }

    tdRadio.appendChild(radiobutton);
    tdRadio.style.width = '100px';
    //add cell to row
    tr.appendChild(tdRadio);
}

function addRbCell(tr, rbName, rbValue) {
    //create select row
    var tdRadio = document.createElement('td');
    var radioSelect = addRb(rbName, rbValue);
    rbLabelList.push(radioSelect);

    radioSelect.addEventListener('change', radioClick)
    function radioClick() {

        rbLabelList.forEach(rb => {
            if (rb.checked === true) {
                labelPoint = rb.value;
            }
        });
    }

    if (rbValue === 0 || rbValue === 1 ||
        (rbValue === 2 && !(slDataFrom.value === "row"))) {
        radioSelect.click();
        labelPoint = rbValue;

    }

    tdRadio.appendChild(radioSelect);
    tr.appendChild(tdRadio);
}

function addCbCell(tr, cbName, cbValue) {
    var tdCheckBox = document.createElement('td');
    var checkbox = addCb(cbName, cbValue);

    checkbox.click();
    //hide checkbox of selected node colum

    if (isChartType && (cbValue === notePoint)) {
        checkbox.checked = false;
        checkbox.style.display = 'none';
    }

    tdCheckBox.appendChild(checkbox);
    tdCheckBox.style.width = '100px';
    //add cell to row
    tr.appendChild(tdCheckBox);
}

function disableSelectedNote(cbIndex) {
    var checkbox = document.getElementsByName(cbData);
    let Max = checkbox.length;

    // Lặp qua từng checkbox để lấy giá trị
    for (var i = 0; i < Max; i++) {
        if (((slDataFrom.value == "row") && (i == cbIndex - 1)) ||
            (!(slDataFrom.value == "row") && (i == cbIndex))) {
            checkbox[i].checked = false;
            checkbox[i].style.display = 'none';
        } else {
            checkbox[i].style.display = 'block';
        }
    }
}


function getCheckedCb(cbName) {
    let temp = [];
    // Khai báo tham số
    var checkbox = document.getElementsByName(cbName);

    // Lặp qua từng checkbox để lấy giá trị
    for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked === true) {
            temp.push('on');
        } else {
            temp.push('off');
        }
    }
    return temp;
}

function createRowRb_SDFR(tbody, rbName) {
    //create row
    var tr = document.createElement('tr');

    rbNoteList = [];
    for (var i = 0; i < maxRowNumber + 2; i++) {
        if (i === 0) {
            addEmptyCell(tr);
        } else {
            addRbCellNote(tr, rbName, i);
        }
    }
    tbody.appendChild(tr);
}

function createRowCb_SDFR(tbody, cbName) {
    //create row
    var tr = document.createElement('tr');

    for (var i = 0; i < maxRowNumber + 2; i++) {
        //checkbox colum
        if (i === 0) {
            addEmptyCell(tr);
        } else {
            addCbCell(tr, cbName, i);
        }
    }
    tbody.appendChild(tr);
}

function secondNext() {
    arrCbData = getCheckedCb(cbData);

    notesList = getNotesSelected(notePoint);
    labelsList = getLabelsSelected(labelPoint);

    tableDatumSelected = getTableDatumSelected(labelPoint);



    divSecondStep.style.display = 'none';
    divThirdStep.style.display = 'block';
    divThirdStep.style.width = '100%';
    divThirdStep.style.height = '100%';
    divThirdStep.style.overflow = 'scroll';



    inNoteDataset.defaultValue = "nocomment";
    if (slDataFrom.value == "row")
        showTableChoiceData_SDFR(tableDatumSelected);
    else
        showTableChoiceData_SDFC(tableDatumSelected);
}

function getNotesSelected(noteP) {
    tempNotes = [];
    if (slDataFrom.value == "row") {
        for (var rowIndex = 1; rowIndex < tableData.length; rowIndex++) {
            let temp = tableData[rowIndex][noteP - 1];
            tempNotes.push(temp);
        }
    } else {
        let row = tableData[noteP];
        for(var i = 0; i<row.length; i++){
            if(i !== labelPoint-2){
                tempNotes.push(row[i]);
            }
        }
        
            
            
        
    }
    return tempNotes;
}

function getLabelsSelected(labelP) {
    let tempLabels = [];
    if (slDataFrom.value == "row") {
        let temp = tableData[labelP - 1];

        for (var i = 0; i < temp.length; i++) {
            if (arrCbData[i] === 'on') {
                tempLabels.push(temp[i]);
            }
        }
    } else {
        if (isChartType) {
            for (var rowIndex = 1; rowIndex < tableData.length; rowIndex++) {
                let temp = tableData[rowIndex][labelP - 2];
                if (arrCbData[rowIndex] === 'on') {
                    tempLabels.push(temp);
                }
            }
        } else {
            for (var rowIndex = 1; rowIndex < tableData.length; rowIndex++) {
                let temp = tableData[rowIndex][labelP - 1];

                if (arrCbData[rowIndex] === 'on') {
                    tempLabels.push(temp);
                }
            }
        }

    }

    return tempLabels;
}

function getTableDatumSelected(labelP) {
    tempDatum = [];
    if (slDataFrom.value == "row") {
        for (var rowIndex = 0; rowIndex < tableData.length; rowIndex++) {
            if (rowIndex !== labelP - 1) {
                rowData = [];
                let temp = tableData[rowIndex];
                for (var i = 0; i < temp.length; i++) {
                    if (arrCbData[i] === 'on') {
                        rowData.push(temp[i]);
                    }
                }
                tempDatum.push(rowData);
            }
        }
    } else {
        for (var rowIndex = 0; rowIndex < tableData.length; rowIndex++) {
            if (arrCbData[rowIndex] === 'on') {
                let row = tableData[rowIndex];
                let temp = [];
                for (var j = 0; j < row.length; j++) {
                    if (j != labelP - 2) {
                        temp.push(row[j]);
                    }
                }
                tempDatum.push(temp);
            }
        }
    }

    return tempDatum;
}

function showTableChoiceData_SDFR(datum) {
    tblChoiceDataset.innerHTML = '';
    addLabels(tblChoiceDataset);

    rbLabelList = [];
    for (var rowIndex = 0; rowIndex < datum.length; rowIndex++) {
        var tbdy = document.createElement('tbody');
        //create row
        var tr = document.createElement('tr');
        if (isChartType) {
            //create note cell
            var tdNote = document.createElement('td');
            tdNote.appendChild(document.createTextNode(notesList[rowIndex]));
            tr.appendChild(tdNote);
            //create checkbox cell
            createColumCb_SDFR(tr, rowIndex);
        }
        else
            addRbCell(tr, 'slDataset', rowIndex);

        let row = datum[rowIndex];
        for (var i = 0; i < row.length; i++) {
            //Index colum
            var tdIndex = document.createElement('td');
            tdIndex.appendChild(document.createTextNode(row[i]));
            //add cell to row
            tr.appendChild(tdIndex);
            tbdy.appendChild(tr);

        }

        tblChoiceDataset.appendChild(tbdy);
    };

}

function addLabels(tableName) {
    var tbdy = document.createElement('tbody');
    //create row
    var tr = document.createElement('tr');

    if (isChartType) {
        addEmptyCell(tr);
    }

    addEmptyCell(tr);

    for (var i = 0; i < labelsList.length; i++) {
        //Index colum
        var tdIndex = document.createElement('td');
        tdIndex.appendChild(document.createTextNode(labelsList[i]));
        //add cell to row
        tr.appendChild(tdIndex);
    }

    tbdy.appendChild(tr);
    tableName.appendChild(tbdy);
}

function createColumCb_SDFR(tr, checkPosition) {
    //create select row
    var tdSelect = document.createElement('td');
    var checkbox = addCb('cbDataset', checkPosition);

    if (checkPosition === 0)
        checkbox.click();

    tdSelect.appendChild(checkbox);
    tr.appendChild(tdSelect);
}

function thirdNext() {
    datasets = [];
    if (isChartType) {
        notesList = getSelectedNotesList()
        let rows = getRowSelectedDatasets();
        rows.forEach(rowIndex => {

            datasets.push(getDatasetsSelected(rowIndex));
        });

    } else {
        datasets.push(getDatasetsSelected(labelPoint));
    }




    divThirdStep.style.display = 'none';
    divFourthStep.style.display = 'block';

    setupChart();
}

function getSelectedNotesList() {
    let temp = [];
    var checkbox = document.getElementsByName('cbDataset');
console.log(notesList);
console.log(checkbox);

    // Lặp qua từng checkbox để lấy giá trị
    for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked === true) {
            temp.push(notesList[i]);
        }
    }

    return temp;
}

function getRowSelectedDatasets() {
    let temp = [];
    var checkbox = document.getElementsByName('cbDataset');

    // Lặp qua từng checkbox để lấy giá trị
    for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked === true) {
            temp.push(checkbox[i].value);
        }
    }
    return temp;
}

function getDatasetsSelected(selectPoint) {

    let temp;
    if (slDataFrom.value == "row") {
        for (var rowIndex = 0; rowIndex < tableDatumSelected.length; rowIndex++) {
            if (rowIndex == selectPoint) {
                temp = tableDatumSelected[rowIndex];
            }
        }
    } else {
        temp = [];
        for (var rowIndex = 0; rowIndex < tableDatumSelected.length; rowIndex++) {
            let row = tableDatumSelected[rowIndex]

            let index = 0;
            row.forEach(cell => {
                if (index == selectPoint) {
                    temp.push(cell);
                }
                index++;
            });
        }
    }
    return temp;
}

function getColorsList(colorNumber) {
    let colorsList = ['aqua', 'yellow', 'green', 'red', 'blue', 'violet', 'puper', 'orange', 'grey'];
    if (isChartType)
        return colorsList[colorNumber];
    else
        return colorsList.splice(0, colorNumber);
}

function makeDataset(datum) {
    let temp = [];
    if (isChartType) {
        let noteIndex = 0;
        datum.forEach(data => {
            let note = notesList[noteIndex];
            let aSet;
            if (slChartType.value === "line") {
                aSet = {
                    label: note,
                    borderColor: getColorsList(noteIndex),
                    data: data,
                    fill: false
                }
            } else {
                aSet = {
                    label: note,
                    backgroundColor: getColorsList(noteIndex),
                    data: data
                }
            }

            temp.push(aSet);

            noteIndex++;
        });
    } else {
        datum.forEach(data => {
            let aSet = {
                label: inNoteDataset.value,
                backgroundColor: getColorsList(labelsList.length),
                data: data
            }
            temp.push(aSet);
        });
    }
    return temp;
}

function setupChart() {
    let options = {
        title: {
            display: true,
            text: chartName
        }
    };

    let chartData = makeDataset(datasets);

    let data = {
        labels: labelsList,
        datasets: chartData
    }


    let cvChart = document.getElementById("cvChart");
    drawChart(cvChart, slChartType.value, data, options)
}

let finalData;
function drawChart(chartElement, type, Data, Option) {
    finalData = {
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
    };

    new Chart(chartElement, finalData);
}

function saveChart() {
    let head = {
        boxOwner: currentOwner,
        boxName: currentBox,
        tableID: currentTableID
    }
    socket.emit('createChart', {

        body: makeDataset(datasets)
    });
}

function resetDivChart() {

}

function stepDisplay(currentDiv, stepDiv) {
    currentDiv.style.display = 'none';
    stepDiv.style.display = 'block';

}

function firstPreview() {
    stepDisplay(divSecondStep, divFirstStep);
}


function secondPreview() {
    firstNext();
}


function renew() {
    stepDisplay(divFourthStep, divFirstStep);
}

//----------------draw chart by select colum----------------

function selectDataFrom() {
    if (slDataFrom.value === 'row') {
        selectDFR(tableData);
    } else {
        selectDFC(tableData);
    }
}

function selectDFC(datum) {
    tblChoiceLabels.innerHTML = '';
    rbNoteList = [];
    var tbdy = document.createElement('tbody');
    tblChoiceLabels.appendChild(tbdy);

    createRowRb_SDFC(tbdy, "rbLabel");
    let indexColum = 0;
    datum.forEach(data => {
        //create row
        var tr = document.createElement('tr');

        if (isChartType) {
            //add radiobutton cell
            addRbCellNote(tr, 'rbNote', indexColum);
            //add checkbox cell
            addCbCell(tr, cbData, indexColum);
        } else {
            //add checkbox cell
            addCbCell(tr, cbData, indexColum);
        }

        for (var i = 0; i < data.length; i++) {
            //create data cell 
            var tdData = document.createElement('td');
            tdData.appendChild(document.createTextNode(data[i]));
            tr.appendChild(tdData);

        }
        indexColum++;
        tbdy.appendChild(tr);
    });

    tblChoiceLabels.appendChild(tbdy);
}


function createRowRb_SDFC(tbody, rbName) {
    //create row
    var tr = document.createElement('tr');

    if (isChartType) {
        for (var i = 0; i < maxRowNumber + 3; i++) {
            if ((i === 0)) {
                //add empty cell
                addEmptyCell(tr);
            } else if ((i === 1)) {
                createResetBtn(tr);
            } else {
                //add radiobutton cell
                addRbCell(tr, rbName, i);
            }
        }
    } else {
        for (var i = 0; i < maxRowNumber + 2; i++) {
            if (i === 0) {
                //add empty cell
                //addEmptyCell(tr);
                createResetBtn(tr);
            } else {
                //add radiobutton cell
                addRbCell(tr, rbName, i);
            }
        }
    }

    tbody.appendChild(tr);
}

function showTableChoiceData_SDFC(datum) {
    tblChoiceDataset.innerHTML = '';

    if (isChartType) {
        addNoteList(tblChoiceDataset);
        addCbSelectList(tblChoiceDataset, 'cbDataset');
    } else
        addRbSelectList(tblChoiceDataset);

    var tbdy = document.createElement('tbody');
    let index = 0;
    datum.forEach(data => {
        var tr = document.createElement('tr');
        if (isChartType) {
            var tdLabel = document.createElement('td');
            tdLabel.appendChild(document.createTextNode(labelsList[index]));
            tr.appendChild(tdLabel);
        }

        for (var i = 0; i < data.length; i++) {
            var tdData = document.createElement('td');
            tdData.appendChild(document.createTextNode(data[i]));
            tr.appendChild(tdData);
        }
        index++;
        tbdy.appendChild(tr);
    });

    tblChoiceDataset.appendChild(tbdy);
}

function addNoteList(tbName) {
    var tbdy = document.createElement('tbody');
    var tr = document.createElement('tr');

    addEmptyCell(tr);

    notesList.forEach(aNote => {
        var tdNote = document.createElement('td');
        tdNote.appendChild(document.createTextNode(aNote));

        tdNote.style.width = '100px';
        tr.appendChild(tdNote);
    });

    tbdy.appendChild(tr);
    tbName.appendChild(tbdy);
}

function addCbSelectList(tbName, cbName) {
    var tbdy = document.createElement('tbody');
    var tr = document.createElement('tr');
    addEmptyCell(tr);

    for (var i = 0; i < maxRowNumber; i++) {
        var checkbox = addCb(cbName, i);
        var tdCb = document.createElement('td');
        tdCb.appendChild(checkbox);
        tr.appendChild(tdCb);
    }

    tbdy.appendChild(tr);
    tbName.appendChild(tbdy);
}

function addRbSelectList(tbName, rbName) {
    var tbdy = document.createElement('tbody');
    var tr = document.createElement('tr');
    addEmptyCell(tr);

    for (var i = 0; i < maxRowNumber; i++) {
        var radiobutton = addRb(rbName, i);
        radiobutton.click();

        var tdRb = document.createElement('td');
        tdRb.appendChild(radiobutton);
        tr.appendChild(tdRb);
    }

    tbdy.appendChild(tr);
    tbName.appendChild(tbdy);
}
