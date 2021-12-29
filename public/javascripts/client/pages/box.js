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
        //console.log(tableInfo);
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
let inDatasetComment;

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
    inDatasetComment = document.getElementById("inDatasetComment");
    slChartType = document.getElementById("slChartType");

    inChartName.defaultValue = 'new Chart';
}

function showCreateNewChar() {
    divChartsList.style.width = '0%';
    divChartsList.style.display = 'none';

    divChartOffer.style.width = '100%';

    divFirstStep.style.display = 'block';

    //console.log(tableData)

}

let chartName = '';
let isChartType = false;
let labelsList;
let notesList;
let datasetsSelected = '';
let rowSelected = 0;
let columsSelected = '';
let columNodeSelect = 0;

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


    let tblChoiceLabels = document.getElementById("tblChoiceLabels");
    let slDataFrom = document.getElementById("slDataFrom");
    showDataChoiceLabel(tblChoiceLabels, tableData, slDataFrom.value);
}


let rbList = [];
function showDataChoiceLabel(tableName, datum, dtFrom) {
    if (dtFrom === 'dfRow') {
        tableName.innerHTML = '';
        var tbdyHead = document.createElement('tbody');
        tableName.appendChild(tbdyHead);


        if (isChartType) {
            rbList = [];
            //insert row radiobutton to choice node list
            createRowRadiobutton(tbdyHead, "rbNote");
        }


        //insert colum check box
        createRowCheckBox(tbdyHead, 'cbLabel');
        let index = 1;
        datum.forEach(row => {
            var tbdy = document.createElement('tbody');

            //create row
            var tr = document.createElement('tr');

            createColumRadioButton(tr, index, 'slLabel');
            index++;

            for (var i = 0; i < row.length; i++) {
                //Index colum
                var tdIndex = document.createElement('td');
                tdIndex.appendChild(document.createTextNode(row[i]));
                //add cell to row
                tr.appendChild(tdIndex);
                tbdy.appendChild(tr);

            }

            tableName.appendChild(tbdy);
        });
    } else {
        tableName.innerHTML = '';
        alert('lllllll')
    }
}

function createRowRadiobutton(tbody, rbName) {
    //create row
    var tr = document.createElement('tr');

    for (var i = 0; i < maxRowNumber + 2; i++) {

        //Index colum
        var tdRadio = document.createElement('td');
        if (i === 0) {
            tdRadio.appendChild(document.createTextNode(''));
            tdRadio.style.border = '0px';
            tdRadio.style.width = '5px';
        } else {
            var radiobutton = document.createElement('input');
            radiobutton.setAttribute('type', 'radio');
            radiobutton.setAttribute('name', rbName);
            radiobutton.setAttribute('value', i);
            rbList.push(radiobutton);

            radiobutton.addEventListener('change', radioClick)
            function radioClick() {
                rbList.forEach(rb => {

                    if (rb.checked === true) {
                        columNodeSelect = rb.value;
                        disableSelectedNoteColum(rb.value);

                    }
                })
            }
            if (i == 1) {

                radiobutton.click();
                columNodeSelect = 1;
            }


            tdRadio.appendChild(radiobutton);
            tdRadio.style.width = '100px';
        }
        //add cell to row
        tr.appendChild(tdRadio);
    }
    tbody.appendChild(tr);
}

function createColumRadioButton(tr, value, radiobuttonName) {
    //create select row
    var tdSelect = document.createElement('td');
    var radioSelect = document.createElement('input');
    radioSelect.setAttribute('type', 'radio');
    radioSelect.setAttribute('name', radiobuttonName);
    radioSelect.setAttribute('value', value);

    radioSelect.addEventListener('change', radioClick)
    function radioClick() {
        if (radioSelect.checked === true) {
            rowSelected = radioSelect.value;
        }
    }

    if (value === 0) {
        radioSelect.click();
        rowSelected = 0;
    }
    else if (value === 1) {
        radioSelect.click();
        rowSelected = 1;
    }

    tdSelect.appendChild(radioSelect);
    tr.appendChild(tdSelect);
}

