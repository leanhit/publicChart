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
const dbUser = 'dbUser_';
const refreshTokenCollection = 'refreshToken';


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
    refreshTokenCollection: refreshTokenCollection

}