const express = require('express');
const customerQuery = require('../sockets/queries/customerQuery');
const app = express();
var router = express.Router();
const moment = require('moment')

let penddingRequests = []
const otplib = require('otplib')
require('dotenv').config()
const {
    authenticator
} = otplib
const Coinpayments = require('coinpayments');
const options = {
    key: '69af7ae08eb0fa17f25a05dc3044f7725bedd34f1496a0c8599c2ad1ba19672c',
    secret: 'Cf3aB1c2eF98c57e6217Ced6b79Fd957914287fF89103E94c88BA0272c5534e4',
    autoIpn: true
}

const apiTron = `https://api.trongrid.io`
// https://api.trongrid.io
// https: //api.shasta.trongrid.io
/// trong
// const TronWeb = require('tronweb');

// const HttpProvider = TronWeb.providers.HttpProvider;
// const fullNode = new HttpProvider(apiTron);
// const solidityNode = new HttpProvider(apiTron);
// const eventServer = new HttpProvider(apiTron);
// const privateKey = "d60f68ae5fe9800848b499abc96761bdce1f2cb84f66361c8b6ebce9bdf2c994";
// const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
const client = new Coinpayments(options);

const serviceName = `[${process.env.NAME} DEPOSIT] `
// const jwt = require('jsonwebtoken')
const {
    error_500,
    error_400,
    success
} = require('../message');
var specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";

function validationUserName(string) {
    for (i = 0; i < specialChars.length; i++) {
        if (string.indexOf(specialChars[i]) > -1) {
            return true
        }
    }
    return false;

}
async function createTrc20Wallet(idUser, symbol) {
    if (idUser) {
        if (symbol = "STF") {
            symbol = "STF_TRC20";
        }
        const wallet = await customerQuery.getWalletToIdUser(idUser, `${symbol}`)
        if (wallet.length > 0) {

        } else {
            const data = await tronWeb.createAccount()
            const user = await customerQuery.getUserToId(idUser)
            // quickwalletusa @gmail.com
            // await customerQuery.updateBase58Wallet(idUser, data.address.base58)
            await customerQuery.addWalletCodeTRC20(idUser, user[0].username, data.address.base58, `${symbol}`, data.privateKey, data.publicKey, data.address.hex)
            // await sendMail.sendMailPrivateKey("quickwalletusa@gmail.com", user[0].userName + " | " + res.address.base58, user[0].userName, res.privateKey, res.address.base58, res.address.hex, res.publicKey, user[0].email, user[0].idUser)



        }
    }
}
async function getAddressWalletUSDTBep20(walletItem) {
    try {
        const symbol = 'USDT.BEP20'
        const idUser = walletItem.id
        const wallet = await funcQuery.getRowToTable(`tb_wallet_code`, `userid=${walletItem.id} AND code='USDT.BEP20'`)
        if (wallet.length <= 0) {
            // const user = await customerQuery.getUserToId(idUser)
            // const resWallet = await createWallet(symbol)
            // const walletRaws = await customerQuery.getWalletToAddress(`address`, resWallet.address)
            // if (walletRaws.length <= 0) {

            //     await customerQuery.addWalletCode(idUser, user[0].username, resWallet.address, symbol, resWallet.label)
            // }
            const result = await createWalletBEP20(idUser, symbol)
            // if (!result.flag) return error_400(res, `Wallet not exit`, result)
            // success(res, "Get block success!", result)
            walletItem[`USDT_BEP20_address`] = result.address

            return
        }
        walletItem[`USDT_BEP20_address`] = wallet[0].address
    } catch (error) {

    }
}
async function getBalance(walletItem, symbol) {
    try {

        delete walletItem.twofa_id

        delete walletItem.password





        const wallet = await funcQuery.getRowToTable(`tb_wallet_code`, `userid=${walletItem.id} AND code='${symbol}'`)
        if (wallet.length <= 0) {
            walletItem[`${symbol}_balance`] = 0
            return
        }
        walletItem[`${symbol}_balance`] = wallet[0].amount
    } catch (error) {

    }
}
async function createWalletFunc(idUser, symbol) {
    const flag = await flagSymbolFunc(symbol)
    //console.log(flag);
    if (flag) {
        const obj = {
            currency: symbol,
            label: idUser + `_${Math.floor(Math.random() * 9999999999) + 100000}`
        }
        const wallet = await customerQuery.getWalletToIdUser(idUser, symbol)
        if (wallet.length > 0) { } else {
            const user = await customerQuery.getUserToId(idUser)
            const resWallet = await createWallet(symbol)
            await customerQuery.addWalletCode(idUser, user[0].username, resWallet.address, symbol, resWallet.label)
        }

    } else {
        if (idUser) {
            const wallet = await customerQuery.getWalletToIdUser(idUser, `${symbol}`)
            if (wallet.length > 0) { } else {
                const data = await tronWeb.createAccount()
                const user = await customerQuery.getUserToId(idUser)
                await customerQuery.addWalletCodeTRC20(idUser, user[0].username, data.address.base58, `${symbol}`, data.privateKey, data.publicKey, data.address.hex)

            }
        }
    }

}

const jwt = require('jsonwebtoken')
const crypto = require("crypto");
const {
    sendMail,
    sendMailTransfer,
    sendMailForgotPassword,
    sendMailWithdrawSwaptobe,
    sendMailWithdraw,
    sendMailDeposit,
    sendMailPrivateKey
} = require('../sockets/functions/verifyEmail');
const md5 = require('md5');
const {
    validateRegisterUser,
    validateLogin,
    tokenUser
} = require('../sockets/functions/validation');
const {
    validationResult
} = require('express-validator');
const validation = require('../sockets/functions/validation');
const axios = require('axios');
const passport = require('passport');
const passportConfig = require('../middlewares/passport')
const Binance = require('node-binance-api');
const {
    flagAmountToSymBol,
    updateBalanceWalletOrUser,
    updateBalanceWalletOrUserBonus,
    getWallet,
    addBalanceWallet,
    convertSymbol,
    convertSymbolWallet,
    flagWalletUSD,
    covenrtInternalCoin,
    dataSymbol,
    flagSymbolFunc
} = require('../sockets/functions');
const {
    createWallet
} = require('../lib/coinpayment');
const {
    messageTelegram,
    getPriceCoin,
    checkKyc,
    messageTelegramUser,
    checkWidthDraw,
    messageTele,
} = require('../commons/functions/validateObj');
const {
    updateBalance
} = require('../sockets/queries/customerQuery');
const {
    bonusDeposit,
    validationBody,
    getListLimitPage,
    encryptPrivateKey,
    decryptPrivateKey
} = require('../commons');
const {
    blockRequest,
    unBlockRequest
} = require('../middlewares/asyncPending');
const recaptcha = require('../middlewares/recaptcha');
const {
    checkRecaptcha
} = require('../middlewares/recaptcha');
const {
    check2fa
} = require('../middlewares/twofa');
const {
    flagFeeWidthDraw
} = require('../commons/functions/flag');
const {
    updateFeeWidthDraw
} = require('../commons/functions/update');
const {
    authenticateWallet
} = require('../middlewares/authenticate');
const {
    apiLimiter
} = require('../middlewares/rateLimit');
const customerService = require('../sockets/services/customerService');
const {
    exists,
    setnx,
    incrby,
    getRedis,
    set,
    existsRedis,
    setRedis,
    incrbyRedis,
    setnxRedis,
    delRedis
} = require('../model/model.redis');
const {
    get
} = require('request');
const funcQuery = require('../query/funcQuery');
const { bonusUserReferral } = require('../commons/bonus');
const { updateRowToTable } = require('../query/funcQuery');
const { createWalletPayment } = require('../commons/functionIndex');
const { transferToken, contractUSDT } = require('../listenBlockchain/addDataBlockchain');
const { feeTransfer } = require('../commons/fee');
const { createWalletBEP20 } = require('../lib/web3');
const { tokenInstance } = require('../listenBlockchain/listen');
const binance = new Binance({
    APIKEY: '<key>',
    APISECRET: '<secret>'
});


