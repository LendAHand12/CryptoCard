 const customerService = require('./customerService');
const walletService = require('./walletService');
const { jsonResp } = require('../models/jsonResponse');
const customer2FA = require('./customer2FA');
const customerTron = require('./customerTron');
const payment = require('./getCoinApi')
module.exports = {
    //Customer log-in service.
    login12Characters: (params, socketIO, io) => {
        return customerService.login12Characters(params,socketIO, io)
    },
    turnToken: (params, socketIO, io) => {
        return customerService.turnToken(params)
    },
    getListToken: (params, socketIO, io) => {
        return customerService.getListToken(params)
    },
    convertCoin: (params, socketIO, io) => {
        return customerService.convertCoin(params)
    },
    forgotPassword: (params, socketIO, io) => {
        return customerService.forgotPassword(params)
    },
    sendMailForgetPassword: (params, socketIO, io) => {
        return customerService.sendMailForgetPassword(params)
    },
    turnOn12Characters: (params, socketIO, io) => {
        return customerService.turnOn12Characters(params)
    },
    get12Characters: (params, socketIO, io) => {
        return customerService.get12Characters(params)
    },
    getHistory: (params, socketIO, io) => {
        return customerService.getHistory(params)
    },
    addTokenToUser: (params, socketIO, io) => {
        return customerService.addTokenToUser(params, socketIO, io)
    },
    sreachToken: (params, socketIO, io) => {
        return customerService.sreachToken(params, socketIO, io)
    },
    getProfile: (params, socketIO, io) => {
        return customerService.getProfile(params, socketIO, io)
    },
    getPriceConvert: (params, socketIO, io) => {
        return customerService.getPriceConvert(params, socketIO, io)
    },
    test: (params) => {
        return customerService.test(params)
    },
    getAllToken: (params, socketIO, io) => {
        return customerService.getAllToken(params, socketIO, io)
    },
    getBalance: (params, socketIO, io) => {
        return customerService.getBalance(params, socketIO, io)
    },
    updateTokenApp: (params, socketIO, io) => {
        return customerService.updateTokenApp(params, socketIO, io)
    },
    addTokenApp: (params, socketIO, io) => {
        return customerService.addTokenApp(params, socketIO, io)
    },
    loginSave: (params, socketIO, io) => {
        return customerService.loginSave(params, socketIO, io)
    },
    getSubWallet: (params) => {
        return payment.getSubWallet(params, socketIO, io)
    },
    getBalances: (params, socketIO, io) => {
        return payment.getBalances(params, socketIO, io)
    },
    sendMail: (params, socketIO, io) => {
        return customerService.sendMail(params, socketIO, io)
    },
    signUp: (params, socketIO, io) => {
        return customerService.signUp(params, socketIO, io)
    },
    loginVina: (params, socketIO, io) => {
        return customerService.loginVina(params, socketIO, io)
    },
    generateOTPToken: (params, socketIO, io) => {
        return customer2FA.generateOTPToken(params, socketIO, io)
    },
    turnOn2FA: (params, socketIO, io) => {
        return customer2FA.turnOn2FA(params, socketIO, io)
    },
    turnOff2FA: (params, socketIO, io) => {
        return customer2FA.turnOff2FA(params, socketIO, io)
    },
    createWallet: (params, socketIO, io) => {
        return customerService.createWallet(params, socketIO, io)
    },
    tranfer: (params, socketIO, io) => {
        return customerService.tranfer(params, socketIO, io)
    },

}