function disableSelectedNoteColum(columIndex) {


    var checkbox = document.getElementsByName('cbLabel');

    // Lặp qua từng checkbox để lấy giá trị
    for (var i = 0; i < checkbox.length; i++) {
        //console.log(i, columIndex)
        if (i == columIndex - 1) {
            checkbox[i].checked = false;
            checkbox[i].style.display = 'none';
        } else {
            checkbox[i].style.display = 'block';
        }
    }
}

function createRowCheckBox(tbody, cbName) {
    //create row
    var tr = document.createElement('tr');

    for (var i = 0; i < maxRowNumber + 2; i++) {

        //Index colum
        var tdCheckBox = document.createElement('td');
        if (i === 0) {
            tdCheckBox.appendChild(document.createTextNode(''));
            tdCheckBox.style.border = '0px';
            tdCheckBox.style.width = '5px';
        } else {
            var checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('name', cbName);
            //checkbox.setAttribute('value', i);
            checkbox.addEventListener('change', checkboxClick)
            function checkboxClick() {
                //writing...
            }
            //hide checkbox of selected node colum
            if (isChartType) {
                if (i === columNodeSelect) {
                    checkbox.style.display = 'none';
                    checkbox.checked = false;
                }
                else {
                    checkbox.checked = true;
                }
            } else {
                checkbox.checked = true;
            }


            tdCheckBox.appendChild(checkbox);
            tdCheckBox.style.width = '100px';
        }
        //add cell to row
        tr.appendChild(tdCheckBox);
    }
    tbody.appendChild(tr);
}

function secondNext() {
    columsSelected = [];
    // Khai báo tham số
    var checkbox = document.getElementsByName('cbLabel');

    // Lặp qua từng checkbox để lấy giá trị
    for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked === true) {
            columsSelected.push('on');
        } else {
            columsSelected.push('off');
        }
    }

    // In ra kết quả
    //console.log('columsSelected: ' + columsSelected);
    //console.log('rowSelected: ' + rowSelected);

    notesList = getNotesSelected(columNodeSelect - 1);
    labelsList = getLabelsSelected(rowSelected);
    tableDatumSelected = getTableDatumSelected(rowSelected);


    divSecondStep.style.display = 'none';
    divThirdStep.style.display = 'block';
    divThirdStep.style.width = '100%';
    divThirdStep.style.height = '100%';
    divThirdStep.style.overflow = 'scroll';


    let tblChoiceDataset = document.getElementById("tblChoiceDataset");
    inDatasetComment.defaultValue = "nocomment";
    showDataChoiceDatases(tblChoiceDataset, tableDatumSelected);

}

function getNotesSelected(columNumber) {
    tempDatum = [];
    for (var rowIndex = 1; rowIndex < tableData.length; rowIndex++) {

        let temp = tableData[rowIndex][columNumber];
        tempDatum.push(temp);

    }
    return tempDatum;
}

function getLabelsSelected(rowSelectedLabels) {
    let tempLabels = [];
    let temp = tableData[rowSelectedLabels - 1];
    for (var i = 0; i < temp.length; i++) {
        if (columsSelected[i] === 'on') {
            tempLabels.push(temp[i]);
        }
    }
    return tempLabels;
}

let tableDatumSelected = [];
function getTableDatumSelected(rowSelectedLabels) {
    tempDatum = [];
    for (var rowIndex = 0; rowIndex < tableData.length; rowIndex++) {
        if (rowIndex !== rowSelectedLabels - 1) {
            rowData = [];
            let temp = tableData[rowIndex];
            for (var i = 0; i < temp.length; i++) {
                if (columsSelected[i] === 'on') {
                    rowData.push(temp[i]);
                }
            }
            tempDatum.push(rowData);
        }
    }
    return tempDatum;
    //console.log(tableDatumSelected);
}

