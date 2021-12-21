const MongoClient = require('mongodb').MongoClient;
var defineVal = require('./defineValue');

function checkExitsUser(username) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err) {
                reject(err);
            } else {
                var dbo = db.db(defineVal.dbAllUser);
                dbo.collection(defineVal.userColection).findOne({ username: username }, function (err, user) {
                    if (err) {
                        reject(err);
                    } else {
                        if (user == null) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                        db.close();
                    }
                });
            }
        });
    });
}

function checkExitsBox(username, boxName) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err) {
                reject(err);
            } else {
                const dbName = defineVal.dbUser + username;
                var dbo = db.db(dbName);
                dbo.collection(defineVal.boxListsColection).findOne({ boxName: boxName }, function (err, pBox) {
                    if (err) reject(err);
                    else {
                        if (pBox == null) {  //can't find myName in chat list of userName           
                            resolve(!defineVal.isExitBoxName);
                        } else {//find out
                            resolve(defineVal.isExitBoxName);
                        }
                    }

                    db.close();
                });
            }
        });
    });
}

function insertBoxToLists(boxInfo) {
    const username = boxInfo.owner;
    const boxName = boxInfo.boxName;
    const boxDescription = boxInfo.description;
    const boxType = boxInfo.boxType;

    return new Promise((resolve, reject) => {
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err) {
                reject(err);
            } else {
                const dbName = defineVal.dbUser + username;
                var dbo = db.db(dbName);
                dbo.collection(defineVal.boxListsColection).findOne({ boxName: boxName }, function (err, pBox) {
                    if (err) reject(err);
                    else {
                        if (pBox == null) {  //can't find boxName in chat list of boxName           
                            var newBox = {
                                boxName: boxName,
                                boxType: boxType,
                                boxDescription: boxDescription,
                                tablesName: [],
                                tablesID: [],
                                created: new Date(),
                                lastEdit: new Date
                            };
                            dbo.collection(defineVal.boxListsColection).insertOne(newBox, function (err, res) {
                                if (err) {
                                    reject(err);
                                } else {
                                    console.log("1 boxName inserted to " + username + " boxLists");
                                    resolve(res._id);
                                }
                                db.close();
                            });

                        } else {//find out
                            resolve(defineVal.isExitBoxName);
                        }
                    }
                });
            }
        });
    });
}

function getBoxesList(request) {
    let username = request.owner;
    let boxType = request.boxType;
    let queryJson = {};
    if (boxType === false)
        queryJson = { boxType: 'public' };

    return new Promise((resolve, reject) => {
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err) {
                reject(err);
            } else {
                const dbName = defineVal.dbUser + username;
                var dbo = db.db(dbName);
                dbo.collection(defineVal.boxListsColection).find(queryJson).sort({ "created": -1 }).toArray(function (err, boxes) {
                    if (err) reject(err);
                    else {
                        resolve(boxes);
                        db.close();
                    }
                });
            }
        });
    });
}

function updateBoxInfo(tableInfo, tableID) {
    let username = tableInfo.boxOwner;
    let boxName = tableInfo.boxName;
    let tableName = tableInfo.tableName;

    return new Promise((resolve, reject) => {

        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err) {
                reject(err);
            } else {
                const dbName = defineVal.dbUser + username;
                var dbo = db.db(dbName);
                dbo.collection(defineVal.boxListsColection).findOne({ boxName: boxName }, function (err, pBox) {
                    if (err) reject(err);
                    else {
                        if (pBox == null) {  //can't find boxName in chat list of boxName           

                        } else {//find out
                            let tablesNameNew = pBox.tablesName;
                            let tablesIDNew = pBox.tablesID;

                            tablesNameNew[tablesNameNew.length] = tableName;
                            tablesIDNew[tablesIDNew.length] = tableID;

                            let updateQuery = {
                                tablesName: tablesNameNew,
                                tablesID: tablesIDNew,
                                lastEdit: new Date()
                            }

                            dbo.collection(defineVal.boxListsColection).findOneAndUpdate({ boxName: boxName },
                                { $set: updateQuery }, function (err, res) {
                                    if (err) reject(err);
                                    else {
                                        //console.log(res)
                                        resolve(res);
                                        db.close();
                                    }
                                });
                        }
                    }
                });

            }
        });
    });
}

function insertTableToBox(tableInfo) {
    let username = tableInfo.head.boxOwner;
    let boxName = tableInfo.head.boxName;

    return new Promise((resolve, reject) => {
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err)
                reject(err);
            else {
                const dbName = defineVal.dbUser + username;
                var dbo = db.db(dbName);
                let tableName = tableInfo.head.tableName;
                var newTable = {
                    tableName: tableName,
                    tableData: tableInfo.tableContent,
                    created: new Date(),
                    lastEdit: new Date()
                }
                dbo.collection(defineVal.boxTablesColection + boxName).insertOne(newTable, function (err, res) {
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log(tableName + " off " + boxName + " was add!");

                        resolve(res.insertedId);
                        db.close();
                    }
                });
            }
        });
    });
}

function getBoxDetail(request) {
    let boxName = request.boxName;
    let username = request.owner;

    let queryJson = { boxName: boxName };

    return new Promise((resolve, reject) => {
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err) {
                reject(err);
            } else {
                const dbName = defineVal.dbUser + username;
                var dbo = db.db(dbName);
                dbo.collection(defineVal.boxListsColection).findOne(queryJson, function (err, box) {
                    if (err) reject(err);
                    else {
                        resolve(box);
                        db.close();
                    }
                });
            }
        });
    });
}

var ObjectId = require('mongodb').ObjectId; 



function getTableDetail(tableInfo) {
    let username = tableInfo.boxOwner;
    let boxName = tableInfo.boxName;
    
    let queryJson = {"_id": ObjectId(tableInfo.tableID)}      


    return new Promise((resolve, reject) => {
        MongoClient.connect(defineVal.baseUrl, function (err, db) {
            if (err)
                reject(err);
            else {
                const dbName = defineVal.dbUser + username;
                var dbo = db.db(dbName);
                dbo.collection(defineVal.boxTablesColection + boxName).findOne(queryJson, function (err, table) {
                    if (err) {
                        throw err;
                    }
                    else {
                        resolve(table);
                        db.close();
                    }
                });
            }
        });
    });
}








module.exports = {
    checkExitsUser: checkExitsUser,
    checkExitsBox: checkExitsBox,
    insertTableToBox: insertTableToBox,
    insertBoxToLists: insertBoxToLists,
    getBoxesList: getBoxesList,
    getBoxDetail: getBoxDetail,
    updateBoxInfo: updateBoxInfo,
    getTableDetail: getTableDetail
}