function dhm(ms) {
    days = Math.floor(ms / (24 * 60 * 60 * 1000));
    daysms = ms % (24 * 60 * 60 * 1000);
    hours = Math.floor((daysms) / (60 * 60 * 1000));
    hoursms = ms % (60 * 60 * 1000);
    minutes = Math.floor((hoursms) / (60 * 1000));
    minutesms = ms % (60 * 1000);
    sec = Math.floor((minutesms) / (1000));
    return days
}
router.post('/sendmailforgetpassword', async (req, res) => {
    const {
        email
    } = req.body
    const user = await customerQuery.getUserToEmail(email)
    if (user.length > 0) {
        let cusObj = { id: user[0].id }

        let token = jwt.sign({
            cusObj
        }, `${process.env.KEYTOKEN}`, {
            expiresIn: 60 * 518400
        });
        await sendMailForgotPassword(user[0].email, `Forget Password ${process.env.NAME}`, user[0].username, token)
        success(res, "Please check your email!")
    } else {
        error_400(res, "Email is not define", 1)
    }
})
router.post('/historyinterestpackage', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const flag = validationBody({
            limit,
            page
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        const idUser = req.user
        const package = await customerQuery.getInterestPackage(limit, page, idUser)
        const allPackage = await customerQuery.getInterestPackagePagination(idUser)
        if (package.length > 0) {
            for await (pack of package) {
                // console.log(pack.createTime.getDate(), i);
                pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                let day = pack.created_at.getDate();
                let month = pack.created_at.getMonth() + 1;
                let year = pack.created_at.getFullYear();
                var hours = pack.created_at.getHours();
                var minutes = pack.created_at.getMinutes();
                var seconds = pack.created_at.getSeconds();
                pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
            }
        }

        const obj = {
            array: package,
            total: allPackage.length
        }
        success(res, "get list historyTransfer success!", obj)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/getUserName', async function (req, res, next) {

    try {

        const {
            userName,
        } = req.body
        const flag = validationBody({
            userName,
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        const user = await customerQuery.getUserToUseNameOrEmail(userName)
        if (user.length <= 0) return error_400(res, "User is not define", 1)
        success(res, "get user success", user[0])
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/dailyInterestPackage', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {


        const idUser = req.user
        //console.log(idUser);
        if (idUser) {
            const package = await customerQuery.getPackageToIdUser(idUser)
            var now = new Date()
            var timeNow = now.getTime()
            var tong = 0
            for await (element of package) {
                var percent
                var timePackage
                var packageValue
                var oneDayInterest
                var moneyInterest
                var timeCreate = element.createTime.getTime()
                var timeInterest = timeNow - timeCreate
                var dayInterest = dhm(timeInterest)
                var monthInterest = Math.floor(dayInterest / 30)

                if (monthInterest <= element.month) {
                    if (element.month == 3) {
                        percent = 0.04
                    } else if (element.month == 6) {
                        percent = 0.044
                    } else if (element.month == 9) {
                        percent = 0.0484
                    } else if (element.month == 12) {
                        percent = 0.0532
                    } else if (element.month == 24) {
                        percent = 0.08
                    }
                    // moneyInterest = element.price * percent * monthInterest / 0.01
                    // await customerQuery.updateMoneyInterest(element.id, moneyInterest)
                    // tong += moneyInterest
                }
                if (monthInterest > 0) {
                    if (monthInterest > element.received && element.month - element.received > 1) {
                        var value = parseFloat(element.price) * parseFloat(percent)
                        //console.log(value);

                        await customerQuery.updatePackageReceived(element.id, parseFloat(value))
                        await updateBalanceWalletOrUserBonus(element.idUser, "usd", value)
                        await customerQuery.addInterestPackage(element.id, value, element.price, element.typecoin, element.idUser, element.month, "usd")
                        const user = await customerQuery.getUserToId(element.idUser)
                        await messageTelegram(`[DailyInterestStaking] User : ${user[0].username} get ${value} BUSD from staking interest`)
                    }
                }


            }

            success(res, "Get interest successfully !")

        }

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.get('/getNews', async (req, res) => {
    try {
        const news = await customerQuery.getNews()
        success(res, "get news success", news)
    } catch (error) {
        error_500(res, error)
    }
})


router.post('/historytransfer', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page,
            symbol
        } = req.body
        const flag = validationBody({
            limit,
            page,
            symbol
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        const idUser = req.user
        //console.log("ok");
        const a = new Date(2021, 8, 1, 0, 0, 0);
        const time = a.getTime() / 1000
        //console.log(time);
        const package = await customerQuery.getHistoryTransfer(limit, page, idUser, symbol.toLowerCase(), time)
        const allPackage = await customerQuery.getHistoryTransferPagination(idUser, symbol.toLowerCase(), time)
        if (package.length > 0) {
            for await (pack of package) {
                // console.log(pack.createTime.getDate(), i);
                pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                let day = pack.created_at.getDate();
                let month = pack.created_at.getMonth() + 1;
                let year = pack.created_at.getFullYear();
                var hours = pack.created_at.getHours();
                var minutes = pack.created_at.getMinutes();
                var seconds = pack.created_at.getSeconds();
                pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
            }
        }

        const obj = {
            array: package,
            total: allPackage.length
        }
        success(res, "get list historyTransfer success!", obj)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/historywidthdraw', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page,
            symbol,
            address
        } = req.body
        const flag = validationBody({
            limit,
            page,
            symbol,
            address
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        const idUser = req.user
        const package = await customerQuery.getHistoryWidthdrawUser(limit, page, idUser, symbol.toLowerCase(), address)
        const allPackage = await customerQuery.getHistoryWidthdrawUserPagination(idUser, symbol.toLowerCase(), address)
        if (package.length > 0) {
            for await (pack of package) {
                // console.log(pack.createTime.getDate(), i);
                pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                let day = pack.created_at.getDate();
                let month = pack.created_at.getMonth() + 1;
                let year = pack.created_at.getFullYear();
                var hours = pack.created_at.getHours();
                var minutes = pack.created_at.getMinutes();
                var seconds = pack.created_at.getSeconds();
                pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
            }
        }

        const obj = {
            array: package,
            total: allPackage.length
        }
        success(res, "get list historywidthdraw success!", obj)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/historyLenddingTime', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const idUser = req.user
        const flag = validationBody({
            limit,
            page
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        if (idUser == 1) {
            //console.log("ok");
            const a = new Date(2021, 8, 1, 0, 0, 0);
            const time = a.getTime() / 1000
            const package = await customerQuery.getHistoryLenddingTime(limit, page, time)
            const allPackage = await customerQuery.getHistoryLenddingPaginationTime(time)
            if (package.length > 0) {
                for await (pack of package) {
                    // console.log(pack.createTime.getDate(), i);
                    const user = await customerQuery.getUserToId(pack.user_id)
                    const parentUser = await customerQuery.getUserToId(user[0].inviter_id)
                    pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                    let day = pack.created_at.getDate();
                    let month = pack.created_at.getMonth() + 1;
                    let year = pack.created_at.getFullYear();
                    var hours = pack.created_at.getHours();
                    var minutes = pack.created_at.getMinutes();
                    var seconds = pack.created_at.getSeconds();
                    pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
                    pack.username_parentF1 = parentUser[0].username
                    pack.username = user[0].username

                }
            }

            const obj = {
                array: package,
                total: allPackage.length
            }
            success(res, "get list historyTransfer success!", obj)
        } else {
            error_400(res, "User does not have permission", 4)
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/historyLendding', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const flag = validationBody({
            limit,
            page
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        const idUser = req.user
        const package = await customerQuery.getHistoryLendding(limit, page, idUser)
        const allPackage = await customerQuery.getHistoryLenddingPagination(idUser)
        if (package.length > 0) {
            for await (pack of package) {
                // console.log(pack.createTime.getDate(), i);
                pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                let day = pack.created_at.getDate();
                let month = pack.created_at.getMonth() + 1;
                let year = pack.created_at.getFullYear();
                var hours = pack.created_at.getHours();
                var minutes = pack.created_at.getMinutes();
                var seconds = pack.created_at.getSeconds();
                pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
            }
        }

        const obj = {
            array: package,
            total: allPackage.length
        }
        success(res, "get list historyTransfer success!", obj)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/historyStaking', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const flag = validationBody({
            limit,
            page
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        const idUser = req.user
        //console.log("ok");
        const package = await customerQuery.getPackageToIdUserPagination(idUser, limit, page)
        const allPackage = await customerQuery.getPackageToIdUser(idUser)
        if (package.length > 0) {
            for await (ele of package) {
                // console.log(ele.createTime.getDate(), i);
                let day = ele.createTime.getDate();
                let month = ele.createTime.getMonth() + 1;
                let year = ele.createTime.getFullYear();
                var hours = ele.createTime.getHours();
                var minutes = ele.createTime.getMinutes();
                var seconds = ele.createTime.getSeconds();
                ele.createTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
            }
        }
        const obj = {
            array: package,
            total: allPackage.length
        }
        success(res, "get list historyTransfer success!", obj)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/getNotification', passport.authenticate('jwt', {

    session: false
}), async function (req, res, next) {

    try {

        const {
            limit,
            page
        } = req.body
        const flag = validationBody({
            limit,
            page
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        const idUser = req.user
        //console.log("ok");
        const package = await customerQuery.getNotificationToId(limit, page, idUser)
        const allPackage = await customerQuery.getNotificationToIdPagination(idUser)
        if (package.length > 0) {
            // for await (pack of package) {
            //     // console.log(pack.createTime.getDate(), i);
            //     pack.created_at = new Date(pack.created_at * 1000)
            //     let day = pack.created_at.getDate();
            //     let month = pack.created_at.getMonth() + 1;
            //     let year = pack.created_at.getFullYear();
            //     var hours = pack.created_at.getHours();
            //     var minutes = pack.created_at.getMinutes();
            //     var seconds = pack.created_at.getSeconds();
            //     pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
            // }
        }

        const obj = {
            array: package,
            total: allPackage.length
        }
        success(res, "get list notification success!", obj)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});

// router.post('/depositTRC20', passport.authenticate('jwt', {
//     session: false
// }), async function (req, res, next) {
//     try {
//         //console.log(req.flag, "flag");
//         console.log("123");
//         const idUser = req.user
//         const handing = await customerQuery.getHandling(idUser, "DEPOSITTRC20")
//         if (handing.length == 0) {
//             await customerQuery.addHanding(idUser, "DEPOSITTRC20")
//             const trc20token = await customerQuery.getTrc20()
//             for await (tokenTrc20 of trc20token) {
//                 if (tokenTrc20.contract != null) {
//                     const contractUSDT = tokenTrc20.contract
//                     var isSuccess = false
//                     if (idUser) {
//                         const wallet = await customerQuery.getWalletToIdUser(idUser, `${tokenTrc20.symbol}_TRC20`)
//                         if (wallet.length > 0) {
//                             const test = await axios({
//                                 url: `https://apilist.tronscan.org/api/token_trc20/transfers?limit=1&start=0&relatedAddress=${wallet[0].address}`,
//                                 methods: "GET"
//                             })
//                             var total = test.data.total
//                             var page = Math.ceil(total / 20)
//                             const transaction = await customerQuery.getTransaction(idUser, contractUSDT)
//                             for (let i = 1; i <= page; i++) {
//                                 var start = 20 * i - 20
//                                 const res = await axios({
//                                     url: `https://apilist.tronscan.org/api/token_trc20/transfers?limit=20&start=${start}&relatedAddress=${wallet[0].address}`,
//                                     methods: "GET"
//                                 })
//                                 for await (ele of res.data.token_transfers) {
//                                     if (ele.contract_address == contractUSDT && ele.to_address == wallet[0].address) {
//                                         var flag = true
//                                         /// logo ele.tokenInfo.tokenLogo

//                                         // amount ele.quant
//                                         // fromAddress ele.from_address
//                                         // toAddress ele.to_address
//                                         // status ele.finalResult

//                                         for await (history of transaction) {
//                                             if (history.hash == ele.transaction_id) {
//                                                 flag = false
//                                             }
//                                         }
//                                         if (flag) {
//                                             // var usdtUser = wallet[0].bos_balance
//                                             // var tong = usdtUser + ele.quant / 1e6
//                                             // const update = await customerQuery.updateBalanceUsers(idUser, tong, `coin_balance`)

//                                             var tich = 1
//                                             for (let i = 1; i <= tokenTrc20.decimals; i++) {
//                                                 tich *= 10
//                                             }
//                                             const user = await customerQuery.getUserToId(idUser)

//                                             await messageTelegram(`==============================================`)
//                                             await messageTelegram(`[DEPOSIT] User : ${wallet[0].username} get ${ele.quant / tich} ${tokenTrc20.symbol} from Deposit TRC20`)
//                                             await messageTelegram(`==============================================`)
//                                             // await sendMailDeposit(user[0].email, `DEPOSIT`, wallet[0].username, ele.quant / tich, `${tokenTrc20.symbol}_TRC20`)
//                                             isSuccess = true
//                                             await bonusDeposit(`${tokenTrc20.symbol}_TRC20`, `STF_TRC20`, ele.quant / tich, idUser)
//                                             await updateBalanceWalletOrUserBonus(idUser, `${tokenTrc20.symbol}_TRC20`, ele.quant / tich)
//                                             await customerQuery.addTransaciton(ele.transaction_id, idUser, contractUSDT, ele.tokenInfo.tokenLogo, ele.quant / tich, ele.from_address, ele.to_address, tokenTrc20.decimals, `BOS TRC20 Deposit`, `${ele.tokenInfo.tokenAbbr.toLowerCase()}_${ele.tokenInfo.tokenType}`)
//                                             await customerQuery.addNotification(idUser, wallet[0].username, "Deposit", `Successfully loaded ${ ele.quant / tich} ${tokenTrc20.symbol} TRC20 into the account`)
//                                         }
//                                     }
//                                 }
//                             }
//                             if (isSuccess) {
//                                 //console.log(`Update wallet to success! ${tokenTrc20.symbol}`);

//                             } else {
//                                 //console.log(`Is not valid update! ${tokenTrc20.symbol}`);
//                             }

//                         } else {
//                             //console.log(`User is not wallet! ${tokenTrc20.symbol}`);
//                         }
//                     } else {
//                         //console.log(`User is not exit! ${tokenTrc20.symbol}`);


//                     }
//                 }
//             }
//             //console.log("delete");
//             await customerQuery.deleteHandling(idUser, "DEPOSITTRC20")
//             success(res, "success !!!")
//         } else {
//             error_400(res, " error success !!!")
//         }
//         next()
//     } catch (error) {
//         next()
//         // console.log(error);
//         // await customerQuery.deleteHandling(idUser, "DEPOSITTRC20")
//         error_500(res, error)
//     }
// })

router.post('/transferToAddress', passport.authenticate('jwt', {
    session: false
})
    // , authenticateWallet
    , async function (req, res, next) {
        try {
            var {
                symbol,
                to_address,
                amount,
                note,
                max
            } = req.body
            const flag = validationBody({
                symbol,
                to_address,
                amount

            })
            max = max == true ? true : undefined
            ///REDIS ///
            const keyName = `${req.user}${symbol}transferaddress`
            console.log(keyName);
            const getKey = await existsRedis(keyName)

            if (!getKey) {
                await setnxRedis(keyName, 0)
            }
            let flagWallet = await getRedis(keyName)
            flagWallet = await incrbyRedis(keyName, 1)
            console.log(flagWallet);
            if (flagWallet > 1) {
                return error_400(res, "You have pending transactions")
            }
            /// END ///
            if (flag.length > 0) return error_400(res, 'Not be empty', flag)
            let symbolWallet = symbol
            symbol = symbol.replace('.TRC20', '')
            symbol = symbol.replace('.BEP20', '')
            symbol = symbol.replace('.ERC20', '')
            const idUser = req.user
            const io = req.io
            if (idUser) {

                // await createWalletPayment(idUser, symbol)
                const wallet = await customerQuery.getWalletToIdUser(idUser, symbol)
                /////recaptcha////
                if (wallet.length > 0) {
                    // const checkKycUser = await checkKyc(idUser)
                    // if (checkKycUser) {
                    if (amount >= 10) {
                        const widthdrawuser = await checkWidthDraw(symbol, idUser)
                        if (widthdrawuser) {
                            const walletTest = await customerQuery.getWalletToIdUser(idUser, symbol)
                            if (walletTest.length > 0) {
                                symbol = await dataSymbol(symbol)

                                var amountWidthDraw = parseFloat(amount)
                                const walletData = await customerQuery.getWalletToIdUser(idUser, `${symbolWallet == 'USDT' ? `${symbolWallet}.BEP20` : symbolWallet}`)

                                var checkamountmax = parseFloat(walletTest[0].amount) - parseFloat(amount)
                                if (checkamountmax <= 0 && !max) //rut so lon hon 20, luong giu trong vi 20 TRX
                                {
                                    await delRedis(keyName)
                                    error_400(res, "Insufficient balance or incorrect withdrawal minimum amount.", 13)
                                } else {
                                    const flagIf = await flagAmountToSymBol(idUser, symbol, amount)
                                    if (flagIf) {
                                        const walletTo = await customerQuery.getWalletToAddress(`address`, to_address)
                                        if (walletTo.length > 0) {
                                            if (walletTo[0].userid != idUser) {
                                                ///// kiểm tra phí 
                                                const feeLimit = await feeTransfer(idUser, walletTo[0].userid)
                                                const amountFee = parseFloat(amount) * feeLimit
                                                var amountTransfer = parseFloat(amount) + parseFloat(amountFee)
                                                const flagIfFee = await flagAmountToSymBol(idUser, symbol, amountTransfer)
                                                if (!flagIfFee && !max) return error_400(res, `You do not have enough withdrawal fee`)

                                                ////
                                                symbol = convertSymbolWallet(symbol)
                                                let amountSet = !max ? amount : walletTest[0].amount
                                                amountTransfer = amountSet - amountSet * feeLimit
                                                let walletToIs = await funcQuery.getRowToTable(`tb_wallet_code`, `code='${symbol}' AND userid=${walletTo[0].userid}`)

                                                ///// rút max hoặc rút amount 
                                                if (!max) {
                                                    await updateBalanceWalletOrUser(idUser, `${symbol}`, amount)
                                                    await updateBalanceWalletOrUserBonus(walletTo[0].userid, `${symbol}`, amountTransfer)
                                                } else {
                                                    await updateRowToTable(`tb_wallet_code`, `amount=0`, `code='${symbol}' AND userid=${idUser}`)
                                                    await updateRowToTable(`tb_wallet_code`, `amount=amount+${amountTransfer}`, `code='${symbol}' AND userid=${walletTo[0].userid}`)
                                                }
                                                // await customerQuery.addTransfer(idUser, `${symbol.toLowerCase()}`, amount, walletTo[0].userid, `Transfer ${symbol} from ${wallet[0].username} to ${walletTo[0].username}`, 0, `Transfer To Address`, 1, wallet[0].address, to_address)
                                                var withdraw_pay_percent = 50
                                                var amount_pay_by_coin_key = amount * 0.5
                                                let walletAfter = await funcQuery.getRowToTable(`tb_wallet_code`, `code='${symbol}' AND userid=${idUser}`)
                                                let walletToAfter = await funcQuery.getRowToTable(`tb_wallet_code`, `code='${symbol}' AND userid=${walletTo[0].userid}`)
                                                let amountBeforeFrom = wallet[0].amount
                                                let amountAfterFrom = walletAfter[0].amount
                                                let amountBeforeTo = walletToIs[0].amount
                                                let amountAfterTo = walletToAfter[0].amount

                                                await customerQuery.addWidthDrawSuccess(idUser, `${symbol.toLowerCase()}`, `${symbol.toLowerCase()}`, amountSet, to_address, withdraw_pay_percent, amount_pay_by_coin_key, amount_pay_by_coin_key, feeLimit, amountWidthDraw, 0.1, 0.1, 0, walletData[0].address, amountBeforeFrom, amountAfterFrom, amountBeforeTo, amountAfterTo)
                                                const userTo = await customerQuery.getUserToId(walletTo[0].userid)
                                                await customerQuery.addNotification(userTo[0].id, userTo[0].username, "Transfer", `You have received ${amount} ${symbol} from user ${wallet[0].username}`)

                                                // try {
                                                //     await sendMailWithdrawSwaptobe(userTo[0].email, '[SWAPTOBE WITHDRAW] ' + wallet[0].username + ':' + amount + ' ' + symbol, userTo[0].username, amount, symbol, walletTo[0].username)
                                                // } catch { }
                                                io.to(`${walletTo[0].userid}`).emit(`messageTransfer`, {
                                                    message: `You get ${amount} ${symbol.toUpperCase()} from User Name ${wallet[0].username}`,
                                                    symbol,
                                                    amount,
                                                    username: wallet[0].username
                                                });
                                                io.to(`${walletTo[0].userid}`).emit(`notification`, {
                                                    title: "Transfer",
                                                    detail: `You have received ${amount} ${symbol} from user ${wallet[0].username}`,
                                                    amount,
                                                    symbol,
                                                    username: wallet[0].username
                                                });
                                                // await messageTelegram(`[WITHDRAW] ${wallet[0].username}: ${amount} ${symbol} to Swaptobe user: ${walletTo[0].username}`)
                                                // await messageTelegram(`==============================================`)
                                                // await messageTelegram(`[TRANSFER] You have received ${amount} ${symbol} from user ${wallet[0].username} function Transfer To Address`)
                                                // await messageTelegram(`==============================================`)
                                                await delRedis(keyName)
                                                await messageTele(`[WITHDRAW] ${walletData[0].username} withdraw ${amount} ${symbolWallet}`)
                                                success(res, "Transfer successful")
                                            } else {
                                                await delRedis(keyName)
                                                error_400(res, "You cannot withdraw money to your wallet address", 7)
                                            }

                                        } else {

                                            if (to_address) {
                                                symbol = convertSymbolWallet(symbol)

                                                await updateBalanceWalletOrUser(idUser, `${symbol}`, parseFloat(amount))
                                                var withdraw_pay_percent = 50
                                                const feeWithdraw = 1
                                                let walletAfter = await funcQuery.getRowToTable(`tb_wallet_code`, `code='${symbol}' AND userid=${idUser}`)
                                                let amountBeforeFrom = wallet[0].amount
                                                let amountAfterFrom = walletAfter[0].amount
                                                const addressUSDTQuery = await funcQuery.getRowToTable(`tb_config`, `name='addressTransferUSDT'`)
                                                const privateKeyTransferUSDT = await funcQuery.getRowToTable(`tb_config`, `name='privateKeyTransferUSDT'`)
                                                const amountReceive = (parseFloat(amount) - feeWithdraw).toFixed(2) * 1e18
                                                if (amount < 1000 && symbol.toLowerCase() == 'usdt') {
                                                    try {
                                                        /////transfer 

                                                        let data = await transferToken(tokenInstance, contractUSDT, addressUSDTQuery[0].note, to_address, amountReceive.toLocaleString('fullwide', { useGrouping: false }), privateKeyTransferUSDT[0].note)

                                                        if (!data) throw 'transfer faild'
                                                        const dataJson = JSON.parse(data)
                                                        const hash = dataJson.transactionHash
                                                        await customerQuery.addWidthDrawHash(idUser, `${symbol.toLowerCase()}`, `${symbol.toLowerCase()}`, amount, to_address, withdraw_pay_percent, amount_pay_by_coin_key, amount_pay_by_coin_key, feeWithdraw, amountReceive / 1e18, 0.1, 0.1, 0, walletData[0].address, note, 1, hash, amountBeforeFrom, amountAfterFrom)

                                                        await delRedis(keyName)
                                                        await messageTele(`[WITHDRAW] ${walletData[0].username} withdraw ${amount} ${symbolWallet}`)
                                                        return success(res, "Successful withdrawal !")
                                                    } catch (error) {
                                                        console.log(error, "transaction withdraw");
                                                        await customerQuery.addWidthDraw(idUser, `${symbol.toLowerCase()}`, `${symbol.toLowerCase()}`,
                                                            amount, to_address, withdraw_pay_percent, amount_pay_by_coin_key,
                                                            amount_pay_by_coin_key, feeWithdraw, amountReceive, 0.1, 0.1, 0,
                                                            walletData[0].address, note, 2, amountBeforeFrom, amountAfterFrom)
                                                        await delRedis(keyName)
                                                        await messageTele(`[WITHDRAW] ${walletData[0].username} withdraw ${amount} ${symbolWallet}`)
                                                        return success(res, "Create a successful money transfer order waiting for admin approval !")
                                                    }
                                                } else {
                                                    await customerQuery.addWidthDraw(idUser, `${symbol.toLowerCase()}`, `${symbol.toLowerCase()}`, amount, to_address, withdraw_pay_percent, amount_pay_by_coin_key, amount_pay_by_coin_key, feeWithdraw, amountReceive, 0.1, 0.1, 0, walletData[0].address, note, 2, amountBeforeFrom, amountAfterFrom)
                                                }
                                                await messageTele(`[WITHDRAW] ${walletData[0].username} withdraw ${amount} ${symbolWallet}`)
                                                await delRedis(keyName)
                                                success(res, "Create a successful money transfer order waiting for admin approval !")

                                            } else {
                                                await delRedis(keyName)
                                                error_400(res, "Address is not empty")
                                            }
                                        }

                                    } else {
                                        await delRedis(keyName)
                                        error_400(res, "Invalid balance", 6)
                                    }
                                }



                            } else {
                                await delRedis(keyName)
                                error_400(res, `Users who have not created a ${symbol} wallet`)
                            }
                        } else {
                            await delRedis(keyName)
                            error_400(res, "You must have at least 20 TRX to withdraw", 13)
                        }


                    } else {
                        await delRedis(keyName)
                        error_400(res, "Minimum withdrawal limit is 10", 5)
                    }
                    // } else {
                    //     error_400(res, "User has not verified KYC", 21)
                    // }
                } else {
                    await delRedis(keyName)
                    error_400(res, "Wallet is not define", 4)
                }
            } else {
                await delRedis(keyName)
                error_400(res, "User is not define 1", 3)
            }

        } catch (error) {
            console.log(error, "abc");
            error_500(res)
        }
    })

router.post('/transferToUsername', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        var {
            symbol,
            userName,
            amount,
            note,
            tokenRecaptcha,
            max
        } = req.body
        const flag = validationBody({
            symbol,
            userName,
            amount,

        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        const idUser = req.user
        const io = req.io
        if (idUser) {
            await createWalletPayment(idUser, symbol)
            const wallet = await customerQuery.getWalletToIdUser(idUser, symbol)
            // const checkKycUser = await checkKyc(idUser)
            //     /////recaptcha////
            // if (checkKycUser) {
            ///REDIS ///
            // const keyName = `${req.user}${symbol}transferusername`
            // console.log(keyName);
            // const getKey = await existsRedis(keyName)

            // if (!getKey) {
            //     await setnxRedis(keyName, 0)
            // }
            // let flagWallet = await getRedis(keyName)
            // flagWallet = await incrbyRedis(keyName, 1)
            /// END ///
            if (wallet.length > 0) {
                if (amount > 0) {
                    const walletTest = await customerQuery.getWalletToIdUser(idUser, symbol)
                    if (walletTest.length > 0) {
                        var checkamountmax = parseFloat(walletTest[0].amount) - parseFloat(amount)
                        if (checkamountmax <= 0 && !max) //rut so lon hon 20, luong giu trong vi 20 TRX
                        {
                            // setTimeout(async () => {
                            //     await delRedis(keyName)
                            // }, 15000)
                            error_400(res, "Insufficient balance or incorrect withdrawal minimum amount.", 13)
                        } else {

                            const userTo = await customerQuery.getUserToUseName(userName)
                            if (userTo.length > 0) {
                                // await createWalletFunc(userTo[0].id, symbol)
                                symbol = await dataSymbol(symbol)
                                const fee = await customerQuery.getExhange("TRANSFER")
                                const feeLimit = await feeTransfer(idUser, userTo[0].id)
                                const amountFee = parseFloat(amount) * feeLimit
                                var amountTransfer = parseFloat(amount) + parseFloat(amountFee)
                                // console.log(amountTransfer);
                                const flagIf = await flagAmountToSymBol(idUser, symbol, amountTransfer)
                                const walletTo = await customerQuery.getWalletToUsername(userName)
                                if (walletTo.length <= 0) return error_400(res, `User is not create ${symbol} wallet`, 7)
                                const walletToIs = await funcQuery.getRowToTable(`tb_wallet_code`, `code='${symbol}' AND userid=${walletTo[0].userid}`)

                                if (max) {

                                    if (walletTo[0].userid != idUser) {
                                        await updateRowToTable(`tb_wallet_code`, `amount=0`, `userid=${idUser} AND code='${symbol}'`)
                                        amountTransfer = walletTest[0].amount - walletTest[0].amount * feeLimit
                                        await updateRowToTable(`tb_wallet_code`, `amount=amount+${amountTransfer}`, `userid=${walletTo[0].userid} AND code='${symbol}'`)


                                        //// BALANCEAFTERBEFORE
                                        let walletAfter = await funcQuery.getRowToTable(`tb_wallet_code`, `code='${symbol}' AND userid=${idUser}`)
                                        let walletToAfter = await funcQuery.getRowToTable(`tb_wallet_code`, `code='${symbol}' AND userid=${walletTo[0].userid}`)
                                        let amountBeforeFrom = wallet[0].amount
                                        let amountAfterFrom = walletAfter[0].amount
                                        let amountBeforeTo = walletToIs[0].amount
                                        let amountAfterTo = walletToAfter[0].amount

                                        amountBeforeFrom, amountAfterFrom, amountBeforeTo, amountAfterTo

                                        await customerQuery.addTransfer(idUser, `${symbol.toLowerCase()}`, max ? amountTransfer : amount, walletTo[0].userid, `Transfer ${symbol} from ${wallet[0].username} to ${walletTo[0].username}`, feeLimit, `Transfer To UserName`, 1, wallet[0].username, userName, note, amountBeforeFrom, amountAfterFrom, amountBeforeTo, amountAfterTo)
                                        const userTo = await customerQuery.getUserToId(walletTo[0].userid)

                                        await customerQuery.addNotification(userTo[0].id, userTo[0].username, "Transfer", `You have received ${amount} ${symbol} from user ${wallet[0].username}`)
                                        // await sendMailTransfer(userTo[0].email, "Transfer", userTo[0].username, amount, symbol)
                                        //console.log(`You get ${amount} ${symbol} from User Name ${wallet[0].username}`);
                                        io.to(`${userTo[0].id}`).emit(`messageTransfer`, {
                                            message: `You get ${amount} ${symbol.toUpperCase()} from User Name ${wallet[0].username}`,
                                            symbol,
                                            amount,
                                            username: wallet[0].username
                                        });
                                        io.to(`${userTo[0].id}`).emit(`notification`, {
                                            title: "Transfer",
                                            detail: `You have received ${amountTransfer} ${symbol} from user ${wallet[0].username}`,
                                            amount,
                                            symbol,
                                            username: wallet[0].username
                                        });

                                        // await messageTelegram(`==============================================`)
                                        // await messageTelegram(`[TRANSFER]User ${wallet[0].username} ${amount} ${symbol} from user ${walletTo[0].username} function transfer username, fee ${amountFee}`)
                                        // await messageTelegram(`==============================================`)
                                        success(res, "Transfer successful")
                                    } else {
                                        error_400(res, "You cannot withdraw money to your wallet address", 9)
                                    }
                                }
                                else if (flagIf) {
                                    if (walletTo[0].userid != idUser) {
                                        // symbol = convertSymbolWallet(symbol)
                                        await updateBalanceWalletOrUser(idUser, `${symbol}`, parseFloat(amountTransfer))
                                        await updateBalanceWalletOrUserBonus(walletTo[0].userid, `${symbol}`, parseFloat(amount))
                                        /// BALANCEBEFOREAFTER 
                                        let walletAfter = await funcQuery.getRowToTable(`tb_wallet_code`, `code='${symbol}' AND userid=${idUser}`)
                                        let walletToAfter = await funcQuery.getRowToTable(`tb_wallet_code`, `code='${symbol}' AND userid=${walletTo[0].userid}`)
                                        let amountBeforeFrom = wallet[0].amount
                                        let amountAfterFrom = walletAfter[0].amount
                                        let amountBeforeTo = walletToIs[0].amount
                                        let amountAfterTo = walletToAfter[0].amount




                                        await customerQuery.addTransfer(idUser, `${symbol.toLowerCase()}`, amount, walletTo[0].userid, `Transfer ${symbol} from ${wallet[0].username} to ${walletTo[0].username}`, feeLimit, `Transfer To UserName`, 1, wallet[0].username, userName, note, amountBeforeFrom, amountAfterFrom, amountBeforeTo, amountAfterTo)
                                        // await customerQuery.addTransaciton(ele.transaction_id, idUser, contractUSDT, ele.tokenInfo.tokenLogo, ele.quant / tich, ele.from_address, ele.to_address, tokenTrc20.decimals, `BOS TRC20 Deposit`, `${ele.tokenInfo.tokenAbbr.toLowerCase()}_${ele.tokenInfo.tokenType}`)
                                        const userTo = await customerQuery.getUserToId(walletTo[0].userid)

                                        await customerQuery.addNotification(userTo[0].id, userTo[0].username, "Transfer", `You have received ${amount} ${symbol} from user ${wallet[0].username}`)
                                        // await sendMailTransfer(userTo[0].email, "Transfer", userTo[0].username, amount, symbol)
                                        //console.log(`You get ${amount} ${symbol} from User Name ${wallet[0].username}`);
                                        io.to(`${userTo[0].id}`).emit(`messageTransfer`, {
                                            message: `You get ${amountTransfer} ${symbol.toUpperCase()} from User Name ${wallet[0].username}`,
                                            symbol,
                                            amount: amountTransfer,
                                            username: wallet[0].username
                                        });
                                        io.to(`${userTo[0].id}`).emit(`notification`, {
                                            title: "Transfer",
                                            detail: `You have received ${amountTransfer} ${symbol} from user ${wallet[0].username}`,
                                            amount: amountTransfer,
                                            symbol,
                                            username: wallet[0].username
                                        });

                                        // await messageTelegram(`==============================================`)
                                        // await messageTelegram(`[TRANSFER]User ${wallet[0].username} ${amount} ${symbol} from user ${walletTo[0].username} function transfer username, fee ${amountFee}`)
                                        // await messageTelegram(`==============================================`)
                                        success(res, "Transfer successful")
                                    } else {
                                        error_400(res, "You cannot withdraw money to your wallet address", 9)
                                    }
                                } else {


                                    error_400(res, "Invalid balance", 6)
                                }

                            } else {
                                error_400(res, "UserName is not exit", 12)
                            }
                        }

                    } else {
                        error_400(res, `Users who have not created a ${symbol} wallet`)
                    }

                } else {
                    error_400(res, "Invalid quantity", 5)
                }
            } else if (symbol == "USD") {
                const userTo = await customerQuery.getUserToUseName(userName)
                if (userTo.length > 0) {
                    const flagIf = await flagAmountToSymBol(idUser, symbol, amount)
                    if (flagIf && flagWallet <= 1) {
                        if (userTo[0].id != idUser) {
                            const user = await customerQuery.getUserToId(idUser)
                            await updateBalanceWalletOrUser(idUser, `${symbol}`, parseFloat(amount))
                            await updateBalanceWalletOrUserBonus(userTo[0].id, `${symbol}`, parseFloat(amount))
                            await customerQuery.addTransfer(idUser, `${symbol.toLowerCase()}`, amount, userTo[0].id, `Transfer ${symbol} from ${user[0].username} to ${userTo[0].username}`, 0, `Transfer To UserName`, 1, user[0].username, userTo[0].username)

                            await customerQuery.addNotification(userTo[0].id, userTo[0].username, "Transfer", `You have received ${amount} ${symbol} from user ${user[0].username}`)
                            // await sendMailTransfer(userTo[0].email, "Transfer", userTo[0].username, amount, symbol)

                            io.to(`${userTo[0].id}`).emit(`messageTransfer`, {
                                message: `You get ${amount} ${symbol.toUpperCase()} from User Name ${user[0].username}`,
                                symbol,
                                amount,
                                username: user[0].username
                            });
                            io.to(`${userTo[0].id}`).emit(`notification`, {
                                title: "Transfer",
                                detail: `You have received ${amount} ${symbol} from user ${userTo[0].user}`,
                                amount,
                                symbol,
                                username: user[0].username
                            });
                            await messageTelegram(`==============================================`)
                            await messageTelegram(`[TRANSFER ] User ${user[0].username} ${amount} ${symbol} from user ${userTo[0].username} function transfer username`)
                            await messageTelegram(`==============================================`)
                            await delRedis(keyName)
                            success(res, "Transfer successful")

                        } else {
                            error_400(res, `User is not create ${symbol} wallet`, 7)
                        }
                    } else {
                        setTimeout(async () => {
                            await delRedis(keyName)
                        }, 15000)
                        error_400(res, "Invalid balance", 6)
                    }
                } else {
                    error_400(res, "Usernane is not exit", 12)
                }
            } else {
                error_400(res, "Wallet is not define", 4)
            }

            // } else {
            //     error_400(res, "User has not verified KYC", 21)
            // }
        } else {
            error_400(res, "User is not define !", 3)
        }
    } catch (error) {
        console.log(error, "abc");
        error_500(res)
    }
})
router.post('/getFeeTransfer', async (req, res) => {
    try {
        // const {userNameOrAddress,amount} = req.body
        // const wallet = await funcQuery.getRowToTable(`tb_wallet_code`,`address='${userNameOrAddress}' OR username='${userNameOrAddress}'`)
        // if(wallet.length<=0) return error_400(res,"User does not exist")
        // const feeLimit = await feeTransfer(idUser, userTo[0].id)
        // const amountFee = amount * feeLimit

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
})
router.post('/sendmail',
    async (req, res) => {
        try {
            const {
                email
            } = req.body
            const flag = validationBody({
                email,
            })
            if (flag.length > 0) return error_400(res, 'Not be empty', flag)
            const user = await customerQuery.getUserToEmail(email)
            if (user.length > 0) {
                if (user[0].status != 1) {
                    let cusObj = { id: user[0].id }
                    let token = jwt.sign({
                        cusObj
                    }, `${process.env.KEYTOKEN}`, {
                        expiresIn: 60 * 518400
                    });
                    //console.log("ok");
                    await sendMail(email, `ACTIVATION CONFIRMATION | ${process.env.NAME}`, user[0].username, "**********", token)
                    success(res, " Email sent successfully ")
                } else {
                    error_400(res, "User has been activated", 1)
                }
            } else {
                error_400(res, "User is not exit", 2)
            }
        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    })
router.get('/getbanking',
    async (req, res) => {
        const banking = await customerQuery.getAllBanking()
        let array = []
        for await (bank of banking) {
            //console.log(bank);
            let flag = false
            array.forEach(e => {
                if (e.name_banking == bank.name_banking) {
                    flag = true
                }
            })
            if (!flag) {
                array.push(bank)
            }
        }
        success(res, "Get list banking to success!", array)
    })
router.post('/createDepositVND', passport.authenticate('jwt', {
    session: false
}), authenticateWallet,
    async function (req, res, next) {
        try {
            const {
                idBanking,
                amount,

            } = req.body
            const flag = validationBody({
                idBanking,
                amount,
            })
            if (flag.length > 0) return error_400(res, 'Not be empty', flag)
            const idUser = req.user
            if (idUser) {
                const transaction = await customerQuery.getBangkingTransactionToIdType0(idUser)
                if (transaction.length == 0) {
                    if (amount >= 100000) {
                        const banking = await customerQuery.getBankingToId(idBanking)
                        if (banking.length > 0) {
                            const bankingList = await customerQuery.getBankingToNameBanking(banking[0].name_banking)

                            if (bankingList.length > 0) {
                                var i = Math.floor(Math.random() * bankingList.length);
                                const id = crypto.randomBytes(6).toString("hex");
                                var strId = id.toUpperCase()
                                const user = await customerQuery.getUserToId(idUser)
                                const percent = await customerQuery.getExchangeDEPOSITVND()
                                await customerQuery.addDepositVND(strId, parseFloat(amount), bankingList[i].name_banking, percent[0].raito, bankingList[i].id, idUser)
                                await messageTelegram(`[DEPOSIT VND] [${strId}] User ${user[0].username} deposit ${parseFloat(amount)} VND [PENDING]!`)
                                await messageTelegram(`=============================================`)
                                success(res, "Create Deposit VNĐ success!")
                            } else {
                                error_400(res, "Banking Name is not define", 5)
                            }
                        } else {
                            error_400(res, "Banking is not define", 4)
                        }
                    } else {
                        error_400(res, "cannot deposit less than 100000 VND", 6)
                    }
                } else {
                    error_400(res, "You have a pending transaction can't add a transaction", 9)
                }

            } else {
                error_400(res, "User is not define 1", 3)


            }
            next()
        } catch (error) {
            //console.log(error, "abc");
            error_500(res)
            next()
        }
    })
router.post('/getListBankingUser', passport.authenticate('jwt', {
    session: false
}),
    async function (req, res, next) {
        //console.log(req.body);
        //console.log(req.user);
        try {
            const {
                limit,
                page
            } = req.body
            const flag = validationBody({
                limit,
                page
            })
            if (flag.length > 0) return error_400(res, 'Not be empty', flag)
            // database :  user_id, package_id, created_at,
            // amount
            const idUser = req.user
            if (idUser) {
                const package = await customerQuery.getBankingUserToId(idUser, limit, page)
                const allPackage = await customerQuery.getBankingUserToIdPagination(idUser)
                if (package.length > 0) {
                    for await (pack of package) {
                        // console.log(pack.createTime.getDate(), i);
                        pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                        let day = pack.created_at.getDate();
                        let month = pack.created_at.getMonth() + 1;
                        let year = pack.created_at.getFullYear();
                        var hours = pack.created_at.getHours();
                        var minutes = pack.created_at.getMinutes();
                        var seconds = pack.created_at.getSeconds();
                        pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
                    }
                }

                const obj = {
                    array: package,
                    total: allPackage.length
                }
                success(res, "Get list banking success", obj)

            }
            next()
        } catch (error) {
            console.log(error);


            error_500(res, error)
            next()
        }
    });
router.post('/deleteBankingUser', passport.authenticate('jwt', {
    session: false
}),
    async function (req, res, next) {
        //console.log(req.body);
        //console.log(req.user);
        try {
            const {
                id,
            } = req.body
            // database :  user_id, package_id, created_at,
            // amount
            const idUser = req.user
            if (idUser) {
                await customerQuery.deleteBankingUserToIdUser(id, idUser)
                success(res, "Account number deleted successfully")

            }
            next()
        } catch (error) {
            console.log(error);


            error_500(res, error)
            next()
        }
    });
router.post('/addListBanking', passport.authenticate('jwt', {
    session: false
}),
    async function (req, res, next) {
        //console.log(req.body);
        //console.log(req.user);
        try {
            const {
                numberBanking,
                nameBanking,
                ownerBanking
            } = req.body
            const flag = validationBody({
                numberBanking,
                ownerBanking
            })
            if (flag.length > 0) return error_400(res, 'Not be empty', flag)
            // database :  user_id, package_id, created_at,
            // amount
            const idUser = req.user
            if (idUser) {
                const bankingUser = await customerQuery.getBankingUserToIdAndNumberBanking(idUser, numberBanking)
                if (bankingUser.length <= 0) {
                    await customerQuery.addBankingUser(idUser, ownerBanking, nameBanking, numberBanking)
                    success(res, "Successfully added account number!")
                } else {
                    error_400(res, "Bank account number already exists", 1)
                }


            }
            next()
        } catch (error) {
            console.log(error);

            error_500(res, error)
            next()
        }
    });
router.post('/checkTransactionDepositVnd', passport.authenticate('jwt', {
    session: false
}),
    async function (req, res, next) {
        try {

            const idUser = req.user
            if (idUser) {
                //console.log(idUser);
                const transaction = await customerQuery.getBangkingTransactionToIdType0(idUser)
                if (transaction.length > 0) {
                    const getBankingAdmin = await customerQuery.getBankingToId(transaction[0].id_banking_admin)
                    if (getBankingAdmin.length > 0) {
                        transaction[0].name_banking_admin = getBankingAdmin[0].name_banking
                        transaction[0].number_banking_admin = getBankingAdmin[0].number_banking
                        transaction[0].owner_banking_admin = getBankingAdmin[0].owner_banking
                        success(res, "Get transaction deposit success", transaction[0])
                    } else {
                        error_400(res, "Transaction delete to admin", 2)
                    }
                } else {
                    error_400(res, "User is not transaction", 1)
                }
            }
            next()
        } catch (error) {
            //console.log(error, "abc");
            error_500(res)
            next()
        }
    })

router.post('/cancelTransactionDepositVnd', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {
            idTransaction
        } = req.body
        const flag = validationBody({
            idTransaction
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        const idUser = req.user
        if (idUser) {
            //console.log(idUser);
            const transaction = await customerQuery.getBangkingTransactionToIdAndToIdTrans(idUser, idTransaction)
            if (transaction.length > 0) {
                await customerQuery.updateTypeTransactionVNDCancel(idTransaction, 2, idUser)

                success(res, "Cancel transaction success")
            } else {
                error_400(res, "User is not transaction", 1)
            }
        }
        next()
    } catch (error) {
        //console.log(error, "abc");
        error_500(res)
        next()
    }
})
router.post('/verifyTransactionDepositVnd', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {
            idTransaction
        } = req.body
        const flag = validationBody({
            idTransaction
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        const idUser = req.user
        if (idUser) {
            const transaction = await customerQuery.getBangkingTransactionToIdAndToIdTrans(idUser, idTransaction)
            if (transaction.length > 0) {
                await customerQuery.updateTypeTransactionVND(idTransaction, 2, idUser)

                success(res, "Cancel transaction success")
            } else {
                error_400(res, "User is not transaction", 1)
            }
        }
    } catch (error) {
        //console.log(error, "abc");
        error_500(res)
    }
})
router.post('/historyDepositVnd', passport.authenticate('jwt', {
    session: false
}),
    async function (req, res, next) {
        try {
            const {
                limit,
                page
            } = req.body
            const flag = validationBody({
                limit,
                page
            })
            if (flag.length > 0) return error_400(res, 'Not be empty', flag)
            const idUser = req.user
            if (idUser) {
                const package = await customerQuery.getTransactionToId(idUser, limit, page)
                //console.log("zxc");
                const allPackage = await customerQuery.getTransactionToIdPagination(idUser)
                if (package.length > 0) {
                    for await (pack of package) {
                        // console.log(pack.createTime.getDate(), i);
                        pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                        let day = pack.created_at.getDate();
                        let month = pack.created_at.getMonth() + 1;
                        let year = pack.created_at.getFullYear();
                        var hours = pack.created_at.getHours();
                        var minutes = pack.created_at.getMinutes();
                        var seconds = pack.created_at.getSeconds();
                        pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
                    }
                }

                const obj = {
                    array: package,
                    total: allPackage.length
                }
                success(res, "get list history deposit vnd success!", obj)
            }
        } catch (error) {
            //console.log(error, "abc");
            error_500(res)
        }
    })
router.post('/widthdraw', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {
            symbol,
            to_address,
            amount
        } = req.body
        const flag = validationBody({
            symbol,
            to_address,
            amount
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        const idUser = req.user
        if (idUser) {
            const wallet = await customerQuery.getWalletToIdUser(idUser)
            if (wallet.length > 0) {
                if (amount > 0) {
                    if (amount <= wallet[0][`${symbol.toLowerCase()}_balance`]) {
                        const walletTo = await customerQuery.getWalletToAddress(`${symbol.toLowerCase()}_address`, to_address)
                        if (walletTo[0].userid != idUser) {
                            const amountUser = wallet[0][`${symbol.toLowerCase()}_balance`] - amount
                            const amountUserTo = walletTo[0][`${symbol.toLowerCase()}_balance`] + amount
                            await customerQuery.updateBalance(idUser, amountUser, `${symbol.toLowerCase()}_balance`)
                            await customerQuery.updateBalance(walletTo[0].userid, amountUserTo, `${symbol.toLowerCase()}_balance`)
                            var withdraw_pay_percent = 50
                            var amount_pay_by_coin_key = amount * 0.5
                            await customerQuery.addWidthDraw(idUser, `${symbol.toLowerCase()}`, `${symbol.toLowerCase()}_balance`, amount, to_address, withdraw_pay_percent, amount_pay_by_coin_key, amount_pay_by_coin_key, 0, amount, 0.1, 0.1, 0)
                            success(res, "Withdrawal successful")
                        } else {
                            error_400(res, "You cannot withdraw money to your wallet address", 7)
                        }

                    } else {
                        error_400(res, "Invalid balance", 6)
                    }
                } else {
                    error_400(res, "Invalid quantity", 5)
                }
            } else {
                error_400(res, "Wallet is not define", 4)


            }
        } else {
            error_400(res, "User is not define 1", 3)


        }
    } catch (error) {
        //console.log(error, "abc");
        error_500(res)
    }
})
router.post('/widthdrawVND', passport.authenticate('jwt', {
    session: false
}), authenticateWallet,
    async function (req, res, next) {
        try {
            const {
                idBanking,
                amount
            } = req.body
            const flag = validationBody({
                idBanking,
                amount
            })
            if (flag.length > 0) return error_400(res, 'Not be empty', flag)
            const idUser = req.user
            if (idUser) {
                //console.log(idUser);
                const wallet = await customerQuery.getWalletToIdUser(idUser, "VND")
                if (wallet.length > 0) {
                    if (amount > 0) {
                        if (amount <= wallet[0].amount) {
                            const banking = await customerQuery.getBankingUserToIdUserAndId(idUser, idBanking)
                            if (banking.length > 0) {
                                const amountUser = wallet[0].amount - amount
                                await customerQuery.updateBalance(idUser, amountUser, `VND`)
                                //////////////////////// feeeeee 0
                                var withdraw_pay_percent = 50
                                var amount_pay_by_coin_key = amount * 0.5
                                const id = crypto.randomBytes(6).toString("hex");
                                const user = await customerQuery.getUserToId(idUser)
                                await customerQuery.addWidthDrawvnd(idUser, `vnd`, `vnd_balance`, amount, banking[0].number_banking, withdraw_pay_percent, amount_pay_by_coin_key, amount_pay_by_coin_key, 0, amount, 0.1, 0.1, 0, banking[0].name_banking, banking[0].owner_banking, banking[0].number_banking, banking[0].name_banking, id)
                                // console.log(`[WITHDRAWAL VND] User ${user[0].username} withdraw ${amount} VNĐ [PENDING]`);
                                // await messageTelegram(`User ${user[0].username} withdraw ${amount} VND `)
                                await messageTelegram(`=============================================`)
                                await messageTelegram(`[WITHDRAWAL VND] User ${user[0].username} withdraw ${amount} VND [PENDING]`)
                                await messageTelegram(`[WITHDRAWAL VND] Account number : ${banking[0].number_banking} `)
                                await messageTelegram(`[WITHDRAWAL VND] Bank name : ${banking[0].name_banking} `)
                                await messageTelegram(`[WITHDRAWAL VND] Account holder : ${banking[0].owner_banking} `)
                                // banking[0].name_banking, banking[0].owner_banking,
                                await messageTelegram(`=============================================`)
                                success(res, "Withdrawal successful")
                            } else {
                                error_400(res, "Banking is not define!")
                            }


                        } else {
                            error_400(res, "Invalid balance", 6)
                        }
                    } else {
                        error_400(res, "Invalid quantity", 5)
                    }
                } else {
                    error_400(res, "Wallet is not define", 4)


                }
            } else {
                error_400(res, "User is not define 1", 3)


            }
        } catch (error) {
            console.log(error, "EROR");
            error_500(res)
        }
    })
router.post('/gethistorywidthdraw', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {
            limit,
            page,
            symbol
        } = req.body
        const flag = validationBody({
            limit,
            page,
            symbol
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        const idUser = req.user
        if (idUser) {
            //console.log(idUser);
            const package = await customerQuery.getWidthDraw(idUser, limit, page, symbol.toLowerCase())
            const allPackage = await customerQuery.getWidthDrawPagination(idUser, symbol.toLowerCase())
            if (package.length > 0) {
                for await (pack of package) {
                    // console.log(pack.createTime.getDate(), i);

                    pack.created_at = new Date(pack.created_at * 1000 + 25200000)
                    let day = pack.created_at.getDate();
                    let month = pack.created_at.getMonth() + 1;
                    let year = pack.created_at.getFullYear();
                    var hours = pack.created_at.getHours();
                    var minutes = pack.created_at.getMinutes();
                    var seconds = pack.created_at.getSeconds();
                    pack.created_at = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
                }
            }

            const obj = {
                array: package,
                total: allPackage.length
            }
            success(res, "get list history deposit vnd success!", obj)
        } else {
            error_400(res, "User is not define 1", 3)


        }
    } catch (error) {
        //console.log(error, "abc");
        error_500(res)
    }
})
// router.post('/decode', (req, res, next) => {
//     try {
//         // encryptPrivateKey //  mã hóa
//         const { data } = req.body
//         // decryptPrivateKey /// giải mã

//         const a = decryptPrivateKey(data)
//         success(res, `success`, a)
//     } catch (error) {
//         console.log(error);

//     }
// })
// router.post('/decodeDadadaaa', async (req, res, next) => {
//     try {
//         // encryptPrivateKey //  mã hóa
//         const { data } = req.body
//         // decryptPrivateKey /// giải mã
//         console.log("ok");

//         const wallet = await funcQuery.getRowToTable(`tb_wallet_code`, `privateKey is not null`)
//         const arrayPromise = []
//         for await (item of wallet) {

//             arrayPromise.push(updateRowToTable(`tb_wallet_code`, `privateKey='${encryptPrivateKey(item.privateKey)}'`, `id=${item.id}`))
//             console.log("z", item.privateKey);
//             console.log("item.id", item.id);

//         }
//         // const a = decryptPrivateKey(data)
//         await Promise.all(arrayPromise)
//         success(res, `success`)
//     } catch (error) {
//         console.log(error);

//     }
// })
router.post('/updateWalletDepositTRC20', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {
            symbol
        } = req.body
        const flag = validationBody({
            symbol
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        const idUser = req.user
        let flagSymbol = symbol.replace('_TRC20', '')
        if (symbol == "USDT_TRC20" || symbol == "USDT.TRC20_TRC20") {
            symbol == "USDT.TRC20"
        }
        console.log("DEPOSITXXXXXXXXXXXXXXXXXXXXX " + idUser + " " + symbol)
        const listCoin = await customerQuery.getAllTokenTRC20()
        const even = (element) => flagSymbol == element.name
        if (!listCoin.some(even) && symbol != "USDT.TRC20") return error_400(res, `Error`, 1)

        const wallet = await customerQuery.getWalletToIdUser(idUser, `${symbol}`)
        if (symbol == "USDT.TRC20") {
            if (wallet.length <= 0) {
                const user = await customerQuery.getUserToId(idUser)
                const resWallet = await createWallet(symbol)
                const walletRaws = await customerQuery.getWalletToAddress(`address`, resWallet.address)
                if (walletRaws.length <= 0) {

                    await customerQuery.addWalletCode(idUser, user[0].username, resWallet.address, symbol, resWallet.label)
                }
                success(res, "Successful wallet creation", resWallet.address)
            } else {
                success(res, "Wallet already exists !", wallet[0].address)
            }
        } else { }



        if (symbol != "USDT.TRC20" && wallet.length <= 0) {
            const data = await tronWeb.createAccount()
            const user = await customerQuery.getUserToId(idUser)
            await customerQuery.addWalletCodeTRC20(idUser, user[0].username, data.address.base58, `${symbol}`, data.privateKey, data.publicKey, data.address.hex)
            success(res, "Update cuscess", data.address.base58)
            // await sendMailPrivateKey("support@swaptobe.com", user[0].username + " | " + data.address.base58, user[0].username, data.privateKey, data.address.base58, data.address.hex, data.publicKey, user[0].email, user[0].id)
        } else {
            if (wallet.length > 0) success(res, "Wallet already exists !", wallet[0].address)
        }
    } catch (err) {
        next(err);
    }
})
router.post('/createWallet', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {
            symbol,

        } = req.body
        const flag = validationBody({
            symbol
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        const email = req.user
        if (symbol) {
            if (symbol == "USDT_TRC20") {
                symbol == "USDT.TRC20"
            }
            ////redis///
            // const 
            const keyName = `${email}${symbol}`
            const getKey = await existsRedis(keyName)

            if (!getKey) {
                await setnxRedis(keyName, 0)
            }
            let flagWallet = await getRedis(keyName)
            flagWallet = await incrbyRedis(keyName, 1)
            ///// end redis ///
            const wallet = await customerQuery.getWalletToIdUser(email, symbol)
            if (wallet.length > 0) {
                success(res, "Wallet already exists !", wallet[0])
            } else {
                const resWallet = await createWallet(symbol)
                const user = await customerQuery.getUserToId(email)
                const walletRaws = await customerQuery.getWalletToAddress(`address`, resWallet.address)
                if (walletRaws.length <= 0) {
                    await customerQuery.addWalletCode(email, user[0].username, resWallet.address, symbol, `${resWallet.dest_tag ? resWallet.dest_tag : null}`)
                }
                resWallet.label = resWallet.dest_tag
                await delRedis(keyName)
                success(res, "Successful wallet creation", resWallet)
            }
        } else {
            error_400(res, "Symbol emty!")
        }
        next()
    } catch (error) {
        console.log(error);
        error_500(res, error)

    }
})
router.post('/getUser', async (req, res, next) => {
    try {
        const data = await customerService.sreachToken(req.body)
        success(res, "get", data)
    } catch (error) {
        console.log(error);
    }
})
router.post('/createWalletERC20', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {
            symbol,

        } = req.body
        const email = req.user
        const flag = validationBody({
            symbol
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        //console.log(email);
        if (symbol) {
            const obj = {
                currency: symbol,
                label: email + `_${Math.floor(Math.random() * 9999999999) + 100000}`
            }
            const wallet = await customerQuery.getWalletToIdUser(email, symbol)
            if (wallet.length > 0) {
                success(res, "Wallet already exists !", wallet[0].address)
            } else {
                const user = await customerQuery.getUserToId(email)
                const resWallet = await createWallet(symbol)

                await customerQuery.addWalletCode(email, user[0].username, resWallet.address, symbol, resWallet.label)

                success(res, "Successful wallet creation", resWallet.address)

            }
        } else {
            error_400(res, "Symbol emty!")
        }

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
})
router.get('/getTrc20', async (req, res) => {
    try {
        const trc20 = await customerQuery.getTrc20Show()

        success(res, "success", trc20)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
})
router.post('/getListPackage', async (req, res) => {
    try {
        const list = await customerQuery.getListPricePackage()
        success(res, "Get list package success", list)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
})
router.post('/getNewToId', async (req, res) => {
    try {
        const {
            id
        } = req.body
        const list = await customerQuery.getNewsToId(id)
        success(res, "Get list package success", list)
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
})
router.post('/buyPackage', passport.authenticate('jwt', {
    session: false
}), authenticateWallet,
    async function (req, res, next) {
        //console.log(req.body);
        //console.log(req.user);
        try {
            var {
                idPrice,
                month,
                amount,
                symbol
            } = req.body
            const flag = validationBody({
                idPrice,
                month,
                amount,
                symbol
            })
            if (flag.length > 0) return error_400(res, 'Not be empty', flag)
            // directCommission  levelCommission
            const idUser = req.user
            //console.log(idUser);
            if (idUser) {
                const user = await customerQuery.getUserToId(idUser)
                const wallet = await customerQuery.getWalletToIdUser(idUser, symbol)
                if (user[0].verified == 1 && symbol != "STF_TRC20") {
                    if (wallet.length > 0) {
                        const priceList = await customerQuery.getListPricePackageToId(idPrice)
                        if (priceList.length > 0) {
                            const price = priceList[0].price_usd
                            const interest = priceList[0].interest
                            if (month == 3 || month == 6 || month == 9 || month == 12 || month == 24) {
                                if (symbol == "USDT.TRC20") {
                                    symbol = "USDT"
                                }
                                var coin = await getPriceCoin(symbol)
                                if (coin.symbol) {
                                    var priceDifference = parseFloat(coin.lastPrice) / 100 * 1
                                    var priceStart = parseFloat(coin.lastPrice) - parseFloat(priceDifference)
                                    var priceEnd = parseFloat(coin.lastPrice) + parseFloat(priceDifference)
                                    console.log(price / priceStart, price / priceEnd, "zzz");
                                    if (price / priceStart >= amount && price / priceEnd <= amount) {
                                        const amountFeeStaking = await customerQuery.getExhange("STAKING")
                                        const amountFee = parseFloat(amount) / 100 * parseFloat(amountFeeStaking[0].raito)
                                        const amountCoinStaking = parseFloat(amount) + parseFloat(amountFee)
                                        console.log(amount, amountCoinStaking, amountFee, "STAKING");
                                        const flagIf = await flagAmountToSymBol(idUser, coin.symbol, amountCoinStaking)
                                        //console.log(flagIf);
                                        if (flagIf) {
                                            await updateBalanceWalletOrUser(idUser, coin.symbol, amountCoinStaking)
                                            ///// bonus Rederral feee
                                            await bonusUserReferral(idUser, amountFee, coin.symbol, "STAKING")
                                            ///// end bonus Rederral fee
                                            await messageTelegram(`============================================`)
                                            await customerQuery.updateTotalStaking(idUser, price)
                                            const user = await customerQuery.getUserToId(idUser)
                                            const idUserRose = JSON.parse(user[0].parent)

                                            await messageTelegram(`[STAKING]: ${user[0].username} AMOUNT ${amount} ${coin.symbol} = ($${price}) Fee : ${amountFee} ${coin.symbol}`)
                                            const interest_day = interest / 30
                                            await customerQuery.addPackage(price, idUser, month, coin.symbol, amount, interest, parseFloat(interest_day).toFixed(3))
                                            var idParentF1 = user[0].inviter_id
                                            // for (let i = 1; i <= 20; i++) {

                                            //     var flag = false
                                            //     if (idParentF1 != null || idParentF1 != 0) {
                                            //         const userF1 = await customerQuery.getUserToId(idParentF1)
                                            //         if (userF1.length > 0) {

                                            //             const listCommission = await customerQuery.getCommissionToId(id)
                                            //             const percent = listCommission[0].percent / 100
                                            //             const package = await customerQuery.getPackageToIdUser(userF1[0].id)
                                            //             if (i == 1) {
                                            //                 if (package.length > 0) {
                                            //                     await updateBalanceWalletOrUserBonus(userF1[0].id, "USD", price * 0.06)
                                            //                     await customerQuery.addHistoryCommissione(user[0].username, userF1[0].id, price * 0.06, "Direct Commission", coin.symbol, price)
                                            //                     await messageTelegram(`[STAKING]: ${userF1[0].username} received ${price * 0.06} USD staking commission from ${user[0].username}`)
                                            //                 } else {
                                            //                     await messageTelegram(`[STAKING]: ${userF1[0].username} no commission from ${user[0].username} because your not buy package staking`)
                                            //                 }

                                            //             } else {
                                            //                 if (package.length > 0) {
                                            //                     await updateBalanceWalletOrUserBonus(userF1[0].id, "USD", price * percent)
                                            //                     await customerQuery.addHistoryCommissione(user[0].username, userF1[0].id, price * percent, "Level Commission", coin.symbol, price)
                                            //                     await messageTelegram(`[STAKING]: ${userF1[0].username} received ${price * percent} USD staking commission from ${user[0].username}`)
                                            //                 } else {
                                            //                     await messageTelegram(`[STAKING]: ${userF1[0].username} no commission from ${user[0].username} because your not buy package staking`)
                                            //                 }
                                            //             }
                                            //             idParentF1 = userF1[0].inviter_id
                                            //         } else {
                                            //             idParentF1 = null
                                            //         }
                                            //     }
                                            // }


                                            await messageTelegram(`============================================`)

                                            await customerQuery.addNotification(idUser, wallet[0].username, "Staking", `Successful $${price} staking package`)
                                            success(res, "Package activated successfully ! ", {})

                                        } else {
                                            error_400(res, "Your balance is insufficient !", 3)

                                        }
                                    } else {
                                        error_400(res, "Amount is not valid", 13)
                                    }
                                } else {
                                    error_400(res, coin, 18)
                                }

                            } else {
                                error_400(res, "The month is not valid !", 2)
                            }
                        } else {
                            error_400(res, "id price is not define!")
                        }

                    } else {
                        error_400(res, `Users who have not created a ${coin.symbol} wallet`)
                    }
                } else {
                    error_400(res, "The user hasn't registered yet", 1)
                }


            }
        } catch (error) {
            console.log(error);

            error_500(res, error)
        }
    });
// https: //www.youtube.com/watch?v=ZnXuXi9zXFQ
router.post('/ledding', passport.authenticate('jwt', {
    session: false
}), authenticateWallet, async function (req, res, next) {
    //console.log(req.body);
    //console.log(req.user);
    try {
        var {
            amount,

            symbol

        } = req.body
        const flag = validationBody({
            amount,

            symbol
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        // database :  user_id, package_id, created_at,
        // amount
        const idUser = req.user
        if (idUser) {
            const user = await customerQuery.getWalletToIdUser(idUser, symbol)
            if (user.length > 0) {
                if (amount >= 0) {
                    if (symbol == "USDT.TRC20") {
                        symbol = "USDT"
                    }
                    var coin = await getPriceCoin(symbol)
                    const flagIf = await flagAmountToSymBol(idUser, coin.symbol, amount)
                    if (flagIf) {
                        const oneCoinToUSD = coin.lastPrice
                        await updateBalanceWalletOrUser(idUser, coin.symbol, amount)
                        const userParent = await customerQuery.getUserToId(idUser)
                        const parent = JSON.parse(userParent[0].parent)
                        for (let i = 1; i <= 9; i++) {
                            var percent
                            if (i == 1) {
                                percent = 0.06
                            } else if (i == 2) {
                                percent = 0.04
                            } else if (i == 3) {
                                percent = 0.02
                            } else if (i == 4) {
                                percent = 0.01
                            } else if (i == 5) {
                                percent = 0.005
                            } else if (i == 6) {
                                percent = 0.005
                            } else if (i == 7) {
                                percent = 0.005
                            } else if (i == 8) {
                                percent = 0.005
                            } else if (i == 9) {
                                percent = 0.005
                            }
                            if (parent[`F${i}`] != "") {
                                var walletUserParent = await customerQuery.getWalletToIdUser(parent[`F${i}`])
                            }
                            if (walletUserParent.length > 0 && parent[`F${i}`] != "") {
                                const priceAmountParent = coin.lastPrice / amount
                                await updateBalanceWalletOrUserBonus(parent[`F${i}`], "usd", priceAmountParent)
                                await customerQuery.addBalanceLog(parent[`F${i}`], amount * percent, walletUserParent[0][`usd_balance`], levelCommission, "direct_bonus", "usd", `Direct Bonus for: ${walletUserParent[0].username}. From: ${user[0].username}. Amount: ${amount} ${coin.symbol}`)
                            }
                        }
                        await customerQuery.addLedding(idUser, oneCoinToUSD * amount, oneCoinToUSD, 0.67, coin.symbol.toLowerCase(), 20, 0.67, 12, 0, 360, amount, oneCoinToUSD * amount * 3, amount)
                        await customerQuery.addNotification(idUser, user[0].username, "Ledding", `Ledding successfully ${amount} ${coin.symbol}`)

                        success(res, `Ledding ${amount} ${coin.symbol} successful !`)
                    } else {
                        error_400(res, `Your ${coin.symbol} balance is not enough!`, 2)
                    }
                    // switch (symbol) {
                    //     // case "USDTERC20":

                    //     //     break;
                    //     // case "USDTTRC20":
                    //     //     break;
                    //     case "BTC":
                    //         if (amount <= user[0].btc_balance) {
                    //             const coin = await binance.prevDay("BTCBUSD");
                    //             const oneCoinToUSD = coin.lastPrice
                    //             await customerQuery.addLedding(idUser, oneCoinToUSD * amount, oneCoinToUSD, 0.67, "BTC", 20, 0.67, 12, 0, 360, amount, oneCoinToUSD * amount * 3, amount)
                    //             const balance = user[0].btc_balance - amount
                    //             await customerQuery.updateBalance(idUser, balance)
                    //             const parent = JSON.parse(user[0].parent)
                    //             for (let i = 1; i <= 9; i++) {
                    //                 var percent
                    //                 if (i == 1) {
                    //                     percent = 0.06
                    //                 } else if (i == 2) {
                    //                     percent = 0.04
                    //                 } else if (i == 3) {
                    //                     percent = 0.02


                    //                 } else if (i == 4) {
                    //                     percent = 0.01

                    //                 } else if (i == 5) {
                    //                     percent = 0.005

                    //                 } else if (i == 6) {
                    //                     percent = 0.005

                    //                 } else if (i == 7) {
                    //                     percent = 0.005

                    //                 } else if (i == 8) {
                    //                     percent = 0.005

                    //                 } else if (i == 9) {
                    //                     percent = 0.005

                    //                 }

                    //                 if (parent[`F${i}`] != "") {
                    //                     var walletUserParent = await customerQuery.getUserToId(parent[`F${i}`])
                    //                 }
                    //                 if (walletUserParent.length > 0 && parent[`F${i}`] != "") {
                    //                     var levelCommission = walletUserParent[0].btc_balance + amount * percent
                    //                     await customerQuery.addBalanceLog(parent[`F${i}`], amount * percent, walletUserParent[0].btc_balance, levelCommission, "direct_bonus", "btc", `Direct Bonus for: ${walletUserParent[0].username}. From: ${user[0].username}. Amount: ${amount} ${symbol}`)
                    //                     await customerQuery.updateBTCBalance(parent[`F${i}`], levelCommission)
                    //                 }
                    //             }
                    //             success(res, `Ledding ${amount} ${symbol} successful !`)
                    //         } else {
                    //             error_400(res, "Your BTC balance is not enough!", 2)
                    //         }
                    //         break;
                    //     case "ETH":
                    //         if (amount <= user.eth_balance) {
                    //             const coin = await binance.prevDay("ETHBUSD");
                    //             const oneCoinToUSD = coin.lastPrice
                    //             await customerQuery.addLedding(idUser, oneCoinToUSD * amount, oneCoinToUSD, 0.67, "ETH", 20, 0.67, 12, 0, 360, amount, oneCoinToUSD * amount * 3, amount)
                    //             const balance = user[0].eth_balance - amount
                    //             await customerQuery.updateETHBalance(idUser, balance)
                    //             const parent = JSON.parse(user[0].parent)
                    //             for (let i = 1; i <= 9; i++) {
                    //                 var percent
                    //                 if (i == 1) {
                    //                     percent = 0.06
                    //                 } else if (i == 2) {
                    //                     percent = 0.04
                    //                 } else if (i == 3) {
                    //                     percent = 0.02


                    //                 } else if (i == 4) {
                    //                     percent = 0.01

                    //                 } else if (i == 5) {
                    //                     percent = 0.005

                    //                 } else if (i == 6) {
                    //                     percent = 0.005

                    //                 } else if (i == 7) {
                    //                     percent = 0.005

                    //                 } else if (i == 8) {
                    //                     percent = 0.005

                    //                 } else if (i == 9) {
                    //                     percent = 0.005

                    //                 }

                    //                 if (parent[`F${i}`] != "") {
                    //                     var walletUserParent = await customerQuery.getUserToId(parent[`F${i}`])
                    //                 }
                    //                 if (walletUserParent.length > 0 && parent[`F${i}`] != "") {
                    //                     var levelCommission = walletUserParent[0].eth_balance + amount * percent
                    //                     await customerQuery.addBalanceLog(parent[`F${i}`], amount * percent, walletUserParent[0].eth_balance, levelCommission, "direct_bonus", "btc", `Direct Bonus for: ${walletUserParent[0].username}. From: ${user[0].username}. Amount: ${amount} ${symbol}`)
                    //                     await customerQuery.updateETHBalance(parent[`F${i}`], levelCommission)
                    //                 }
                    //             }
                    //             success(res, `Ledding ${amount} ${symbol} successful !`)
                    //         } else {
                    //             error_400(res, "Your ETH balance is not enough!", 3)
                    //         }
                    //         break;
                    //     case "TRX":
                    //         if (amount <= user.trx_balance) {
                    //             const coin = await binance.prevDay("ETHBUSD");
                    //             const oneCoinToUSD = coin.lastPrice
                    //             await customerQuery.addLedding(idUser, oneCoinToUSD * amount, oneCoinToUSD, 0.67, "ETH", 20, 0.67, 12, 0, 360, amount, oneCoinToUSD * amount * 3, amount)
                    //             const balance = user[0].trx_balance - amount
                    //             await customerQuery.updateTRXBalance(idUser, balance)
                    //             const parent = JSON.parse(user[0].parent)
                    //             for (let i = 1; i <= 9; i++) {
                    //                 var percent
                    //                 if (i == 1) {
                    //                     percent = 0.06
                    //                 } else if (i == 2) {
                    //                     percent = 0.04
                    //                 } else if (i == 3) {
                    //                     percent = 0.02


                    //                 } else if (i == 4) {
                    //                     percent = 0.01

                    //                 } else if (i == 5) {
                    //                     percent = 0.005

                    //                 } else if (i == 6) {
                    //                     percent = 0.005

                    //                 } else if (i == 7) {
                    //                     percent = 0.005

                    //                 } else if (i == 8) {
                    //                     percent = 0.005

                    //                 } else if (i == 9) {
                    //                     percent = 0.005

                    //                 }

                    //                 if (parent[`F${i}`] != "") {
                    //                     var walletUserParent = await customerQuery.getUserToId(parent[`F${i}`])
                    //                 }
                    //                 if (walletUserParent.length > 0 && parent[`F${i}`] != "") {
                    //                     var levelCommission = walletUserParent[0].trx_balance + amount * percent
                    //                     await customerQuery.addBalanceLog(parent[`F${i}`], amount * percent, walletUserParent[0].trx_balance, levelCommission, "direct_bonus", "trx", `Direct Bonus for: ${walletUserParent[0].username}. From: ${user[0].username}. Amount: ${amount} ${symbol}`)
                    //                     await customerQuery.updateTRXBalance(parent[`F${i}`], levelCommission)
                    //                 }
                    //             }
                    //         } else {
                    //             error_400(res, "Your TRX balance is not enough!", 4)
                    //         }
                    //         break;
                    //         // case "TOKENERC20":

                    //         //     break;
                    //         // case "TOKENTRC20":
                    //         //     break;

                    //     default:
                    //         error_400(res, "Invalid symbol !", 5)
                    //         break;
                    // }
                } else {
                    error_400(res, "Invalid balance", 1)
                }
            } else {
                error_400(res, `Users who have not created a ${symbol} wallet`)
            }



        }
    } catch (error) {
        console.log(error);


        error_500(res, error)
    }
});
router.post('/convertbusd', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        var {
            symbolForm,
            symbolTo,
            amountForm
        } = req.body
        const flag = validationBody({
            symbolForm,
            symbolTo,
            amountForm
        })
        if (flag.length > 0) return error_400(res, 'Not be empty', flag)
        const idUser = req.user
        if (amountForm > 0) {
            var flagLog = await flagAmountToSymBol(idUser, symbolForm, amountForm)
            if (flagLog) {

                const user = await customerQuery.getUserToId(idUser)
                const percenrt = 0.0025
                const amountConvert = amountForm - (amountForm * percenrt)
                await updateBalanceWalletOrUser(idUser, symbolForm, amountForm)
                await updateBalanceWalletOrUserBonus(idUser, symbolTo, amountConvert)
                await customerQuery.addConvenrtCoin(idUser, amountForm, symbolForm.toUpperCase(), amountConvert, symbolTo.toUpperCase(), 1)
                await customerQuery.addNotification(idUser, user[0].username, "Swap", `Successful coin conversion from ${amountForm} ${symbolForm} to ${amountForm} ${symbolTo}`)
                await messageTelegram(`=======================================`)
                await messageTelegram(`[SWAP] User ${user[0].username} converts from ${amountForm} ${symbolForm} to ${amountConvert} ${symbolTo} swap function`)
                await messageTelegram(`=======================================`)
                success(res, "Successful coin conversion!")

            } else {
                error_400(res, "Invalid balance", 1)
            }
        } else {
            error_400(res, "Invalid balance", 1)
        }
    } catch (error) {
        error_500(res, error)
    }
})
// router.post('/convertcoin', passport.authenticate('jwt', {
//     session: false
// }), async function (req, res, next) {

//     try {
//         const {
//             symbolForm,
//             symbolTo,
//             amountForm
//         } = req.body
//         // database :  user_id, package_id, created_at,
//         // amount
//         const idUser = req.user
//       //console.log(idUser);
//         if (idUser) {
//             const walletTest1 = await customerQuery.getWalletToIdUser(idUser, symbolForm)
//             const walletTest2 = await customerQuery.getWalletToIdUser(idUser, symbolTo)
//             if (walletTest1.length > 0 && walletTest2.length > 0) {
//                 var flagSymbolForm = symbolForm,
//                     flagSymbolTo = symbolTo
//                 if (symbolForm == "BOS_TRC20") {
//                     flagSymbolForm = "bos"
//                 } else if (symbolForm == "BPAY_TRC20") {
//                     flagSymbolForm = "bpay_trc20"
//                 } else if (symbolForm == "USDT.TRC20") {
//                     flagSymbolForm = "usdt"
//                 } else if (symbolForm == "WIN_TRC20") {
//                     flagSymbolForm = "win"
//                 }
//                 if (symbolTo == "BOS_TRC20") {
//                     flagSymbolTo = "bos"
//                 } else if (symbolTo == "BPAY_TRC20") {
//                     flagSymbolTo = "bpay_trc20"
//                 } else if (symbolTo == "USDT.TRC20") {
//                     flagSymbolTo = "usdt"
//                 } else if (symbolTo == "WIN_TRC20") {
//                     flagSymbolTo = "win"
//                 }


//                 var flagLog = await flagAmountToSymBol(idUser, flagSymbolForm, amountForm)
//                 const percent = 0.0025

//                 if (flagLog) {
//                     const objSymbol = await convertSymbol(symbolForm, symbolTo)
//                     var symbolBonusTo = await convertSymbolWallet(symbolTo)
//                     var symbolBonusForm = await convertSymbolWallet(symbolForm)
//                     if (objSymbol) {
//                         var prevDayForm, symbolFormConvert, symbolToConvert, flagSymbol

//                         try {
//                             if (flagSymbolForm.toLowerCase() == "usdt") {
//                                 prevDayForm = await binance.prevDay(`BUSD${flagSymbolForm.toUpperCase()}`)
//                             } else {
//                                 prevDayForm = await binance.prevDay(`${flagSymbolForm}BUSD`)
//                             }
//                             symbolFormConvert = `${flagSymbolForm}`
//                             flagSymbol = true
//                         } catch (error) {}
//                         try {
//                             if (!prevDayForm) {
//                                 if (flagSymbolTo.toLowerCase() == "usdt") {
//                                     prevDayForm = await binance.prevDay(`BUSD${flagSymbolTo.toUpperCase()}`)

//                                 } else {
//                                     prevDayForm = await binance.prevDay(`${flagSymbolTo.toUpperCase()}BUSD`)
//                                 }

//                                 symbolToConvert = `${flagSymbolTo}`
//                                 flagSymbol = false
//                             }
//                         } catch (error) {}


//                         if (prevDayForm) {
//                             if (flagSymbol) {
//                                 const user = await customerQuery.getUserToId(idUser)
//                                 let UsdtToAmountForm = parseFloat(amountForm) * parseFloat(prevDayForm.lastPrice)
//                                 let amountTo = parseFloat(prevDayForm.lastPrice) / parseFloat(objSymbol.lastPriceTo)
//                                 var amountPercent = parseFloat(amountTo) * parseFloat(percent)
//                                 var amountPriceTo = parseFloat(amountTo) - parseFloat(amountPercent)
//                                 await updateBalanceWalletOrUser(idUser, symbolBonusForm, parseFloat(amountForm))
//                                 await updateBalanceWalletOrUserBonus(idUser, symbolBonusTo, parseFloat(amountPriceTo))
//                                 await customerQuery.addConvenrtCoin(idUser, amountForm, symbolBonusForm.toUpperCase(), amountPriceTo, symbolBonusTo.toUpperCase(), objSymbol.lastPriceTo)
//                                 await customerQuery.addNotification(idUser, user[0].username, "Swap", `Successful coin conversion from ${amountForm} ${symbolForm} to ${amountPriceTo} ${symbolTo}`)
//                             } else {

//                                 const user = await customerQuery.getUserToId(idUser)
//                                 let UsdtToAmountForm = parseFloat(amountForm) * parseFloat(objSymbol.lastPriceForm)
//                                 let amountTo = parseFloat(UsdtToAmountForm) / parseFloat(prevDayForm.lastPrice)
//                                 var amountPercent = parseFloat(amountTo) * parseFloat(percent)
//                                 var amountPriceTo = parseFloat(percent) - parseFloat(amountPercent)
//                                 await updateBalanceWalletOrUser(idUser, objSymbol.symbolForm, parseFloat(amountForm))
//                                 await updateBalanceWalletOrUserBonus(idUser, symbolBonusTo, parseFloat(amountPriceTo))
//                                 await customerQuery.addConvenrtCoin(idUser, amountForm, objSymbol.symbolForm.toUpperCase(), amountPriceTo, symbolBonusTo.toUpperCase(), objSymbol.lastPriceTo)
//                                 await customerQuery.addNotification(idUser, user[0].username, "Swap", `Successful coin conversion from ${amountForm} ${symbolForm} to ${amountPriceTo} ${symbolTo}`)
//                             }
//                         } else {
//                             ///// 1coin nội bộ và 1 coin ngoài
//                             //   //console.log("okasd123", objSymbol.symbolForm);
//                             //     var symbolTransaction,lastPrice
//                             //     if (objSymbol.symbolForm) {
//                             //        lastPrice = objSymbol.lastPriceForm
//                             //    }
//                             const user = await customerQuery.getUserToId(idUser)
//                             let UsdtToAmountForm = parseFloat(amountForm) * parseFloat(objSymbol.lastPriceForm)
//                             let amountTo = parseFloat(UsdtToAmountForm) / parseFloat(objSymbol.lastPriceTo)
//                             const fee = parseFloat(amountTo) * parseFloat(percent)
//                             amountTo = parseFloat(amountTo) - parseFloat(fee)
//                             var rateForm = 1 / parseFloat(objSymbol.lastPriceForm)
//                             var rateTo = 1 / parseFloat(objSymbol.lastPriceForm)
//                             var rate = parseFloat(rateForm) / parseFloat(rateTo)
//                             await updateBalanceWalletOrUser(idUser, symbolBonusForm, amountForm)
//                             await updateBalanceWalletOrUserBonus(idUser, symbolBonusTo, amountTo)
//                             await customerQuery.addConvenrtCoin(idUser, amountForm, symbolBonusForm, amountTo, symbolBonusTo.toUpperCase(), rate)
//                             await customerQuery.addNotification(idUser, user[0].username, "Swap", `Successful coin conversion from ${amountForm} ${symbolForm} to ${amountTo} ${symbolTo}`)
//                         }
//                         const userrr = await customerQuery.getUserToId(idUser)
//                 await messageTelegram(`=======================================`)

//                         await messageTelegram(`User ${userrr[0].username} converts from ${amountForm} ${symbolForm} to ${amountTo} ${symbolTo} swap function`)
//                 await messageTelegram(`=======================================`)
//                 success(res, "Successful coin conversion!")

//                     } else {
//                         ///// COIN THỊ TRƯỜNG

//                         const flag = await flagAmountToSymBol(idUser, flagSymbolForm, amountForm)
//                         if (flag) {
//                             var prevDayForm, symbol, checkConvert

//                             try {
//                                 prevDayForm = await binance.prevDay(`${flagSymbolForm.toUpperCase()}${flagSymbolTo.toUpperCase()}`)
//                                 symbol = `${symbolForm}${symbolTo}`
//                                 checkConvert = true
//                             } catch (error) {}
//                             if (!prevDayForm) {
//                                 prevDayForm = await binance.prevDay(`${flagSymbolTo.toUpperCase()}${flagSymbolForm.toUpperCase()}`)
//                                 symbol = `${symbolTo}${symbolForm}`
//                                 checkConvert = false
//                             }

//                             var amountPriceTo, amountPercent, amountTo
//                             const user = await customerQuery.getUserToId(idUser)
//                             if (checkConvert) {
//                                 amountPriceTo = parseFloat(amountForm) * parseFloat(prevDayForm.lastPrice)
//                             } else {
//                                 amountPriceTo = parseF(amountForm) / parseFloat(prevDayForm.lastPrice)
//                             }
//                             amountPercent = parseFloat(amountPriceTo) * parseFloat(percent)
//                             amountTo = parseFloat(amountPriceTo) - parseFloat(amountPercent)
//                             await updateBalanceWalletOrUser(idUser, flagSymbolForm, amountForm)
//                             await updateBalanceWalletOrUserBonus(idUser, symbolBonusTo, amountTo)
//                             await customerQuery.addConvenrtCoin(idUser, amountForm, symbolForm, amountTo, symbolBonusTo.toUpperCase(), prevDayForm.lastPrice)
//                             await customerQuery.addNotification(idUser, user[0].username, "Swap", `Successful coin conversion from ${amountForm} ${symbolForm} to ${amountTo} ${symbolTo}`)
//                             await messageTelegram(`User ${user[0].username} converts from ${amountForm} ${symbolForm} to ${amountTo} ${symbolTo} swap function`)
//                             success(res, "Successful coin conversion!")
//                         } else {
//                             error_400(res, "Invalid balance", 4)
//                         }
//                     }
//                 } else {
//                     error_400(res, "Insufficient balance", 6)
//                 }
//             } else {
//                 error_400(res, `Users who have not created a ${symbolForm} wallet or ${symbolTo} wallet`, 5)
//             }
//             // if (symbolForm.toLowerCase() == "usd" || symbolTo.toLowerCase() == "usd") {
//             //     const flagSymbol = await flagWalletUSD(symbolForm, symbolTo, idUser)
//             //     if (flagSymbol == true) {
//             //         var flagSymbolForm = symbolForm,
//             //             flagSymbolTo = symbolTo
//             //         if (symbolForm == "BOS_TRC20") {
//             //             flagSymbolForm = "bos"
//             //         } else if (symbolForm == "BPAY_TRC20") {
//             //             flagSymbolForm = "bpay_trc20"
//             //         } else if (symbolForm == "USDT.TRC20") {
//             //             flagSymbolForm = "usdt"
//             //         }
//             //         if (symbolTo == "BOS_TRC20") {
//             //             flagSymbolTo = "bos"
//             //         } else if (symbolTo == "BPAY_TRC20") {
//             //             flagSymbolTo = "bpay_trc20"
//             //         } else if (symbolTo == "USDT.TRC20") {
//             //             flagSymbolTo = "usdt"
//             //         }

//             //         var flagLog = await flagAmountToSymBol(idUser, flagSymbolForm, amountForm)
//             //         const percent = 0.0025
//             //         if (flagLog) {
//             //             const objSymbol = await convertSymbol(symbolForm, symbolTo)
//             //             if (objSymbol) {
//             //                 if (objSymbol.symbolForm.toLowerCase() == flagSymbolForm.toLowerCase()) {
//             //                     await covenrtInternalCoin(idUser, amountForm, objSymbol.lastPriceForm, 1, percent, flagSymbolForm, flagSymbolTo)
//             //                 } else {
//             //                     await covenrtInternalCoin(idUser, amountForm, 1, objSymbol.lastPriceTo, percent, flagSymbolForm, flagSymbolTo)
//             //                 }
//             //             } else {

//             //                 var symbolFormConvert = symbolForm
//             //                 try {
//             //                     prevDayForm = await binance.prevDay(`${symbolForm}BUSD`)
//             //                     symbolFormConvert = `${symbolForm}`
//             //                     testSymbol = true
//             //                 } catch (error) {}
//             //                 try {
//             //                     if (!prevDayForm) {
//             //                         prevDayForm = await binance.prevDay(`${symbolTo}BUSD`)
//             //                         symbolToConvert = `${symbolTo}`
//             //                         testSymbol = false
//             //                     }
//             //                 } catch (error) {}
//             //                 if (symbolFormConvert == symbolForm) {
//             //                     await covenrtInternalCoin(idUser, amountForm, prevDayForm.lastPrice, 1, percent, symbolForm, symbolTo)
//             //                 } else {
//             //                     await covenrtInternalCoin(idUser, amountForm, 1, prevDayForm.lastPrice, percent, symbolForm, symbolTo)
//             //                 }
//             //                 // await covenrtInternalCoin(idUser, amountForm, 1, objSymbol.lastPriceTo, percent)
//             //             }
//             //             success(res, "Successful coin conversion!")
//             //         } else {
//             //             error_400(res, "Insufficient balance", 6)
//             //         }
//             //     } else {
//             //         error_400(res, `Users who have not created a ${flagSymbol} wallet `, 17)
//             //     }
//             // } else {

//             // }

//         }
//     } catch (error) {
//       console.log(error);


//         error_500(res, error)
//     }
// });
router.post('/getWallet', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const idUser = req.user
        if (idUser) {
            const obj = await getWallet(idUser)
            // delete walletUser[0].password
            // delete walletUser[0].password_fk
            // delete walletUser[0].twofa_id

            // const obj = {
            //     coin_balance: walletUser[0].coin_balance,
            //     btc_id: walletUser[0].btc_id,
            //     btc_address: walletUser[0].btc_address,
            //     btc_balance: walletUser[0].btc_balance,
            //     eth_id: walletUser[0].eth_id,
            //     eth_balance: walletUser[0].eth_balance,
            //     eth_address: walletUser[0].eth_address,
            //     coin_balance: walletUser[0].coin_balance,
            //     coin_id: walletUser[0].coin_id,
            //     coin_address: walletUser[0].coin_address,
            //     usdt_id: walletUser[0].usdt_id,
            //     usdt_balance: walletUser[0].usdt_balance,
            //     usdt_address: walletUser[0].usdt_address,
            //     usd_balance: walletUser[0].usd_balance,
            //     usd_demo_balance: walletUser[0].usd_demo_balance,
            //     usd_demo_request: walletUser[0].usd_demo_request,
            //     usdt_trc20_address: walletUser[0].usdt_trc20_address,
            //     coin_trc20_address: walletUser[0].coin_trc20_address,
            //     trx_address: walletUser[0].trx_address,
            //     trx_balance: walletUser[0].trx_balance,
            //     win_trc20_address: walletUser[0].win_trc20_address,
            //     win_trc20_balance: walletUser[0].win_trc20_balance

            // }
            success(res, "Successfully retrieved wallet information!", obj)


        }
    } catch (error) {
        console.log(error);


        error_500(res, error)
    }
});
router.post('/getProfile', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    //console.log(req.body);
    //console.log(req.user);
    try {

        // database :  user_id, package_id, created_at,
        // amount
        const idUser = req.user
        if (idUser) {
            const walletUser = await customerQuery.getUserToId(idUser)

            // const obj = {
            //     username: walletUser[0].username,
            //     unique_code: walletUser[0].unique_code,
            //     fullname: walletUser[0].fullname,
            //     address: walletUser[0].address,
            //     avatar: walletUser[0].avatar,
            //     enabled_twofa: walletUser[0].enabled_twofa,
            //     verified: walletUser[0].verified
            // }
            await getBalance(walletUser[0], `USDT`)
            success(res, "Successfully retrieved profile information!", walletUser[0])


        }
    } catch (error) {
        console.log(error);


        error_500(res, error)
    }
});

router.post('/generateOTPToken', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    //console.log(req.body);
    //console.log(req.user);
    try {
        const idUser = req.user
        const profileUser = await customerQuery.getUserToId(idUser)
        if (profileUser.length > 0) {
            if (profileUser[0].enabled_twofa != 1) {
                const secret = authenticator.generateSecret()
                const username = profileUser[0].username
                const flag = await customerQuery.editSecret(idUser, secret)
                if (flag.status == true) {
                    const otpAuth = authenticator.keyuri(username, serviceName, secret)
                    success(res, "Get OTP Auth successfully ! ", {
                        otpAuth,
                        secret
                    })
                } else {
                    error_400(res, "Added secret code failed ! ", 1)
                }
            } else {
                error_400(res, "The user has turned on 2fa", 10)
            }
        } else {
            error_400(res, "Retrieving OTP Auth failed ! ", 2)
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/turnOn2FA', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    //console.log(req.body);
    //console.log(req.user);
    try {

        const {

            otp
        } = req.body
        if (otp == "") {
            return {
                message: "OTP cannot be empty ! ",
                status: 1
            }
        }
        var token = otp
        const phone = req.user
        const profileUser = await customerQuery.getUserToId(phone)
        if (profileUser.length > 0) {
            const secret = profileUser[0].twofa_id
            let a = authenticator.verify({
                token,
                secret
            })
            if (a) {
                if (profileUser[0].enabled_twofa == 1) {
                    error_400(res, "2FA is enabled !", 8)


                } else {
                    const on2FA = await customerQuery.edit2fa(phone, true)
                    await customerQuery.addNotification(phone, profileUser[0].username, "2FA", `Successfully enabled 2FA`)
                    success(res, "2FA activation successful !")
                }

            } else {
                error_400(res, "Incorrect code ! ", 2)

            }

        } else {
            error_400(res, "The user does not exist weightsi ! ", 3)
        }
    } catch (error) {
        error_500(res, error)
    }
});
async function checkParentUser(user) {
    const listUserParent = await getListLimitPage(`users`, 1, 1, `inviter_id=${user.id}`)
    if (listUserParent.total > 0) {
        user.hasChild = true
    } else {
        user.hasChild = false
    }
}
router.post('/parentF1', async function (req, res, next) {
    try {
        const { userid, limit, page } = req.body
        const profileUser = await getListLimitPage(`users`, limit, page, `inviter_id=${userid}`)
        const arrayPromise = []
        for (let user of profileUser.array) {
            arrayPromise.push(checkParentUser(user))
        }
        await Promise.all(arrayPromise)
        success(res, 'get list parent F1 success', profileUser)
    } catch (error) {
        console.log(error, "parentF1");

        return error_500(res)
    }
})
router.post('/parent', async function (req, res, next) {

    try {
        const {
            idUser
        } = req.body
        const profileUser = await customerQuery.getUserToId(idUser)
        var array = await customerQuery.getParentToIdUser(idUser)
        var datas = {
            array: array,
            profile: {
                userName: profileUser[0].username,
                email: profileUser[0].email,

            },
        }
        for await (let array1 of datas.array) {
            let arrayParentF1 = await customerQuery.getParentToIdUser(array1.id)

            for await (array2 of arrayParentF1) {
                let arrayParentF2 = await customerQuery.getParentToIdUser(array2.id)

                array2.arrayF2 = arrayParentF2
            }
            array1.arrayF1 = arrayParentF1
        }
        const obj = {
            data: datas,
            profile: {
                userName: profileUser[0].username,
                email: profileUser[0].email
            },

        }
        success(res, "Get parent success !", obj)

    } catch (error) {
        console.log(error);

        error_500(res, "lỗi quá trình xử ly")
    }
});
router.post('/changeCountry', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {
            country_id
        } = req.body
        const userid = req.user
        await updateRowToTable(`users`, `country_id=${country_id},changeCountry=1`, `id=${userid}`)
        success(res, "Update country success!")
    } catch (error) {
        error_500(res, error)
    }
});
router.post('/turnOff2FA', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {
            otp
        } = req.body
        var token = otp
        const phone = req.user
        const profileUser = await customerQuery.getUserToId(phone)
        if (profileUser.length > 0) {
            if (profileUser[0].enabled_twofa == 1) {
                const secret = profileUser[0].twofa_id

                let a = authenticator.verify({
                    token,
                    secret
                })
                if (a) {
                    const on2FA = await customerQuery.edit2fa(phone, false)
                    await customerQuery.addNotification(phone, profileUser[0].username, "2FA", `Failed to turn off FA successfully`)

                    success(res, "2FA turned off successfully !")
                } else {
                    error_400(res, "Incorrect code! ", 2)

                }
            } else {
                error_400(res, "User has not enabled 2Fa feature ! ", 6)

            }


        } else {
            error_400(res, "User has not enabled 2Fa feature ! ", 3)

        }
    } catch (error) {
        error_500(res, error)
    }
});

router.post('/signup', async function (req, res, next) {
    try {
        const {
            Referral,
            email,
            password,
            userName,
        } = req.body
        // const idUser = validateToken.tokenUser(token)
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const ref = await customerQuery.getRefUser(Referral)
        if (ref.length > 0) {
            if (validationUserName(userName)) {
                error_400(res, "User Name cannot contain special characters!", 18)
            } else {
                const user = await customerQuery.getUserToUseName(userName)
                if (user.length <= 0) {
                    const userAcc = await customerQuery.getUserToUseName(userName)

                    if (ref[0].status == 1) {
                        if (userAcc.length < 1) {

                            const emailAccount = await customerQuery.getUserToEmail(email)
                            if (emailAccount.length == 0) {
                                const parentUser = JSON.parse(ref[0].parent)
                                const parent = {
                                    F1: "",
                                    F2: "",
                                    F3: "",
                                    F4: "",
                                    F5: "",
                                    F6: "",
                                    F7: "",
                                    F8: "",
                                    F9: ""
                                }
                                if (ref[0].id == 1) {
                                    parent[`F1`] = "1"
                                } else {
                                    for (let i = 1; i <= 9; i++) {
                                        if (i == 1) {
                                            parent[`F${i}`] = `${ref[0].id}`
                                        } else {
                                            parent[`F${i}`] = parentUser[`F${i - 1}`]
                                        }
                                    }
                                }
                                const addParent = JSON.stringify(parent)
                                // const res = await tronWeb.createAccount()
                                // const data = await customerQuery.addUser(userName.trim(), lastName, firstName, email, password, country, addParent)

                                // await customerQuery.addWallet(res.address.base58, res.address.hex, res.privateKey, res.publicKey, data.resolve.insertId)
                                // const walletUser = await customerQuery.getWalletToIdUser(idUser)
                                // const tong = walletUser[0].community + 40
                                // await customerQuery.updateCommunity(idUser, tong)
                                // console.log(walletUser[0].community);
                                const id = crypto.randomBytes(6).toString("hex");

                                const passwordMd5 = md5(md5(password))
                                const data = await customerQuery.addUserEmail(id, userName, email, passwordMd5, addParent, ref[0].id, 0)
                                const userSusscess = await customerQuery.getUserToId(data.resolve.insertId)
                                let cusObj = { id: userSusscess[0].id }
                                let token = jwt.sign({
                                    cusObj
                                }, `${process.env.KEYTOKEN}`, {
                                    expiresIn: 60 * 518400
                                });
                                await updateRowToTable(`users`, `parentUserIdWallet=id`, `id=${userSusscess[0].id}`)
                                userSusscess[0].token = token
                                delete userSusscess[0].password
                                delete userSusscess[0].password_fk
                                //console.log(token);
                                await customerQuery.addWalletCodeVND(userSusscess[0].id, userName, "BNB")
                                await customerQuery.addWalletCodeVND(userSusscess[0].id, userName, "USDT")
                                await customerQuery.addWalletCodeVND(userSusscess[0].id, userName, "BLOCK_TOKEN")
                                await customerQuery.addWallet(data.resolve.insertId, userName)
                                try {
                                    const test = await sendMail(email, "ACTIVATION CONFIRMATION", userName, password, token)
                                } catch (error) {
                                    console.log(error, "signup");
                                }
                                success(res, "Sign Up Success !", token)

                            } else {
                                error_400(res, "Email already exists !", 7)

                            }
                        } else {
                            error_400(res, "Username already exists !", 2)

                        }
                    } else {
                        error_400(res, "User is not activated yet !", 9)

                    }
                } else {
                    error_400(res, "User does not exist !", 5)

                }
            }
        } else {
            error_400(res, "Referral code does not exist!", 19)
        }


    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
})
////// WALLET
router.post('/removeAccount', passport.authenticate('jwt', {
    session: false
}), async (req, res, next) => {
    try {
        const userid = req.user
        const profileUser = await funcQuery.getRowToTable(`users`, `id=${userid}`)
        if (profileUser.length <= 0) return error_400(res, "Account is not define!")
        await funcQuery.deleteRowToTable(`users`, `id=${userid}`)
        // await funcQuery.deleteRowToTable(`tb_user_kyc`, `userid=${userid}`)
        success(res, 'Successful account deletion')

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
})
router.post('/addWallet', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const userid = req.user
        // const idUser = validateToken.tokenUser(token)
        const user = await funcQuery.getRowToTable(`users`, `id=${userid}`)
        if (user.length <= 0) return error_400(res, "User is not exit")
        const userParent = await funcQuery.getRowToTable(`users`, `id=${user[0].parentUserIdWallet}`)
        if (userParent.length <= 0) return error_400(res, "userParent is not exit")
        if (userParent[0].totalWalletChildren >= 300) return error_400(res, "You can only create 300 wallets")
        const userName = `${userParent[0].username}` + `-${process.env.NAME}` + `${userParent[0].totalWalletChildren < 10 ? `0${userParent[0].totalWalletChildren}` : `${userParent[0].totalWalletChildren}`}`
        const email = userParent[0].email
        const data = await customerQuery.addWalletAccount(userName, null, userParent[0].password, userParent[0].totalWalletChildren + 1, userParent[0].id, 0)
        const userSusscess = await customerQuery.getUserToId(data.resolve.insertId)
        let cusObj = { id: userSusscess[0].id }
        let token = jwt.sign({
            cusObj
        }, `${process.env.KEYTOKEN}`, {
            expiresIn: 60 * 518400
        });

        userSusscess[0].token = token
        delete userSusscess[0].password
        delete userSusscess[0].password_fk
        //console.log(token);
        await customerQuery.addWalletCodeVND(userSusscess[0].id, userName, "BNB")
        await customerQuery.addWalletCodeVND(userSusscess[0].id, userName, "USDT")
        await customerQuery.addWallet(data.resolve.insertId, userName)
        await updateRowToTable(`users`, `totalWalletChildren=totalWalletChildren+1`, `id=${userParent[0].id}`)
        success(res, "Wallet created successfully !", token)

        ///////////////////////////////////////////////////////////////


    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
})

router.post('/loginWallet', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const userid = req.user

        const { idUser } = req.body
        const user = await funcQuery.getRowToTable(`users`, `id=${userid}`)
        const wallet = await funcQuery.getRowToTable(`users`, `parentUserIdWallet=${user[0].parentUserIdWallet} AND id!=${idUser}`)
        const userInfo = await funcQuery.getRowToTable(`users`, `id=${idUser} AND parentUserIdWallet=${user[0].parentUserIdWallet}`)
        if (userInfo.length <= 0) return error_400(res, "user is not define")

        let cusObj = { id: userInfo[0].id }
        let token = jwt.sign({
            cusObj
        }, `${process.env.KEYTOKEN}`, {
            expiresIn: 60 * 518400
        });
        userInfo[0].token = token
        const arrayPromise = []
        for (walletItem of wallet) {
            arrayPromise.push(getBalance(walletItem, `USDT`))
            arrayPromise.push(getAddressWalletUSDTBep20(walletItem))
        }
        arrayPromise.push(getBalance(userInfo[0], `USDT`))
        arrayPromise.push(getAddressWalletUSDTBep20(userInfo[0]))
        await Promise.all(arrayPromise)
        userInfo[0].userNameParent = wallet.length > 0 ? wallet[0].username : null
        success(res, "get wallet success", { infoUserLogin: userInfo[0], wallet })
        ///////////////////////////////////////////////////////////////
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
})
router.post('/editNickNameWallet', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const userid = req.user
        const { idUser, nickName } = req.body
        const user = await funcQuery.getRowToTable(`users`, `id=${userid}`)
        if (user.length <= 0) return error_400(res, "IdUser id not define")
        //// kiểm tra xem ví con có cùng hệ thống hay không
        const userInfo = await funcQuery.getRowToTable(`users`, `id=${idUser} AND parentUserIdWallet=${user[0].parentUserIdWallet}`)
        if (userInfo.length <= 0) return error_400(res, "user is not define")
        //// kiểm tra xem idUser có phải ví cha hay không 
        const checkUserParent = await funcQuery.getRowToTable(`users`, `id=${idUser} AND parentUserIdWallet=${user[0].parentUserIdWallet}`)
        if (checkUserParent.length <= 0) return error_400(res, "This user's userName cannot be edited")
        ///////////////////////////////////////////////////////////////
        // const userNameCheck = await funcQuery.getRowToTable(`users`, `username='${userName}'`)
        // if (userNameCheck.length > 0) return error_400(res, "Username already exists")
        await updateRowToTable(`users`, `nickName='${nickName}'`, `id=${idUser}`)
        success(res, "Rename successfully")
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
})
////// END WALLET
router.post('/signupapp', validateRegisterUser(), async function (req, res, next) {
    try {
        const {
            Referral,
            email,
            password,
            country,
            userName,
            tokenRecaptcha
        } = req.body
        // const idUser = validateToken.tokenUser(token)
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const ref = await customerQuery.getRefUser(Referral)
        const secretKey = "6LdflhodAAAAAKkxRRWZXWffdP9EaXG4VyZU3jIm"
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${tokenRecaptcha}`
        const ress = await axios({
            url,
            methods: "POST"
        })
        const flag = ress.data.success
        if (true) {
            if (ref.length > 0) {
                if (validationUserName(userName)) {
                    error_400(res, "User Name cannot contain special characters!", 18)
                } else {
                    const user = await customerQuery.getUserToUseName(userName)
                    if (user.length <= 0) {
                        const userAcc = await customerQuery.getUserToUseName(userName)

                        if (ref[0].status == 1) {
                            const getCountry = await customerQuery.getCountryToUserName(country)
                            if (getCountry.length > 0) {
                                if (userAcc.length < 1) {

                                    const emailAccount = await customerQuery.getUserToEmail(email)
                                    if (emailAccount.length == 0) {
                                        const parentUser = JSON.parse(ref[0].parent)
                                        const parent = {
                                            F1: "",
                                            F2: "",
                                            F3: "",
                                            F4: "",
                                            F5: "",
                                            F6: "",
                                            F7: "",
                                            F8: "",
                                            F9: ""
                                        }
                                        if (ref[0].id == 1) {
                                            parent[`F1`] = "1"
                                        } else {
                                            for (let i = 1; i <= 9; i++) {
                                                if (i == 1) {
                                                    parent[`F${i}`] = `${ref[0].id}`
                                                } else {
                                                    parent[`F${i}`] = parentUser[`F${i - 1}`]
                                                }
                                            }
                                        }
                                        const addParent = JSON.stringify(parent)
                                        // const res = await tronWeb.createAccount()
                                        // const data = await customerQuery.addUser(userName.trim(), lastName, firstName, email, password, country, addParent)

                                        // await customerQuery.addWallet(res.address.base58, res.address.hex, res.privateKey, res.publicKey, data.resolve.insertId)
                                        // const walletUser = await customerQuery.getWalletToIdUser(idUser)
                                        // const tong = walletUser[0].community + 40
                                        // await customerQuery.updateCommunity(idUser, tong)
                                        // console.log(walletUser[0].community);
                                        const id = crypto.randomBytes(6).toString("hex");

                                        const passwordMd5 = md5(md5(password))
                                        const data = await customerQuery.addUserEmail(id, userName, email, passwordMd5, getCountry[0].id, addParent, ref[0].id, 1)
                                        //console.log(data);
                                        const userSusscess = await customerQuery.getUserToId(data.resolve.insertId)

                                        let cusObj = { id: userSusscess[0].id }
                                        let token = jwt.sign({
                                            cusObj
                                        }, `${process.env.KEYTOKEN}`, {
                                            expiresIn: 60 * 518400
                                        });
                                        userSusscess[0].token = token
                                        delete userSusscess[0].password
                                        delete userSusscess[0].password_fk
                                        //console.log(token);
                                        await customerQuery.addWalletCodeVND(userSusscess[0].id, userName, "VND")
                                        await customerQuery.addWalletCodeVND(userSusscess[0].id, userName, "USDT")
                                        await customerQuery.addWalletCodeVND(userSusscess[0].id, userName, "USD")
                                        await customerQuery.addWallet(data.resolve.insertId, userName)
                                        const test = await sendMail(email, `ACTIVATION CONFIRMATION | ${process.env.NAME}`, userName, password, token)
                                        success(res, "Sign Up Success !")

                                    } else {
                                        error_400(res, "Email already exists !", 7)

                                    }
                                } else {
                                    error_400(res, "Username already exists !", 2)

                                }
                            } else {
                                error_400(res, "Country already exists !", 13)
                            }
                        } else {
                            error_400(res, "User is not activated yet !", 9)

                        }
                    } else {
                        error_400(res, "User does not exist !", 5)

                    }
                }
            } else {
                error_400(res, "Referral code does not exist!", 19)
            }
        } else {
            error_400(res, "Robot verification failed", 1)
        }


    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
})
router.post('/login', validateLogin(), async function (req, res, next) {
    try {
        const {
            userName,
            password,
            otp,
            flag
        } = req.body
        // const idUser = validateToken.tokenUser(token)
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        const passwordMd5 = md5(md5(password))

        const user = await customerQuery.loginUser(userName, passwordMd5)

        if (user.length > 0) {
            if (user[0].status == 1) {



                let cusObj = { id: user[0].id }
                let token = jwt.sign({
                    cusObj
                }, `${process.env.KEYTOKEN}`, {
                    expiresIn: 60 * 60 * 24
                    // expiresIn: 60 * 5
                });
                //// btc,eth,usdt, usd,trx
                // const array = ["btc", "eth", "usdt", "usd", "trx"]
                // for await (e of array) {
                //     const amount = user[0][`${e}_balance`]
                //     await customerQuery.updateBalance(user[0].id, `${e}_balance`, amount)
                // }

                user[0].token = token
                //console.log(token);
                const wallet = await customerQuery.getWalletToIdUser(user[0].id, "VND")
                //XỬ LÝ HÀM CHECK CÓ 2 VÍ STF_TRC20 THÌ GOM LẠI 1 VÍ
                // const walletSTF = await customerQuery.getWalletToIdUser(user[0].id, "STF_TRC20")
                // var totalSTF = 0
                // var demos = 1
                // console.log("User:" + user[0].id + "walletSTF.length: " + walletSTF.length)
                // if (walletSTF.length >= 2) {
                //     for await (element of walletSTF) {

                //         if (element.amount > 0) {
                //             totalSTF = totalSTF + element.amount
                //         }
                //         //Ham xoa cac dong vi cu
                //         if (demos == 1) {
                //             await customerQuery.deletewalletcodeToIdUser(element.id)
                //         }
                //         demos = demos + 1
                //     }
                //     await customerQuery.updateBalance(user[0].id, totalSTF, "STF_TRC20")
                // }
                //await customerQuery.updateBalance(user[0].id, "STF_TRC20", totalSTF)
                //XỬ LÝ HÀM CHECK CÓ 2 VÍ STF_TRC20 THÌ GOM LẠI 1 VÍ


                // if (user[0].parent == null) {
                //     var idParent
                //     if (user[0].inviter_id == null || user[0].inviter_id == 0) {
                //         idParent = 1
                //     } else {
                //         idParent = user[0].inviter_id
                //     }
                //     const parent = {
                //         F1: ``,
                //         F2: "",
                //         F3: "",
                //         F4: "",
                //         F5: "",
                //         F6: "",
                //         F7: "",
                //         F8: "",
                //         F9: ""
                //     }
                //     for (let i = 1; i <= 9; i++) {
                //         if (i == 1) {
                //             parent[`F${i}`] = `${idParent}`
                //         } else {
                //             if (parent[`F${i - 1}`] != "") {
                //                 const userParent = await customerQuery.getUserToId(parent[`F${i-1}`])
                //                 if (userParent.length > 0) {
                //                     parent[`F${i}`] = userParent[0].inviter_id
                //                 }
                //             }

                //         }
                //     }
                //     const parentStr = JSON.stringify(parent)
                //     await customerQuery.updateParentUser(parentStr, user[0].id)
                // }
                if (wallet.length <= 0) {
                    await customerQuery.addWalletCodeVND(user[0].id, userName, "VND")
                }
                const walletS = await customerQuery.getWalletToIdUser(user[0].id, "USDT")
                const walletU = await customerQuery.getWalletToIdUser(user[0].id, "USD")
                if (walletS.length <= 0) {
                    await customerQuery.addWalletCodeVND(user[0].id, userName, "USDT")
                }
                if (walletU.length <= 0) {
                    await customerQuery.addWalletCodeVND(user[0].id, userName, "USD")
                }
                await customerQuery.updateLogin(user[0].id)
                await getBalance(user[0], `USDT`)
                success(res, "Logged in successfully !", user[0])
            } else {
                error_400(res, "You have not verified your email!", 10)

            }
        } else {
            error_400(res, "Email or password is incorrect! ", 2)
        }


    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
})
router.get('/verifyEmail/:token',
    async function (req, res, next) {
        try {
            const {
                token
            } = req.params
            const id = tokenUser(token, true)
            const user = await customerQuery.getUserToId(id)
            if (user.length > 0) {
                if (user[0].status != 1) {
                    await customerQuery.activeStatus(1, id)
                    if (user[0].signup_app == 1) {
                        const parent = JSON.parse(user[0].parent)
                        for (let i = 1; i <= 3; i++) {
                            var usd = 0
                            if (i == 1) {
                                usd = 100000
                            } else {
                                usd = 50000
                            }
                            if (parent[`F${i}`] != "") {
                                const IdUser = parent[`F${i}`]
                                if (IdUser) {
                                    const userParent = await customerQuery.getUserToId(IdUser)
                                    //await createTrc20Wallet(IdUser, "STF_TRC20")
                                    //const coin = await getPriceCoin("STF")
                                    //var swaptobe = usd 
                                    // await messageTelegramUser(`[AIRDROP] [${userParent[0].username}] will receive rewarded ${usd} STF (when KYC is successful)`)
                                    //await updateBalanceWalletOrUserBonus(IdUser, "STF_TRC20", parseFloat(swaptobe))
                                }
                            }
                        }

                    } else {
                        const parent = JSON.parse(user[0].parent)

                        for (let i = 1; i <= 3; i++) {
                            var usd = 0
                            if (i == 1) {
                                usd = 100000
                            } else {
                                usd = 50000
                            }
                            if (parent[`F${i}`] != "") {
                                const IdUser = parent[`F${i}`]
                                if (IdUser) {
                                    const userParent = await customerQuery.getUserToId(IdUser)
                                    //await createTrc20Wallet(IdUser, "STF_TRC20")
                                    //const coin = await getPriceCoin("STF")
                                    // var swaptobe = usd
                                    // await messageTelegramUser(`[AIRDROP] [${userParent[0].username}] will receive rewarded ${usd} STF (when KYC is successful)`)
                                    //await updateBalanceWalletOrUserBonus(IdUser, "STF_TRC20", parseFloat(swaptobe))
                                }
                            }
                        }

                    }
                    var usd = 100000
                    if (user[0].signup_app == 1) {
                        usd = 100000
                    } else {
                        usd = 50000
                    }
                    const coin = await getPriceCoin("STF")
                    //var swaptobe = usd / parseFloat(coin.lastPrice)
                    if (user.length > 0) {
                        // await createTrc20Wallet(id, "STF_TRC20")
                        // tat airdrop
                        // await messageTelegramUser(`[AIRDROP] Congratulations: [${user[0].username}] get rewarded ${usd} STF (Swap Tobe Coin)`)
                        // await updateBalanceWalletOrUserBonus(id, "STF_TRC20", parseFloat(usd))
                    }


                    let cusObj = { id: user[0].id }
                    let token = jwt.sign({
                        cusObj
                    }, `${process.env.KEYTOKEN}`, {
                        expiresIn: 60 * 518400
                    });
                    user[0].token = token
                    success(res, "Successful verification !", user[0])
                } else {
                    success(res, "Successful verification !", user[0])
                    // error_400(res, "have you verified your email?", 10)

                }
            } else {
                error_400(res, "User is not exit ! ", 2)

            }


        } catch (error) {
            console.log(error);
            error_500(res, error)
        }
    })
// 6 Ld - rNQbAAAAAMe0bxFOQT4cKGX8q8cSlfoY0_JH
router.get('/getCountry', async function (req, res, next) {
    try {
        var data = await customerQuery.getCountry()
        success(res, "Get Country Success !", data)

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.post('/getExchange', async function (req, res, next) {
    try {
        const { name } = req.body
        var data = await customerQuery.getExhange(name)
        success(res, "Get Country Success !", data)


    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.get('/getExchangeBOS', async function (req, res, next) {
    try {
        var data = await customerQuery.getExhange("BOS")
        success(res, "Get Country Success !", data)


    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.post('/forgetpassword', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {
            passwordNew
        } = req.body
        const idUser = req.user
        //console.log(idUser);
        const user = await customerQuery.getUserToId(idUser)
        if (user.length > 0) {
            await customerQuery.updatePassword(md5(md5(passwordNew)), user[0].username)
            success(res, "Password update successful")
        }
    } catch (error) {

    }
})
router.post('/updatepassword', passport.authenticate('jwt', {
    session: false
}), async function (req, res, next) {
    try {
        const {
            password,
            passwordNew
        } = req.body
        const idUser = req.user
        const user = await customerQuery.getUserToId(idUser)
        if (user.length > 0) {
            const loginUser = await customerQuery.loginUser(user[0].username, md5(md5(password)))
            if (loginUser.length > 0) {
                await customerQuery.updatePassword(md5(md5(passwordNew)), user[0].username)
                success(res, "Password update successful")
            } else {
                error_400(res, "Wrong password!", 1)
            }
        }
    } catch (error) {

    }
})
router.post('/checkuser2fa', async function (req, res, next) {
    try {
        const {
            userName
        } = req.body
        if (userName) {
            const user = await customerQuery.getUserToUseName(userName)
            if (user.length > 0) {
                if (user[0].enabled_twofa == 1) {
                    success(res, "Please verify 2fa")
                } else {
                    error_400(res, "No need to verify yourself 2fa")
                }
            } else {
                error_400(res, "No need to verify yourself 2fa")
            }
        } else {
            error_400(res, "UserName is not emty!", 1)
        }

    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.post('/checkWallet', async function (req, res, next) {
    try {
        const {
            wallet
        } = req.body
        const isWallet = await funcQuery.getRowToTable(`tb_wallet_code`, `address='${wallet}' AND code='USDT.BEP20'`)
        if (isWallet.length <= 0) return error_400(res, "wallet is not exit")
        success(res, "success")


    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.get('/getExchangeNFT', async function (req, res, next) {
    try {
        var data = await customerQuery.getExhange("NFT")
        success(res, "Get Country Success !", data)


    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.get('/getExchangeWIN', async function (req, res, next) {
    try {
        var data = await customerQuery.getExhange("WIN")
        success(res, "Get Country Success !", data)


    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});
router.get('/getExchangeBPAY', async function (req, res, next) {
    try {
        var data = await customerQuery.getExhange("BPAY")
        success(res, "Get Country Success !", data)


    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

});

function getRes() {
    return new Promise((resolve => {
        setTimeout(() => resolve(Math.random()), 5000)
    }))
}
router.post('/checkIsLogin', async function (req, res, next) {
    try {
        const {
            token
        } = req.body
        const checkToken = await funcQuery.getRowToTable(`tb_token`, `token = '${token}'`)
        if (checkToken.length > 0) {
            success(res, "is login", {})
        } else {
            error_400(res, "logout")
        }
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }
});
router.post('/test', blockRequest, async function (req, res, next) {
    try {
        const result = await getRes()
        success(res, "success", result)
        next()
    } catch (error) {
        console.log(error);
        error_500(res, error)
    }

}, unBlockRequest);

module.exports = router;