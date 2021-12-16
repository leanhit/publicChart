//define of login status
const invalidResult = 'ko';
const validResult = 'ok';
const jwtExpired = 2;
const loginInvalidUsername = 0;
const loginInvalidPassword = 1;


//define of database
const dbAllUser = 'dbAllUser';
const baseUrl = 'mongodb://localhost:27017/';
const userColection = 'users';
const dbUser = 'userDB_';


//define db of jswToken
const refreshTokenCollection = 'refreshToken';

//define db of pandoraBox
const boxListsColection = 'boxLists';
const boxTablesColection = 'boxTable';
const boxDB = 'box_';
const dbList = 'dbList';
const isExitBoxName = true;
const isBoxDatabaeCreated = true;

const private = "private";
const public = "public";

module.exports = {
    jwtExpired: jwtExpired,
    invalidResult: invalidResult,
    validResult: validResult,
    loginInvalidUsername: loginInvalidUsername,
    loginInvalidPassword: loginInvalidPassword,

    dbAllUser: dbAllUser,
    baseUrl: baseUrl,
    userColection: userColection,
    dbUser: dbUser,
    refreshTokenCollection: refreshTokenCollection,
    boxDB: boxDB,

    boxListsColection: boxListsColection,
    boxTablesColection: boxTablesColection,
    dbList: dbList,
    isExitBoxName: isExitBoxName,
    isBoxDatabaeCreated: isBoxDatabaeCreated,
    private: private,
    public: public

}