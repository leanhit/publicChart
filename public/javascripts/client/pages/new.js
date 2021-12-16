window.onload = function () {
    autoLogin(newPage);

}

socket.on('userLoginResult', (result) => {
    loadPublicHTMLelement();
    loadNewPageElement();

    let loginStatus = result.loginStatus;

    if (loginStatus === validResult) {
        let username = result.username;
        socket.username = username;
        aTopbarUsername.textContent = username;

        eventOpenPage(aTopbarUsername, username);

        selectTopbarRight(true);
    } else {
        if (loginStatus === jwtExpired) {
            alert("Token is exprired");
        }
        loadNewPageElement();
        selectTopbarRight(false);
    }
});

/*---------------------code of topbar block ------------------*/
getPositionClick();

let boxNameOk = false;

let aBoxName;
let aBoxDescription;
let btnCreateBox;

const validChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123457890_";
const invalidCheckPath = "/images/registry/invalid.png";
const validCheckPath = "/images/registry/valid.png";

function loadNewPageElement() {
    aBoxName = document.getElementById("inBoxName");
    aBoxDescription = document.getElementById("inBoxDescription");
    btnCreateBox = document.getElementById("btnCreateBox");
}

function loginRequest() {
    divCoverAll.style.display = 'none';
    alert("Login to use that function");
    openPage('/login');
}

function createNewBox() {
    let boxInfo = {
        owner: socket.username,
        boxName: aBoxName.value,
        boxType: getRadioValue(),
        description: aBoxDescription.value
    }

    socket.emit('createNewBox', boxInfo);
}

socket.on('createNewBoxResult', (result) => {
    let resultType = result.resultType;
    let boxName = result.boxName;

    if (resultType === true) {
        openPage(boxName);
    }
})

function getRadioValue() {
    var ele = document.getElementsByName('radioSelect');
    for (i = 0; i < ele.length; i++) {
        if (ele[i].checked)
            return ele[i].value;
    }
}

function checkValidBoxName(boxName) {
    if (boxName.length >= 3 && boxName.length <= 16) {
        for (var i = 0; i < boxName.length; i++) {
            let aChar = boxName[i].slice();
            if (checkChar(aChar)) {
                //do nothing
            } else {
                return boxNameOk = false;
            }
        }
        return boxNameOk = true;
    } else {
        return boxNameOk = false;
    }
}

function checkChar(aChar) {
    if (validChar.indexOf(aChar) > -1)
        return true;
    else
        return false;
}

function charPress() {
    let boxName = aBoxName.value;
    if (checkValidBoxName(boxName)) {
        btnCreateBox.disabled = false;
    } else {
        btnCreateBox.disabled = true;
    }
}