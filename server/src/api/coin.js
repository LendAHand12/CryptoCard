var fs = require('fs');
//SERVICES
var express = require('express');
var router = express.Router();
require('dotenv').config()
const moment = require('moment')
const coinpayment = require('../lib/coinpayment');
const customerQuery = require('../sockets/queries/customerQuery');
const {
    error_400,
    error_500,
    success
} = require('../message');
const {
    updateBalanceWalletOrUserBonus
} = require('../sockets/functions');
const {
    getPriceCoin
} = require('../commons/functions/validateObj');
const {
    bonusDeposit,
    validationDepositCoin
} = require('../commons');

const {
    sendMail,
    sendMailTransfer,
    sendMailForgotPassword,
    sendMailWithdrawSwaptobe,
    sendMailWithdraw,
    sendMailDeposit,
    sendMailDepositCoinpayment
} = require('../sockets/functions/verifyEmail');
// var walletcode = require('../.././services/wallet_code.js')
// var deposit_confirm = require('../.././services/deposit_confirm')
// var deposit = require('../.././services/deposit')
// var user = require('../.././services/user')
// const dbTrackingBalance = require('../../services/tracking_balance')

// var botTelegram = require('../.././lib/devteamHelper')
// const binance = require('node-binance-api')().options({
//     APIKEY: '<key>',
//     APISECRET: '<secret>',
//     useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
//     test: true // If you want to use sandbox mode where orders are simulated
// });
function getItemToString(symbol) {
    let ERC20 = symbol.indexOf('.ERC20')
    if (ERC20 == -1) return true

    let TRC20 = symbol.indexOf('.TRC20')
    console.log(TRC20,"Asassa");
    if (TRC20 == -1) return true

    let BEP20 = symbol.indexOf('.BEP20')
    if (BEP20 == -1) return true

    return false

}

