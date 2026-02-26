const { connection } = require('../../database/database');
const customerQuery = require('./customerQuery');
const coinQuery = require('./coinQuery');

module.exports = {
    
    checkExistUserQuery: async function (params) {
        return await customerQuery.checkExistUserQuery(params);
    },
    insertUserQuery: async function (params) {
        return await customerQuery.insertUserQuery(params);
    },
    insertUserVerifyQuery: async function (params, code) {
        return await customerQuery.insertUserVerifyQuery(params, code);
    },
    checkVerifyEmailQuery: async function (params, code) {
        return await customerQuery.checkVerifyEmailQuery(params, code);
    },
    getCoinListQuery: async function (params, code) {
        return await coinQuery.getCoinListQuery(params, code);
    },
    checkAllUser: async function() {
        return await customerQuery.checkAllUser()
    }
    // checkWalletBase58: async function (params, code) {
    //     return await customerQuery
    // }
    // checkUser : async function (params)

}