function showDataChoiceDatases(tableName, datum) {
    tableName.innerHTML = '';
    addLabels(tableName);

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
            createColumCheckBox(tr, rowIndex);
        }
        else
            createColumRadioButton(tr, rowIndex, 'slDataset');

        let row = datum[rowIndex];
        //console.log(row);
        for (var i = 0; i < row.length; i++) {
            //Index colum
            var tdIndex = document.createElement('td');
            tdIndex.appendChild(document.createTextNode(row[i]));
            //add cell to row
            tr.appendChild(tdIndex);
            tbdy.appendChild(tr);

        }

        tableName.appendChild(tbdy);

    };

}

function addLabels(tableName) {
    var tbdy = document.createElement('tbody');
    //create row
    var tr = document.createElement('tr');

    if (isChartType) {
        var emptyTd = document.createElement('td');
        emptyTd.style.border = '2px';
        tr.appendChild(emptyTd)
    }

    var emptyTd = document.createElement('td');
    emptyTd.style.border = '2px';
    tr.appendChild(emptyTd)

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





function createColumCheckBox(tr, checkPosition) {
    //create select row
    var tdSelect = document.createElement('td');
    var checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('name', 'cbDataset');
    checkbox.setAttribute('value', checkPosition);

    checkbox.addEventListener('change', checkboxClick)
    function checkboxClick() {
        if (checkbox.checked === true) {
            //alert(checkbox.name)
        }
    }

    if (checkPosition === 0)
        checkbox.click();

    tdSelect.appendChild(checkbox);
    tr.appendChild(tdSelect);
}

let datasets;
function thirdNext() {
    datasets = [];
    if (isChartType) {
        notesList = getSelectedNotesList()
        let rows = getRowSelectedDatasets();
        rows.forEach(rowIndex => {

            datasets.push(getDatasetsSelected(rowIndex));
        });

    } else {
        datasets.push(getDatasetsSelected(rowSelected));
    }


    divThirdStep.style.display = 'none';
    divFourthStep.style.display = 'block';

    setupChart();
}


function getSelectedNotesList() {
    let temp = [];
    var checkbox = document.getElementsByName('cbDataset');

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

function getDatasetsSelected(rowSelectedDatasets) {

    let temp;
    for (var rowIndex = 0; rowIndex < tableDatumSelected.length; rowIndex++) {
        if (rowIndex == rowSelectedDatasets) {
            temp = tableDatumSelected[rowIndex];
        }
    }
    return temp;
    //console.log(tableDatumSelected);
}

function getColorsList(colorNumber) {
    let colorsList = ['aqua', 'yellow', 'green', 'pink', 'blue', 'violet', 'grey', 'orange', 'red'];
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
            if(slChartType.value === "line"){
                aSet = {
                    label: note,
                    borderColor: getColorsList(noteIndex),
                    data: data,
                    fill: false
                }
            }else{
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
                label: inDatasetComment.value,
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

function createChart1() {
    let myChart = document.getElementById("cvChart").getContext('2d');

    new Chart(myChart, {
        type: 'pie',
        data: {
            labels: ["Châu Phi", "Châu Á", "Châu Âu", "Châu Mỹ Latin", "Bắc Mỹ"],
            datasets: [{
                label: "đơn vị (triệu người)",
                backgroundColor: getColorsList(labelsList.length),
                data: [2478, 5267, 734, 784, 433]
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


function createChart2() {
    new Chart(document.getElementById("cvChart"), {
        type: 'bar',
        data: {
            labels: ["1900", "1950", "1999", "2050"],
            datasets: [
                {
                    label: "Châu Phi",
                    backgroundColor: "#3e95cd",
                    data: [133, 221, 783, 2478]
                }, {
                    label: "Châu Âu",
                    backgroundColor: "#8e5ea2",
                    data: [408, 547, 675, 734]
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: "Biểu đồ tăng trưởng dân số Châu Phi và Châu Âu"
            }
        }
    });

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