function responseAPI(status, message, data) {
    var result = {
        status: status,
        message: message,
        data: data
    };
    return result;
}
router.post('/depositCoinpayment', async (req, res) => {
    try {
        const data = req.body
        const hmac = req.headers.hmac
        //console.log("Headers hmac: ", hmac)
        //console.log("Body request: ", data)
        const ipn_type  = data.ipn_type 
        const status_response = +data.status
        if (status_response >= 100 && ipn_type == 'deposit') {
            var address = data.address;
            // var currency = data.currency;
            let walletRaws
            if (data.dest_tag) {
                walletRaws = await customerQuery.getWalletToAddressLabel(`address`, address, data.dest_tag)
            } else {
                walletRaws = await customerQuery.getWalletToAddress(`address`, address)
            }
            if (walletRaws.length > 0) {
                let quantity = data.amount
                let code = data.currency
                let txhash = data.txn_id
                let symbol = code + "USDT";
                let userid = walletRaws[0].userid
                let date_time = moment().format("YYYY-MM-DD")
                const transaction = await customerQuery.checkTransaction(txhash)
                const flag = await validationDepositCoin(code, quantity)
                if (!flag) return error_400(res, `error amount`)
                if (transaction.length > 0) {
                    //console.log("coinpayment  hoat dong nhung ton tai txhash ssssssssss")
                    var message = `- Sàn: *BEEMARKET*\n- *Tracking coinpayments webhook deposit*\nCó một giao dịch bị trùng txhash lúc deposit\n=>Txhash: ${txhash}`;
                    error_400(res, message, 2)
                    //   botTelegram.sendMessage(message);
                } else {
                    const symbol = code.replace('')
                    if (code == 'USDT.ERC20') {
                        let USD = parseFloat(quantity).toFixed(2)
                        //      * parseFloat(0.985)
                        //  USD = parseFloat(USD).toFixed(2)
                        //console.log('quantity:' + quantity + "parseFloat quantity 2: " + parseFloat(quantity).toFixed(6) + " - " + "USD parseFloat 2:" + USD)
                        const user = await customerQuery.getUserToId(userid)
                        // const amountUserUpdate = user[0].usdt_balance + parseFloat(quantity).toFixed(6)
                        const amountUserUpdate = USD
                        const walletUser = await customerQuery.getWalletToIdUser(userid, "USDT")
                        let amountBefore = walletUser[0].amount
                        let amountAfter = parseFloat(amountBefore) + parseFloat(USD)
                        await updateBalanceWalletOrUserBonus(userid, "USDT", amountUserUpdate)
                        await bonusDeposit("USDT", "STF_TRC20", quantity, userid)
                        await customerQuery.addTransacitonCoin(txhash, userid, parseFloat(quantity).toFixed(6), address, address, `${code} Deposit`, "usdt", parseFloat(quantity).toFixed(6), amountBefore, amountAfter)
                        await messageTelegram(`[DEPOSIT] User ${user[0].username} deposit ${parseFloat(quantity).toFixed(6)} ${code} success. Txhash: ${txhash}`)
                        try {
                            await sendMailDepositCoinpayment(user[0].email, `[${process.env.NAME} DEPOSIT] ` + user[0].username + ': ' + quantity + ' ' + code, user[0].username, quantity, code, txhash)
                        } catch {}
                        success(res, "update wallet success !!")
                        // insertDeposit(userid, date_time, code, quantity, USD, txhash, res);
                    } else if (code == 'USDT.TRC20') {
                        let USD = parseFloat(quantity).toFixed(2)
                        //      * parseFloat(0.985)
                        //  USD = parseFloat(USD).toFixed(2)
                        //console.log('quantity:' + quantity + "parseFloat quantity 2: " + parseFloat(quantity).toFixed(6) + " - " + "USD parseFloat 2:" + USD)
                        const user = await customerQuery.getUserToId(userid)
                        // const amountUserUpdate = user[0].usdt_balance + parseFloat(quantity).toFixed(6)
                        const amountUserUpdate = parseFloat(quantity).toFixed(6)
                        const walletUser = await customerQuery.getWalletToIdUser(userid, "USDT")
                        let amountBefore = walletUser[0].amount
                        let amountAfter = parseFloat(amountBefore) + parseFloat(USD)
                        console.log(amountBefore, amountAfter);
                        await updateBalanceWalletOrUserBonus(userid, "USDT", USD)
                        await bonusDeposit("USDT", "STF_TRC20", quantity, userid)
                        await customerQuery.addTransacitonCoin(txhash, userid, parseFloat(quantity).toFixed(6), address, address, `${code} Deposit`, "usdt", parseFloat(quantity).toFixed(6), amountBefore, amountAfter)
                        await messageTelegram(`[DEPOSIT] User ${user[0].username} deposit ${parseFloat(quantity).toFixed(6)} ${code} success. Txhash: ${txhash}`)
                        try {
                            await sendMailDepositCoinpayment(user[0].email, `[${process.env.NAME} DEPOSIT] ` + user[0].username + ': ' + quantity + ' ' + code, user[0].username, quantity, code, txhash)
                        } catch {}
                        success(res, "update wallet success !!")
                        // insertDeposit(userid, date_time, code, quantity, USD, txhash, res);

                    } else if (code == 'WIN.BEP20') {
                        let USD = parseFloat(quantity).toFixed(6)
                        //      * parseFloat(0.985)
                        //  USD = parseFloat(USD).toFixed(2)
                        //console.log('quantity:' + quantity + "parseFloat quantity 2: " + parseFloat(quantity).toFixed(6) + " - " + "USD parseFloat 2:" + USD)
                        const user = await customerQuery.getUserToId(userid)
                        const walletUser = await customerQuery.getWalletToIdUser(userid, "WIN")
                        let amountBefore = walletUser[0].amount
                        let amountAfter = parseFloat(amountBefore) + parseFloat(USD)
                        await updateBalanceWalletOrUserBonus(userid, "WIN", USD)
                        await bonusDeposit("WIN", "STF_TRC20", quantity, userid)
                        await customerQuery.addTransacitonCoin(txhash, userid, parseFloat(quantity).toFixed(6), address, address, `${code} Deposit`, "win", parseFloat(quantity).toFixed(6), amountBefore, amountAfter)
                        await messageTelegram(`[DEPOSIT] User ${user[0].username} deposit ${parseFloat(quantity).toFixed(6)} ${code} success. Txhash: ${txhash}`)
                        try {
                            await sendMailDepositCoinpayment(user[0].email, `[${process.env.NAME} DEPOSIT] ` + user[0].username + ': ' + quantity + ' ' + code, user[0].username, quantity, code, txhash)
                        } catch {}
                        success(res, "update wallet success !!")
                        // insertDeposit(userid, date_time, code, quantity, USD, txhash, res);

                    } else if (code == 'BNB.BSC' || code == 'BNB.ERC20' || code == "BNB") {
                        console.log(quantity);
                        let USD = parseFloat(quantity).toFixed(6)
                        const user = await customerQuery.getUserToId(userid)
                        //      * parseFloat(0.985)
                        //  USD = parseFloat(USD).toFixed(2)
                        //console.log('quantity:' + quantity + "parseFloat quantity 2: " + parseFloat(quantity).toFixed(6) + " - " + "USD parseFloat 2:" + USD)
                        let walletUser = await customerQuery.getWalletToIdUser(userid, "BNB")
                        if (walletUser.length > 0) { } else {
                            const resWallet = await coinpayment.createWallet("BNB")
                            await customerQuery.addWalletCode(idUser, user[0].username, resWallet.address, symbol, resWallet.label)
                        }
                        // let walletUser = await customerQuery.getWalletToIdUser(userid, "BNB")
                        // if(walletUser.length<=0){
                        //     await customerQuery.addWalletCodeVND(user[0].id, user[0].username, "BNB")
                        //     walletUser = await customerQuery.getWalletToIdUser(userid, "BNB")
                        // }
                        
                        let amountBefore = walletUser[0].amount
                        let amountAfter = parseFloat(amountBefore) + parseFloat(USD)
                        await customerQuery.addTransacitonCoin(txhash, userid, parseFloat(quantity).toFixed(6), address, address, `${code} Deposit`, "BNB", parseFloat(quantity).toFixed(6), amountBefore, amountAfter)
                    
                        await updateBalanceWalletOrUserBonus(userid, "BNB", parseFloat(quantity).toFixed(6))
                        await bonusDeposit("BNB", "STF_TRC20", quantity, userid)
                        await messageTelegram(`[DEPOSIT] User ${user[0].username} deposit ${parseFloat(quantity).toFixed(6)} ${code} success. Txhash: ${txhash}`)
                        try {
                            await sendMailDepositCoinpayment(user[0].email, `[${process.env.NAME} DEPOSIT] ` + user[0].username + ': ' + quantity + ' ' + code, user[0].username, quantity, code, txhash)
                        } catch {}
                        success(res, "update wallet success !!")
                        // insertDeposit(userid, date_time, code, quantity, USD, txhash, res);

                    } else { //chi cho phep deposit usdt erc20
                        //console.log('khac usdt khong cong live, ma txhash: ' + txhash)
                        const flagItem = getItemToString(code)
                        if (flagItem) {
                            code = code.replace('.ERC20', '')
                            code = code.replace('.TRC20', '')
                            code = code.replace('.BEP20', '')
                            const walletFlagItem = await customerQuery.getWalletToIdUser(userid, code)
                            if (walletFlagItem.length <= 0) {
                                const user = await customerQuery.getUserToId(userid)
                                await customerQuery.addWalletCodeVND(userid, user[0].username, code)
                            }
                        }

                        let USD = parseFloat(quantity).toFixed(6)
                        //      * parseFloat(0.985)
                        //  USD = parseFloat(USD).toFixed(2)
                        //console.log('quantity:' + quantity + "parseFloat quantity 2: " + parseFloat(quantity).toFixed(8) + " - " + "USD parseFloat 2:" + USD)
                        const walletUser = await customerQuery.getWalletToIdUser(userid, code)
                        let amountBefore = walletUser[0].amount
                        let amountAfter = parseFloat(amountBefore) + parseFloat(USD)
                        console.log(amountBefore, amountAfter);

                        const user = await customerQuery.getUserToId(userid)
                        await customerQuery.addTransacitonCoin(txhash, userid, parseFloat(quantity).toFixed(8), address, address, `${code} Deposit`, code.toLowerCase(), parseFloat(quantity).toFixed(8), amountBefore, amountAfter)
                        await updateBalanceWalletOrUserBonus(userid, code, parseFloat(quantity).toFixed(8))
                        await bonusDeposit(code, "STF_TRC20", quantity, userid)
                        await messageTelegram(`[DEPOSIT] User ${user[0].username} deposit ${parseFloat(quantity).toFixed(8)} ${code} success. Txhash: ${txhash}`)
                        try {
                            await sendMailDepositCoinpayment(user[0].email, `[${process.env.NAME} DEPOSIT] ` + user[0].username + ': ' + quantity + ' ' + code, user[0].username, quantity, code, txhash)
                        } catch {}
                        success(res, "update wallet success !!")
                        //  binance.prices(symbol, (error, ticker) => {
                        //    //console.log(error)
                        //      var USD = quantity * ticker[symbol] * 0.97
                        //    //console.log('khac usdt')
                        //      // insertDeposit(userid, date_time, code, quantity, USD, txhash, res);
                        //  })
                    }
                }
            } else {
                error_400(res, "Cannot find wallet " + address, 1)
            }
            // coinpayment.verifyDeposit(async (hmac, data, isVerify) => {
            //   //console.log("coinpayment  hoat dong xxxxxxxxxxxxxx")
            //     if (isVerify) {

            //         ///////////////////////

            //     } else {
            //       //console.log(moment().format("YYYY-MM-DD HH:mm:ss") + " - BEEMARKET - Coinpayments send deposit IsValid")
            //     }
            // })
        } else {
            error_400(res, "Data is not define")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
})

async function insertDeposit(userid, date_time, code, quantity, USD, txhash, address, res) {

    ///////
    deposit_confirm.depositSuccess(userid, date_time, code, quantity, USD, txhash, function (resultDeposit) {
        if (resultDeposit) {
            //console.log("insertDeposit xxxxxxxxxxxxxx")
            //Tracking balance
            dbTrackingBalance.trackingBalance(userid, USD, `Nạp ${quantity} ${code}`, 'DEPOSIT');
            user.getUserByID(userid, (name) => {
                if (name) {
                    //console.log("getUserByID  xxxxxxxxxxxxxx")
                    // var message = '- Sàn: *BEEMARKET*\n- Người nộp: *' + name.username + '*\n- Số tiền nạp: *' + quantity + ' (' + code + ')*\n=> *' + USD + '* USD\n- txHash: ' + txhash;
                    // botTelegram.sendMessage(message);
                }
            });
            var result = responseAPI(true, null, null);
            res.send(result);
        } else {
            var result = responseAPI(false, "Transaction Fail", null);
            res.send(result);
        }
    });
}
module.exports = router